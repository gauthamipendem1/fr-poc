import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TreeRunnerService } from '../../auth/tree-runner.service';
import { AuthStepState } from '../../auth/models/callbacks';
import { environment } from '../../../environments/environment';
import { BrandingService, BrandConfig } from '../../services/branding.service';
import { NameCallbackComponent } from '../../callbacks/name-callback/name-callback.component';
import { PasswordCallbackComponent } from '../../callbacks/password-callback/password-callback.component';
import { ChoiceCallbackComponent } from '../../callbacks/choice-callback/choice-callback.component';
import { TextOutputCallbackComponent } from '../../callbacks/text-output-callback/text-output-callback.component';
import { WebauthnRegisterCallbackComponent } from '../../callbacks/webauthn-register-callback/webauthn-register-callback.component';
import { WebauthnAuthCallbackComponent } from '../../callbacks/webauthn-auth-callback/webauthn-auth-callback.component';
import { ConfirmationCallbackComponent } from '../../callbacks/confirmation-callback/confirmation-callback.component';
import { NumberAttributeInputCallbackComponent } from '../../callbacks/number-attribute-input-callback/number-attribute-input-callback.component';
import { TextInputCallbackComponent } from '../../callbacks/text-input-callback/text-input-callback.component';
import { SuspendedTextOutputCallbackComponent } from '../../callbacks/suspended-text-output-callback/suspended-text-output-callback.component';
import { RedirectCallbackComponent } from '../../callbacks/redirect-callback/redirect-callback.component';
import { SelectIdPCallbackComponent } from '../../callbacks/select-idp-callback/select-idp-callback.component';
import { MetadataCallbackComponent } from '../../callbacks/metadata-callback/metadata-callback.component';
import { DeviceProfileCallbackComponent } from '../../callbacks/device-profile-callback/device-profile-callback.component';
import { ReCaptchaEnterpriseCallbackComponent } from '../../callbacks/recaptcha-enterprise-callback/recaptcha-enterprise-callback.component';
import { PingProtectInitializeCallbackComponent } from '../../callbacks/ping-protect-initialize-callback/ping-protect-initialize-callback.component';
import { PingProtectEvaluationCallbackComponent } from '../../callbacks/ping-protect-evaluation-callback/ping-protect-evaluation-callback.component';
import { BooleanAttributeInputCallbackComponent } from '../../callbacks/boolean-attr-input-callback/boolean-attribute-input-callback.component';
import { KbaCreateCallbackComponent } from '../../callbacks/kba-create-callback/kba-create-callback.component';
import { PollingWaitCallbackComponent } from '../../callbacks/polling-wait-callback/polling-wait-callback.component';
import { RecaptchaCallbackComponent } from '../../callbacks/recaptcha-callback/recaptcha-callback.component';
import { getCallbackMapping } from '../../auth/callback-mapper';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NameCallbackComponent,
    PasswordCallbackComponent,
    ChoiceCallbackComponent,
    TextOutputCallbackComponent,
    WebauthnRegisterCallbackComponent,
    WebauthnAuthCallbackComponent,
    ConfirmationCallbackComponent,
    NumberAttributeInputCallbackComponent,
    TextInputCallbackComponent,
    SuspendedTextOutputCallbackComponent,
    RedirectCallbackComponent,
    SelectIdPCallbackComponent,
    MetadataCallbackComponent,
    DeviceProfileCallbackComponent,
    ReCaptchaEnterpriseCallbackComponent,
    PingProtectInitializeCallbackComponent,
    PingProtectEvaluationCallbackComponent,
    BooleanAttributeInputCallbackComponent,
    KbaCreateCallbackComponent,
    PollingWaitCallbackComponent,
    RecaptchaCallbackComponent
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="page-header" *ngIf="currentBrand">
          <h2 class="page-title">
            {{ currentBrand.title }}
          </h2>
          <p class="mt-2 text-center text-sm">
            Enter your credentials to access your account
          </p>
        </div>
        <div *ngIf="!currentBrand">
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        <div *ngIf="stepState" class="mt-8 space-y-6">
          <!-- Loading state -->
          <div *ngIf="stepState.isLoading" class="text-center">
            <div class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </div>
          </div>

          <!-- Error state -->
          <div *ngIf="stepState.error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Authentication Error</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ stepState.error }}</p>
                </div>
                <div class="mt-4">
                  <button type="button" (click)="startLogin()" class="text-sm font-medium text-red-800 hover:text-red-600">
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Success state -->
          <div *ngIf="stepState.isComplete" class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">Login successful! Redirecting...</p>
              </div>
            </div>
          </div>

          <!-- Step form -->
          <form *ngIf="stepState.currentStep && !stepState.isLoading && !stepState.isComplete" 
                (ngSubmit)="onSubmit()" 
                class="space-y-6">
            
            <!-- Step header -->
            <div *ngIf="stepState.currentStep.header" class="text-center">
              <h3 class="text-lg font-medium text-gray-900">{{ stepState.currentStep.header }}</h3>
            </div>

            <!-- Step description -->
            <div *ngIf="stepState.currentStep.description" class="text-center">
              <p class="text-sm text-gray-600">{{ stepState.currentStep.description }}</p>
            </div>

            <!-- Render callbacks -->
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

                <!-- Text Output Callback -->
                <app-text-output-callback 
                  *ngIf="callbackData.type === 'TextOutputCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading">
                </app-text-output-callback>

                <!-- WebAuthn Registration Callback -->
                <app-webauthn-register-callback 
                  *ngIf="callbackData.type === 'WebAuthnRegistrationCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (valueChange)="onCallbackChange($event)">
                </app-webauthn-register-callback>

                <!-- WebAuthn Authentication Callback -->
                <app-webauthn-auth-callback 
                  *ngIf="callbackData.type === 'WebAuthnAuthenticationCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (valueChange)="onCallbackChange($event)">
                </app-webauthn-auth-callback>

                <!-- Confirmation Callback -->
                <app-confirmation-callback 
                  *ngIf="callbackData.type === 'ConfirmationCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-confirmation-callback>

                <!-- Number Attribute Input Callback -->
                <app-number-attribute-input-callback 
                  *ngIf="callbackData.type === 'NumberAttributeInputCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-number-attribute-input-callback>

                <!-- Text Input Callback -->
                <app-text-input-callback 
                  *ngIf="callbackData.type === 'TextInputCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-text-input-callback>

                <!-- Boolean Attribute Input Callback -->
                <app-boolean-attr-input-callback 
                  *ngIf="callbackData.type === 'BooleanAttributeInputCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-boolean-attr-input-callback>

                <!-- KBA Create Callback -->
                <app-kba-create-callback 
                  *ngIf="callbackData.type === 'KbaCreateCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-kba-create-callback>

                <!-- Suspended Text Output Callback -->
                <app-suspended-text-output-callback 
                  *ngIf="callbackData.type === 'SuspendedTextOutputCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-suspended-text-output-callback>

                <!-- reCAPTCHA Callback -->
                <app-recaptcha-callback 
                  *ngIf="callbackData.type === 'ReCaptchaCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-recaptcha-callback>

                <!-- reCAPTCHA Enterprise Callback -->
                <app-recaptcha-enterprise-callback 
                  *ngIf="callbackData.type === 'ReCaptchaEnterpriseCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-recaptcha-enterprise-callback>

                <!-- Redirect Callback -->
                <app-redirect-callback 
                  *ngIf="callbackData.type === 'RedirectCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-redirect-callback>

                <!-- Select IdP Callback -->
                <app-select-idp-callback 
                  *ngIf="callbackData.type === 'SelectIdPCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-select-idp-callback>

                <!-- Metadata Callback -->
                <app-metadata-callback 
                  *ngIf="callbackData.type === 'MetadataCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-metadata-callback>

                <!-- Device Profile Callback -->
                <app-device-profile-callback 
                  *ngIf="callbackData.type === 'DeviceProfileCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-device-profile-callback>

                <!-- Polling Wait Callback -->
                <app-polling-wait-callback 
                  *ngIf="callbackData.type === 'PollingWaitCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-polling-wait-callback>

                <!-- PingOne Protect Initialize Callback -->
                <app-ping-protect-initialize-callback 
                  *ngIf="callbackData.type === 'PingOneProtectInitializeCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-ping-protect-initialize-callback>

                <!-- PingOne Protect Evaluation Callback -->
                <app-ping-protect-evaluation-callback 
                  *ngIf="callbackData.type === 'PingOneProtectEvaluationCallback'"
                  [callback]="callbackData.payload"
                  [disabled]="stepState.isLoading"
                  (onSubmit)="onCallbackSubmit($event)">
                </app-ping-protect-evaluation-callback>

                <!-- Unknown callback type -->
                <div *ngIf="!isSupportedCallback(callbackData.type)" 
                     class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p class="text-sm text-yellow-800">
                    Unsupported callback type: {{ callbackData.type }}
                  </p>
                  <details class="mt-2">
                    <summary class="text-xs text-yellow-600 cursor-pointer">Show details</summary>
                    <pre class="text-xs text-yellow-600 mt-1 overflow-auto">{{ callbackData.payload | json }}</pre>
                  </details>
                </div>

              </ng-container>
            </div>

            <!-- Submit button -->
            <div>
              <button
                type="submit"
                [disabled]="stepState.isLoading"
                class="btn-primary group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!stepState.isLoading">Continue</span>
                <span *ngIf="stepState.isLoading">Processing...</span>
              </button>
            </div>
          </form>

          <!-- Links -->
          <div class="text-center space-y-2">
            <div>
              <a routerLink="/register" class="text-sm text-blue-600 hover:text-blue-500">
                Don't have an account? Sign up
              </a>
            </div>
            <div class="border-t pt-4 mt-4">
              <a routerLink="/documentation" class="text-xs text-gray-500 hover:text-gray-700">
                📚 View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
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

    this.subscription.add(
      this.treeRunner.stepState$.subscribe(state => {
        this.stepState = state;
        
        if (state.isComplete) {
          // Navigate to account page or redirect URL
          setTimeout(() => {
            this.router.navigate(['/account']);
          }, 1500);
        }
      })
    );

    this.startLogin();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.treeRunner.reset();
  }

  startLogin(): void {
    this.treeRunner.startTree(environment.fr.treeLogin).subscribe({
      error: (error) => {
        console.error('Login tree failed:', error);
      }
    });
  }

  onCallbackChange(callback: any): void {
    // Callback has been updated, no additional action needed
    console.log('Callback updated:', callback);
  }

  onCallbackSubmit(value: any): void {
    // Handle direct callback submission (e.g., for auto-submitting callbacks)
    console.log('Callback submitted:', value);
    this.onSubmit();
  }

  onSubmit(): void {
    const currentStep = this.treeRunner.getCurrentStep();
    if (currentStep) {
      this.treeRunner.nextStep(currentStep).subscribe({
        error: (error) => {
          console.error('Step failed:', error);
        }
      });
    }
  }

  isSupportedCallback(type: string): boolean {
    const mapping = getCallbackMapping(type);
    return mapping !== null;
  }
}