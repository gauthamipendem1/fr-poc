# ForgeRock Angular Integration - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Callback System](#callback-system)
3. [Dynamic UI Rendering](#dynamic-ui-rendering)
4. [Branding System](#branding-system)
5. [Service Layer](#service-layer)
6. [Component Architecture](#component-architecture)
7. [Data Flow](#data-flow)
8. [Development Guidelines](#development-guidelines)

## Architecture Overview

### System Components
The ForgeRock integration follows a reactive Angular architecture with the following key components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular Application                      │
├─────────────────────────────────────────────────────────────┤
│  Page Components (Login, Register, Account)                │
│  ├── TreeRunnerService (Authentication Flow Management)     │
│  ├── BrandingService (Dynamic Styling)                     │
│  └── Callback Components (UI Rendering)                    │
├─────────────────────────────────────────────────────────────┤
│                ForgeRock JavaScript SDK                    │
├─────────────────────────────────────────────────────────────┤
│              ForgeRock Authentication Service              │
└─────────────────────────────────────────────────────────────┘
```

### Key Technologies
- **Angular 20.3.0**: Standalone components with lazy loading
- **ForgeRock JavaScript SDK v4.8.2**: Authentication tree communication
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming for state management
- **Tailwind CSS + Dynamic CSS**: Styling with brand customization

## Callback System

### What are Callbacks?

Callbacks are ForgeRock's way of requesting information from users during authentication flows. Each callback represents a specific type of user interaction (username input, password, choice selection, etc.).

### Callback Architecture

#### Base Callback Interface
```typescript
// src/app/auth/models/callbacks.ts
export interface BaseCallbackInterface {
  callback: any;
  disabled?: boolean;
}
```

#### Base Branded Callback Class
```typescript
// src/app/callbacks/base-branded-callback.ts
export abstract class BaseBrandedCallback implements OnInit, OnDestroy {
  protected currentBrand!: BrandConfig;
  private brandSubscription!: Subscription;

  constructor(protected brandingService: BrandingService) {}

  ngOnInit(): void {
    // Subscribe to branding changes
    this.brandSubscription = this.brandingService.currentBrand$.subscribe(
      brand => {
        this.currentBrand = brand;
      }
    );
  }

  getBrandClasses(): string {
    return this.brandingService.getBrandClasses();
  }
}
```

### Callback Implementation Pattern

Each callback follows this implementation pattern:

```typescript
@Component({
  selector: 'app-name-callback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="callback-container" [ngClass]="getBrandClasses()">
      <label class="form-label">{{ getPrompt() }}</label>
      <input 
        type="text" 
        class="form-input"
        [(ngModel)]="value" 
        [disabled]="disabled"
        (ngModelChange)="onValueChange()"
      />
      <div class="error-message" *ngIf="hasError()">
        {{ getErrorMessage() }}
      </div>
    </div>
  `
})
export class NameCallbackComponent extends BaseBrandedCallback implements BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  value = '';

  constructor(brandingService: BrandingService) {
    super(brandingService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.value = this.callback.getInputValue() || '';
  }

  onValueChange(): void {
    this.callback.setInputValue(this.value);
    this.valueChange.emit(this.callback);
  }

  getPrompt(): string {
    return this.callback.getPrompt() || 'Enter value';
  }

  hasError(): boolean {
    return this.callback.getFailedPolicies()?.length > 0;
  }

  getErrorMessage(): string {
    const policies = this.callback.getFailedPolicies();
    return policies?.[0]?.policyRequirement || 'Invalid input';
  }
}
```

### Supported Callback Types

The system supports all 26 ForgeRock callback types:

| Callback Type | Purpose | Component File |
|---------------|---------|---------------|
| NameCallback | Username input | `name-callback.component.ts` |
| PasswordCallback | Password input | `password-callback.component.ts` |
| ChoiceCallback | Multiple choice selection | `choice-callback.component.ts` |
| TextOutputCallback | Display messages | `text-output-callback.component.ts` |
| WebAuthnRegistrationCallback | Biometric registration | `webauthn-register-callback.component.ts` |
| WebAuthnAuthenticationCallback | Biometric authentication | `webauthn-auth-callback.component.ts` |
| ValidatedCreateUsernameCallback | Username creation with validation | `validated-create-username-callback.component.ts` |
| ValidatedCreatePasswordCallback | Password creation with validation | `validated-create-password-callback.component.ts` |
| StringAttributeInputCallback | Generic string input | `string-attribute-input-callback.component.ts` |
| NumberAttributeInputCallback | Numeric input | `number-attribute-input-callback.component.ts` |
| BooleanAttributeInputCallback | Checkbox input | `boolean-attr-input-callback.component.ts` |
| TermsAndConditionsCallback | Legal agreements | `terms-and-conditions-callback.component.ts` |
| ConfirmationCallback | Yes/No confirmations | `confirmation-callback.component.ts` |
| TextInputCallback | Generic text input | `text-input-callback.component.ts` |
| SuspendedTextOutputCallback | Suspended flow messages | `suspended-text-output-callback.component.ts` |
| RedirectCallback | External redirects | `redirect-callback.component.ts` |
| SelectIdPCallback | Identity provider selection | `select-idp-callback.component.ts` |
| MetadataCallback | Hidden metadata | `metadata-callback.component.ts` |
| DeviceProfileCallback | Device fingerprinting | `device-profile-callback.component.ts` |
| ReCaptchaCallback | reCAPTCHA v2 | `recaptcha-callback.component.ts` |
| ReCaptchaEnterpriseCallback | reCAPTCHA Enterprise | `recaptcha-enterprise-callback.component.ts` |
| KbaCreateCallback | Knowledge-based auth setup | `kba-create-callback.component.ts` |
| PollingWaitCallback | Polling for external events | `polling-wait-callback.component.ts` |
| PingOneProtectInitializeCallback | PingOne Protect setup | `ping-protect-initialize-callback.component.ts` |
| PingOneProtectEvaluationCallback | PingOne Protect evaluation | `ping-protect-evaluation-callback.component.ts` |
| HiddenValueCallback | Hidden form values | (handled internally) |

## Dynamic UI Rendering

### TreeRunnerService - The Core Engine

The `TreeRunnerService` manages the entire authentication flow:

```typescript
// src/app/auth/tree-runner.service.ts
@Injectable({
  providedIn: 'root'
})
export class TreeRunnerService {
  private stepStateSubject = new BehaviorSubject<AuthStepState>({
    isLoading: false,
    isComplete: false,
    error: null,
    currentStep: null
  });

  public stepState$ = this.stepStateSubject.asObservable();

  startTree(treeName: string): Observable<FRStep> {
    this.updateState({ isLoading: true, error: null });
    
    return from(FRAuth.next()).pipe(
      tap(step => this.processStep(step)),
      catchError(error => this.handleError(error))
    );
  }

  private processStep(step: FRStep): void {
    if (step.type === StepType.LoginSuccess) {
      this.updateState({ 
        isComplete: true, 
        isLoading: false,
        currentStep: null 
      });
    } else {
      const authStep = this.convertToAuthStep(step);
      this.updateState({ 
        isLoading: false,
        currentStep: authStep 
      });
    }
  }
}
```

### Authentication Step State Management

The system uses reactive state management:

```typescript
// src/app/auth/models/callbacks.ts
export interface AuthStepState {
  isLoading: boolean;
  isComplete: boolean;
  error: string | null;
  currentStep: AuthStep | null;
}

export interface AuthStep {
  stepId: string;
  header?: string;
  description?: string;
  callbacks: CallbackData[];
}

export interface CallbackData {
  type: string;
  payload: any;
}
```

### Dynamic Component Loading

Page components dynamically render callbacks:

```typescript
// src/app/pages/login/login.component.ts
template: `
  <div class="space-y-4">
    <ng-container *ngFor="let callbackData of stepState.currentStep.callbacks">
      
      <!-- Name Callback -->
      <app-name-callback 
        *ngIf="callbackData.type === 'NameCallback'"
        [callback]="callbackData.payload"
        [disabled]="stepState.isLoading"
        (valueChange)="onCallbackChange($event)">
      </app-name-callback>

      <!-- Password Callback -->
      <app-password-callback 
        *ngIf="callbackData.type === 'PasswordCallback'"
        [callback]="callbackData.payload"
        [disabled]="stepState.isLoading"
        (valueChange)="onCallbackChange($event)">
      </app-password-callback>

      <!-- Choice Callback -->
      <app-choice-callback 
        *ngIf="callbackData.type === 'ChoiceCallback'"
        [callback]="callbackData.payload"
        [disabled]="stepState.isLoading"
        (valueChange)="onCallbackChange($event)">
      </app-choice-callback>

      <!-- ... other callback types -->
      
    </ng-container>
  </div>
`
```

### Step Progression Flow

```
1. User Action (Form Submit/Button Click)
   ↓
2. TreeRunnerService.nextStep()
   ↓
3. ForgeRock SDK Call (FRAuth.next())
   ↓
4. Response Processing
   ├── Success → Navigate to success page
   ├── More Steps → Update stepState with new callbacks
   └── Error → Display error message
   ↓
5. Angular Change Detection
   ↓
6. UI Re-render with New Callbacks
```

## Branding System

### BrandingService Architecture

The branding system provides complete application theming:

```typescript
// src/app/services/branding.service.ts
export interface BrandConfig {
  name: string;
  cssFile: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
    fontFamily: string;
  };
  logo?: string;
  title: string;
  layout: 'standard' | 'compact' | 'modern' | 'minimal' | 'enterprise' | 'mobile';
  spacing: {
    container: string;
    input: string;
    button: string;
    margin: string;
  };
  typography: {
    scale: 'small' | 'medium' | 'large';
    weight: 'light' | 'normal' | 'bold';
  };
}

@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  private currentBrandSubject = new BehaviorSubject<BrandConfig>(this.getDefaultBrand());
  public currentBrand$ = this.currentBrandSubject.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.detectAndApplyBrand(event.url);
      });
  }

  private detectAndApplyBrand(url: string): void {
    // Extract brand from URL path (e.g., /a/login -> brand 'a')
    const pathSegments = url.split('/').filter(segment => segment.length > 0);
    const brandKey = pathSegments[0] || 'default';
    
    const brand = this.brandConfigs[brandKey] || this.getDefaultBrand();
    this.currentBrandSubject.next(brand);
    this.loadBrandCSS(brand.cssFile);
  }

  private loadBrandCSS(cssFile: string): void {
    // Remove existing brand CSS link if present
    const existingLink = document.getElementById('brand-css');
    if (existingLink) {
      existingLink.remove();
    }

    // Load external brand CSS file
    const link = document.createElement('link');
    link.id = 'brand-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `/assets/styles/brands/${cssFile}`;
    
    // Apply custom properties as fallback and for dynamic values
    this.applyBrandStyles();
    
    // Append the CSS link to head
    document.head.appendChild(link);
  }
}
```

### Brand Configuration System

Brands are configured in the service:

```typescript
private brandConfigs: { [key: string]: BrandConfig } = {
  'a': {
    name: 'Brand A',
    cssFile: 'a.css',
    theme: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      borderRadius: '0.5rem',
      fontFamily: 'Inter, sans-serif'
    },
    title: 'Brand A Authentication',
    layout: 'enterprise',
    spacing: {
      container: '2rem',
      input: '1rem',
      button: '1rem 2rem',
      margin: '1.5rem'
    },
    typography: {
      scale: 'medium',
      weight: 'normal'
    }
  },
  // ... other brand configurations
};
```

### External CSS File System

Each brand has its own CSS file in `/public/assets/styles/brands/`:

```css
/* Brand A CSS File: /public/assets/styles/brands/a.css */
:root {
  --brand-primary: #1e40af;
  --brand-secondary: #3b82f6;
  --brand-bg: #f8fafc;
  --brand-text: #1e293b;
  --brand-radius: 0.5rem;
  --brand-font: 'Inter', sans-serif;
}

/* Full page styling */
.min-h-screen {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0) !important;
  font-family: var(--brand-font) !important;
}

/* Form elements */
input, select, textarea, .form-input {
  border: 2px solid #e5e7eb !important;
  border-radius: var(--brand-radius) !important;
  padding: 1rem !important;
  font-family: var(--brand-font) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
}

/* Buttons */
button, .btn-primary {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) !important;
  color: white !important;
  border-radius: var(--brand-radius) !important;
  padding: 1rem 2rem !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}
```

### Brand-Aware Component Integration

All callback components extend `BaseBrandedCallback`:

```typescript
export class ChoiceCallbackComponent extends BaseBrandedCallback {
  constructor(brandingService: BrandingService) {
    super(brandingService);
  }

  ngOnInit(): void {
    super.ngOnInit(); // Sets up brand subscription
    // Component-specific initialization
  }

  // Template uses getBrandClasses() for dynamic styling
  template: `
    <div class="callback-container" [ngClass]="getBrandClasses()">
      <!-- Component content -->
    </div>
  `
}
```

## Service Layer

### TreeRunnerService Detailed API

```typescript
// Public Methods
startTree(treeName: string): Observable<FRStep>
nextStep(step: FRStep): Observable<FRStep>
getCurrentStep(): FRStep | null
reset(): void

// Observable Streams
stepState$: Observable<AuthStepState>  // Current authentication state

// Private Methods
processStep(step: FRStep): void        // Process ForgeRock step
convertToAuthStep(step: FRStep): AuthStep  // Convert to internal format
updateState(partial: Partial<AuthStepState>): void  // Update reactive state
handleError(error: any): Observable<never>  // Error handling
```

### BrandingService Detailed API

```typescript
// Public Methods
getCurrentBrand(): BrandConfig
getBrandConfig(brandKey: string): BrandConfig | undefined
getBrandClasses(): string
getThemeStyles(): { [key: string]: string }

// Observable Streams
currentBrand$: Observable<BrandConfig>  // Current brand configuration

// Private Methods
detectAndApplyBrand(url: string): void     // Route-based brand detection
loadBrandCSS(cssFile: string): void        // External CSS loading
applyBrandStyles(): void                   // CSS custom property application
getDefaultBrand(): BrandConfig             // Fallback brand configuration
```

## Component Architecture

### Page Components Structure

```typescript
// Pattern for all page components
export class LoginComponent implements OnInit, OnDestroy {
  stepState: AuthStepState | null = null;
  currentBrand!: BrandConfig;
  private subscription = new Subscription();

  constructor(
    private treeRunner: TreeRunnerService,
    private router: Router,
    private brandingService: BrandingService
  ) {}

  ngOnInit(): void {
    // Subscribe to branding changes
    this.subscription.add(
      this.brandingService.currentBrand$.subscribe(brand => {
        this.currentBrand = brand;
      })
    );

    // Subscribe to authentication state
    this.subscription.add(
      this.treeRunner.stepState$.subscribe(state => {
        this.stepState = state;
        
        if (state.isComplete) {
          // Handle success navigation
        }
      })
    );

    this.startLogin();
  }

  onSubmit(): void {
    const currentStep = this.treeRunner.getCurrentStep();
    if (currentStep) {
      this.treeRunner.nextStep(currentStep).subscribe({
        error: (error) => console.error('Step failed:', error)
      });
    }
  }
}
```

### Callback Component Lifecycle

1. **Component Creation**: Angular creates component instance
2. **Brand Subscription**: `BaseBrandedCallback.ngOnInit()` subscribes to brand changes
3. **Data Initialization**: Component initializes with callback data
4. **User Interaction**: User inputs trigger `onValueChange()`
5. **Callback Update**: ForgeRock callback object is updated
6. **Event Emission**: Parent component is notified via `@Output()`
7. **Form Submission**: Parent calls `TreeRunnerService.nextStep()`
8. **Component Cleanup**: `ngOnDestroy()` unsubscribes from brand changes

## Data Flow

### Authentication Flow Data Movement

```
User Action → Page Component → TreeRunnerService → ForgeRock SDK → ForgeRock Server
     ↓              ↓                ↓               ↓              ↓
State Update ← UI Re-render ← Process Response ← SDK Response ← Server Response
```

### Detailed Flow Steps

1. **User Interaction**
   ```typescript
   onSubmit(): void {
     const currentStep = this.treeRunner.getCurrentStep();
     this.treeRunner.nextStep(currentStep).subscribe();
   }
   ```

2. **Service Processing**
   ```typescript
   nextStep(step: FRStep): Observable<FRStep> {
     this.updateState({ isLoading: true });
     return from(FRAuth.next(step)).pipe(
       tap(newStep => this.processStep(newStep))
     );
   }
   ```

3. **State Update**
   ```typescript
   private processStep(step: FRStep): void {
     const authStep = this.convertToAuthStep(step);
     this.updateState({ 
       isLoading: false,
       currentStep: authStep 
     });
   }
   ```

4. **UI Re-render**
   ```typescript
   // Angular automatically re-renders when stepState$ emits
   this.stepState$ // BehaviorSubject emission
   ↓
   Angular Change Detection
   ↓
   Template Updates (*ngFor, *ngIf directives)
   ↓
   New Callback Components Rendered
   ```

### Branding Flow Data Movement

```
URL Change → BrandingService → CSS Loading + Style Application → Component Re-render
```

1. **Route Navigation**
   ```typescript
   // User navigates to /a/login
   NavigationEnd event emitted by Router
   ```

2. **Brand Detection**
   ```typescript
   detectAndApplyBrand('/a/login'): void {
     const brandKey = 'a';  // Extracted from path
     const brand = this.brandConfigs['a'];
     this.currentBrandSubject.next(brand);
     this.loadBrandCSS('a.css');
   }
   ```

3. **CSS Loading**
   ```typescript
   loadBrandCSS('a.css'): void {
     // Remove previous brand CSS
     document.getElementById('brand-css')?.remove();
     
     // Add new brand CSS
     const link = document.createElement('link');
     link.href = '/assets/styles/brands/a.css';
     document.head.appendChild(link);
   }
   ```

4. **Component Updates**
   ```typescript
   // All components subscribing to currentBrand$ receive update
   this.brandingService.currentBrand$.subscribe(brand => {
     this.currentBrand = brand;
     // Angular re-renders template with new brand classes
   });
   ```

## Development Guidelines

### Adding New Callback Types

1. **Create Component File**
   ```bash
   ng generate component callbacks/my-new-callback --standalone
   ```

2. **Extend Base Class**
   ```typescript
   export class MyNewCallbackComponent extends BaseBrandedCallback 
     implements BaseCallbackInterface {
   ```

3. **Implement Required Methods**
   ```typescript
   getPrompt(): string { return this.callback.getPrompt(); }
   onValueChange(): void { 
     this.callback.setInputValue(this.value);
     this.valueChange.emit(this.callback);
   }
   ```

4. **Update Callback Mapper**
   ```typescript
   // src/app/auth/callback-mapper.ts
   case 'MyNewCallbackType':
     return 'app-my-new-callback';
   ```

5. **Add to Page Templates**
   ```html
   <app-my-new-callback 
     *ngIf="callbackData.type === 'MyNewCallbackType'"
     [callback]="callbackData.payload"
     [disabled]="stepState.isLoading"
     (valueChange)="onCallbackChange($event)">
   </app-my-new-callback>
   ```

### Creating New Brand Themes

1. **Add Brand Configuration**
   ```typescript
   // src/app/services/branding.service.ts
   'new-brand': {
     name: 'New Brand',
     cssFile: 'new-brand.css',
     theme: { /* theme config */ },
     // ... other properties
   }
   ```

2. **Create CSS File**
   ```bash
   touch /public/assets/styles/brands/new-brand.css
   ```

3. **Define Brand Styles**
   ```css
   /* Use !important to override default styles */
   input, select, textarea, .form-input {
     /* Custom brand styling */
   }
   ```

4. **Add Route Configuration**
   ```typescript
   // src/app/app.routes.ts
   {
     path: 'new-brand',
     children: [/* brand-specific routes */]
   }
   ```

### Testing Guidelines

1. **Callback Testing**
   ```typescript
   describe('NameCallbackComponent', () => {
     it('should emit value changes', () => {
       component.onValueChange();
       expect(component.valueChange.emit).toHaveBeenCalled();
     });
   });
   ```

2. **Brand Testing**
   ```typescript
   describe('BrandingService', () => {
     it('should load correct brand for path', () => {
       service.detectAndApplyBrand('/a/login');
       expect(service.getCurrentBrand().name).toBe('Brand A');
     });
   });
   ```

3. **Integration Testing**
   - Test complete authentication flows
   - Verify brand switching works across all pages
   - Ensure callback rendering for all supported types

### Performance Considerations

1. **Lazy Loading**: All page components are lazy-loaded
2. **Change Detection**: Use OnPush strategy where possible
3. **Memory Management**: Always unsubscribe in `ngOnDestroy()`
4. **CSS Optimization**: Use CSS custom properties for dynamic theming
5. **Bundle Size**: Import only needed ForgeRock SDK modules

### Error Handling

1. **Authentication Errors**: Displayed in page components
2. **Callback Validation**: Shown in individual callback components
3. **Network Errors**: Handled by TreeRunnerService with retry logic
4. **Brand Loading Errors**: Fallback to default brand
5. **Development Errors**: Comprehensive TypeScript typing prevents runtime issues