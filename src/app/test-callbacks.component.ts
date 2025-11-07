import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandingService, BrandConfig } from './services/branding.service';
import { Subscription } from 'rxjs';

// Import all callback components
import { NameCallbackComponent } from './callbacks/name-callback/name-callback.component';
import { PasswordCallbackComponent } from './callbacks/password-callback/password-callback.component';
import { ChoiceCallbackComponent } from './callbacks/choice-callback/choice-callback.component';
import { TextOutputCallbackComponent } from './callbacks/text-output-callback/text-output-callback.component';
import { ConfirmationCallbackComponent } from './callbacks/confirmation-callback/confirmation-callback.component';
import { NumberAttributeInputCallbackComponent } from './callbacks/number-attribute-input-callback/number-attribute-input-callback.component';
import { TextInputCallbackComponent } from './callbacks/text-input-callback/text-input-callback.component';
import { BooleanAttributeInputCallbackComponent } from './callbacks/boolean-attr-input-callback/boolean-attribute-input-callback.component';
import { KbaCreateCallbackComponent } from './callbacks/kba-create-callback/kba-create-callback.component';
import { SuspendedTextOutputCallbackComponent } from './callbacks/suspended-text-output-callback/suspended-text-output-callback.component';
import { RecaptchaCallbackComponent } from './callbacks/recaptcha-callback/recaptcha-callback.component';
import { ReCaptchaEnterpriseCallbackComponent } from './callbacks/recaptcha-enterprise-callback/recaptcha-enterprise-callback.component';
import { RedirectCallbackComponent } from './callbacks/redirect-callback/redirect-callback.component';
import { SelectIdPCallbackComponent } from './callbacks/select-idp-callback/select-idp-callback.component';
import { MetadataCallbackComponent } from './callbacks/metadata-callback/metadata-callback.component';
import { DeviceProfileCallbackComponent } from './callbacks/device-profile-callback/device-profile-callback.component';
import { PollingWaitCallbackComponent } from './callbacks/polling-wait-callback/polling-wait-callback.component';
import { PingProtectInitializeCallbackComponent } from './callbacks/ping-protect-initialize-callback/ping-protect-initialize-callback.component';
import { PingProtectEvaluationCallbackComponent } from './callbacks/ping-protect-evaluation-callback/ping-protect-evaluation-callback.component';
import { StringAttributeInputCallbackComponent } from './callbacks/string-attribute-input-callback/string-attribute-input-callback.component';
import { ValidatedCreateUsernameCallbackComponent } from './callbacks/validated-create-username-callback/validated-create-username-callback.component';
import { ValidatedCreatePasswordCallbackComponent } from './callbacks/validated-create-password-callback/validated-create-password-callback.component';
import { TermsAndConditionsCallbackComponent } from './callbacks/terms-and-conditions-callback/terms-and-conditions-callback.component';

@Component({
  selector: 'app-test-callbacks',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NameCallbackComponent,
    PasswordCallbackComponent,
    ChoiceCallbackComponent,
    TextOutputCallbackComponent,
    ConfirmationCallbackComponent,
    NumberAttributeInputCallbackComponent,
    TextInputCallbackComponent,
    BooleanAttributeInputCallbackComponent,
    KbaCreateCallbackComponent,
    SuspendedTextOutputCallbackComponent,
    RecaptchaCallbackComponent,
    ReCaptchaEnterpriseCallbackComponent,
    RedirectCallbackComponent,
    SelectIdPCallbackComponent,
    MetadataCallbackComponent,
    DeviceProfileCallbackComponent,
    PollingWaitCallbackComponent,
    PingProtectInitializeCallbackComponent,
    PingProtectEvaluationCallbackComponent,
    StringAttributeInputCallbackComponent,
    ValidatedCreateUsernameCallbackComponent,
    ValidatedCreatePasswordCallbackComponent,
    TermsAndConditionsCallbackComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto p-6 min-h-screen">
      <!-- Brand Header -->
      <div class="page-header">
        <h1 class="page-title">{{ currentBrand?.title || 'ForgeRock Callback UI Test Suite' }}</h1>
        <p class="text-sm opacity-75 mt-2">
          Current Brand: <strong>{{ currentBrand?.name || 'Default' }}</strong> | 
          Layout: <strong>{{ currentBrand?.layout || 'standard' }}</strong>
        </p>
        <div class="mt-4 flex flex-wrap gap-2 justify-center text-sm">
          <a href="/a/test-callbacks" class="text-white underline hover:opacity-75 px-2 py-1 bg-black bg-opacity-20 rounded">Brand A (Enterprise)</a>
          <a href="/b/test-callbacks" class="text-white underline hover:opacity-75 px-2 py-1 bg-black bg-opacity-20 rounded">Brand B (Modern)</a>
          <a href="/c/test-callbacks" class="text-white underline hover:opacity-75 px-2 py-1 bg-black bg-opacity-20 rounded">Brand C (Compact)</a>
          <a href="/minimal/test-callbacks" class="text-white underline hover:opacity-75 px-2 py-1 bg-black bg-opacity-20 rounded">Minimal</a>
          <a href="/mobile/test-callbacks" class="text-white underline hover:opacity-75 px-2 py-1 bg-black bg-opacity-20 rounded">Mobile</a>
          <a href="/test-callbacks" class="text-white underline hover:opacity-75 px-2 py-1 bg-black bg-opacity-20 rounded">Default</a>
        </div>
        <div class="mt-4 text-center">
          <a routerLink="/documentation" class="text-white underline hover:opacity-75 text-sm px-3 py-2 bg-black bg-opacity-30 rounded">
            📚 View Complete Documentation
          </a>
        </div>
      </div>
      
      <div class="space-y-8">
        <div *ngFor="let test of callbackTests; let i = index" class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            {{ i + 1 }}. {{ test.name }}
          </h2>
          
          <div [ngSwitch]="test.type" class="callback-test-container">
            
            <!-- Name Callback -->
            <app-name-callback 
              *ngSwitchCase="'NameCallback'"
              [callback]="test.mockCallback"
              (valueChange)="onCallbackChange(test.name, $event)">
            </app-name-callback>
            
            <!-- Password Callback -->
            <app-password-callback 
              *ngSwitchCase="'PasswordCallback'"
              [callback]="test.mockCallback"
              (valueChange)="onCallbackChange(test.name, $event)">
            </app-password-callback>
            
            <!-- Choice Callback -->
            <app-choice-callback 
              *ngSwitchCase="'ChoiceCallback'"
              [callback]="test.mockCallback"
              (valueChange)="onCallbackChange(test.name, $event)">
            </app-choice-callback>
            
            <!-- Text Output Callback -->
            <app-text-output-callback 
              *ngSwitchCase="'TextOutputCallback'"
              [callback]="test.mockCallback">
            </app-text-output-callback>
            
            <!-- Confirmation Callback -->
            <app-confirmation-callback 
              *ngSwitchCase="'ConfirmationCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-confirmation-callback>
            
            <!-- Number Attribute Input Callback -->
            <app-number-attribute-input-callback 
              *ngSwitchCase="'NumberAttributeInputCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-number-attribute-input-callback>
            
            <!-- Text Input Callback -->
            <app-text-input-callback 
              *ngSwitchCase="'TextInputCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-text-input-callback>
            
            <!-- Boolean Attribute Input Callback -->
            <app-boolean-attr-input-callback 
              *ngSwitchCase="'BooleanAttributeInputCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-boolean-attr-input-callback>
            
            <!-- String Attribute Input Callback -->
            <app-string-attribute-input-callback 
              *ngSwitchCase="'StringAttributeInputCallback'"
              [callback]="test.mockCallback"
              (valueChange)="onCallbackChange(test.name, $event)">
            </app-string-attribute-input-callback>
            
            <!-- KBA Create Callback -->
            <app-kba-create-callback 
              *ngSwitchCase="'KbaCreateCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-kba-create-callback>
            
            <!-- Suspended Text Output Callback -->
            <app-suspended-text-output-callback 
              *ngSwitchCase="'SuspendedTextOutputCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-suspended-text-output-callback>
            
            <!-- Device Profile Callback -->
            <app-device-profile-callback 
              *ngSwitchCase="'DeviceProfileCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-device-profile-callback>
            
            <!-- Metadata Callback -->
            <app-metadata-callback 
              *ngSwitchCase="'MetadataCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-metadata-callback>
            
            <!-- Polling Wait Callback -->
            <app-polling-wait-callback 
              *ngSwitchCase="'PollingWaitCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-polling-wait-callback>
            
            <!-- Validated Create Username Callback -->
            <app-validated-create-username-callback 
              *ngSwitchCase="'ValidatedCreateUsernameCallback'"
              [callback]="test.mockCallback"
              (valueChange)="onCallbackChange(test.name, $event)">
            </app-validated-create-username-callback>
            
            <!-- Validated Create Password Callback -->
            <app-validated-create-password-callback 
              *ngSwitchCase="'ValidatedCreatePasswordCallback'"
              [callback]="test.mockCallback"
              (valueChange)="onCallbackChange(test.name, $event)">
            </app-validated-create-password-callback>
            
            <!-- Terms and Conditions Callback -->
            <app-terms-and-conditions-callback 
              *ngSwitchCase="'TermsAndConditionsCallback'"
              [callback]="test.mockCallback"
              (valueChange)="onCallbackChange(test.name, $event)">
            </app-terms-and-conditions-callback>
            
            <!-- reCAPTCHA Callback -->
            <app-recaptcha-callback 
              *ngSwitchCase="'RecaptchaCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-recaptcha-callback>
            
            <!-- reCAPTCHA Enterprise Callback -->
            <app-recaptcha-enterprise-callback 
              *ngSwitchCase="'ReCaptchaEnterpriseCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-recaptcha-enterprise-callback>
            
            <!-- Redirect Callback -->
            <app-redirect-callback 
              *ngSwitchCase="'RedirectCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-redirect-callback>
            
            <!-- Select Identity Provider Callback -->
            <app-select-idp-callback 
              *ngSwitchCase="'SelectIdPCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-select-idp-callback>
            
            <!-- PingOne Protect Initialize Callback -->
            <app-ping-protect-initialize-callback 
              *ngSwitchCase="'PingProtectInitializeCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-ping-protect-initialize-callback>
            
            <!-- PingOne Protect Evaluation Callback -->
            <app-ping-protect-evaluation-callback 
              *ngSwitchCase="'PingProtectEvaluationCallback'"
              [callback]="test.mockCallback"
              (onSubmit)="onCallbackSubmit(test.name, $event)">
            </app-ping-protect-evaluation-callback>
            
            <!-- Default case for unsupported callbacks -->
            <div *ngSwitchDefault class="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p class="text-yellow-800">{{ test.name }} - Component not implemented yet</p>
            </div>
          </div>
          
          <div class="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
            <strong>Mock Data:</strong> {{ test.description }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class TestCallbacksComponent implements OnInit, OnDestroy {
  currentBrand!: BrandConfig;
  private brandSubscription!: Subscription;

  constructor(private brandingService: BrandingService) {}

  ngOnInit(): void {
    this.currentBrand = this.brandingService.getCurrentBrand();
    this.brandSubscription = this.brandingService.currentBrand$.subscribe(
      brand => this.currentBrand = brand
    );
  }

  ngOnDestroy(): void {
    if (this.brandSubscription) {
      this.brandSubscription.unsubscribe();
    }
  }
  callbackTests = [
    {
      name: 'Name Callback',
      type: 'NameCallback',
      description: 'Basic username input field',
      mockCallback: this.createMockCallback({
        prompt: 'Enter your username'
      })
    },
    {
      name: 'Password Callback', 
      type: 'PasswordCallback',
      description: 'Password input field with masking',
      mockCallback: this.createMockCallback({
        prompt: 'Enter your password'
      })
    },
    {
      name: 'Choice Callback',
      type: 'ChoiceCallback', 
      description: 'Radio button selection with multiple options',
      mockCallback: this.createMockCallback({
        prompt: 'Select login method',
        choices: ['Username/Password', 'Social Login', 'Biometrics'],
        defaultChoice: 0
      })
    },
    {
      name: 'Text Output Callback',
      type: 'TextOutputCallback',
      description: 'Display informational text',
      mockCallback: this.createMockCallback({
        message: 'Welcome to the authentication system',
        messageType: 0
      })
    },
    {
      name: 'Confirmation Callback',
      type: 'ConfirmationCallback', 
      description: 'Yes/No confirmation dialog',
      mockCallback: this.createMockCallback({
        prompt: 'Do you want to save your login preferences?',
        options: ['Yes', 'No'],
        defaultChoice: 0
      })
    },
    {
      name: 'Number Attribute Input Callback',
      type: 'NumberAttributeInputCallback',
      description: 'Numeric input with validation',
      mockCallback: this.createMockCallback({
        prompt: 'Enter your age',
        required: true,
        min: 18,
        max: 120
      })
    },
    {
      name: 'Text Input Callback',
      type: 'TextInputCallback',
      description: 'Generic text input field',
      mockCallback: this.createMockCallback({
        prompt: 'Enter additional information',
        placeholder: 'Type here...',
        required: false
      })
    },
    {
      name: 'Boolean Attribute Input Callback',
      type: 'BooleanAttributeInputCallback',
      description: 'Boolean selection (Yes/No radio buttons)',
      mockCallback: this.createMockCallback({
        prompt: 'Subscribe to newsletter?',
        trueLabel: 'Yes',
        falseLabel: 'No'
      })
    },
    {
      name: 'String Attribute Input Callback',
      type: 'StringAttributeInputCallback',
      description: 'String input with validation policies',
      mockCallback: this.createMockCallback({
        name: 'email',
        prompt: 'Email Address',
        required: true,
        validateOnly: false
      })
    },
    {
      name: 'KBA Create Callback',
      type: 'KbaCreateCallback',
      description: 'Knowledge-based authentication setup',
      mockCallback: this.createMockCallback({
        prompt: 'Set up your security questions',
        questionCount: 3,
        predefinedQuestions: [
          'What was your first pet\'s name?',
          'What city were you born in?',
          'What was your favorite teacher\'s name?'
        ]
      })
    },
    {
      name: 'Suspended Text Output Callback',
      type: 'SuspendedTextOutputCallback',
      description: 'Informational message with action',
      mockCallback: this.createMockCallback({
        title: 'Account Verification Required',
        message: 'Please check your email for verification instructions.',
        hasAction: true
      })
    },
    {
      name: 'Device Profile Callback',
      type: 'DeviceProfileCallback',
      description: 'Collects device information for security',
      mockCallback: this.createMockCallback({
        message: true
      })
    },
    {
      name: 'Metadata Callback',
      type: 'MetadataCallback',
      description: 'Hidden metadata processing (typically invisible)',
      mockCallback: this.createMockCallback({
        data: { relyingPartyId: 'example.com' }
      })
    },
    {
      name: 'Polling Wait Callback',
      type: 'PollingWaitCallback',
      description: 'Wait for external process completion',
      mockCallback: this.createMockCallback({
        title: 'Processing Request',
        message: 'Please wait while we process your authentication...',
        pollingInterval: 3000,
        autoPolling: false
      })
    },
    {
      name: 'Validated Create Username Callback',
      type: 'ValidatedCreateUsernameCallback',
      description: 'Username creation with validation policies',
      mockCallback: this.createMockCallback({
        policies: {
          policyRequirements: ['REQUIRED', 'MIN_LENGTH', 'MAX_LENGTH'],
          name: 'userName'
        },
        prompt: 'Create Username',
        required: true,
        validateOnly: false
      })
    },
    {
      name: 'Validated Create Password Callback',
      type: 'ValidatedCreatePasswordCallback', 
      description: 'Password creation with complexity requirements',
      mockCallback: this.createMockCallback({
        policies: {
          policyRequirements: ['REQUIRED', 'MIN_LENGTH', 'CONTAINS_UPPERCASE'],
          name: 'password'
        },
        prompt: 'Create Password',
        required: true,
        confirmPassword: true
      })
    },
    {
      name: 'Terms and Conditions Callback',
      type: 'TermsAndConditionsCallback',
      description: 'Terms acceptance with version tracking',
      mockCallback: this.createMockCallback({
        terms: 'By using this service, you agree to our Terms of Service and Privacy Policy.',
        version: '1.0',
        createDate: '1234567890000'
      })
    },
    {
      name: 'reCAPTCHA Callback',
      type: 'RecaptchaCallback',
      description: 'Google reCAPTCHA v2 verification',
      mockCallback: this.createMockCallback({
        recaptchaSiteKey: 'test-site-key',
        recaptchaUri: 'https://www.google.com/recaptcha/api.js'
      })
    },
    {
      name: 'reCAPTCHA Enterprise Callback',
      type: 'ReCaptchaEnterpriseCallback',
      description: 'Google reCAPTCHA Enterprise verification',
      mockCallback: this.createMockCallback({
        recaptchaSiteKey: 'test-enterprise-site-key',
        recaptchaUri: 'https://www.google.com/recaptcha/enterprise.js',
        action: 'login'
      })
    },
    {
      name: 'Redirect Callback',
      type: 'RedirectCallback',
      description: 'External URL redirection',
      mockCallback: this.createMockCallback({
        redirectUrl: 'https://example.com/external-auth',
        method: 'GET',
        trackingCookie: true
      })
    },
    {
      name: 'Select Identity Provider Callback',
      type: 'SelectIdPCallback',
      description: 'Social login provider selection',
      mockCallback: this.createMockCallback({
        providers: [
          {
            provider: 'google',
            uiConfig: {
              buttonDisplayName: 'Google',
              buttonImage: 'https://example.com/google-icon.png',
              buttonCustomStyle: 'google-btn'
            }
          },
          {
            provider: 'facebook',
            uiConfig: {
              buttonDisplayName: 'Facebook',
              buttonImage: 'https://example.com/facebook-icon.png',
              buttonCustomStyle: 'facebook-btn'
            }
          }
        ]
      })
    },
    {
      name: 'PingOne Protect Initialize Callback',
      type: 'PingProtectInitializeCallback',
      description: 'PingOne Protect risk assessment initialization',
      mockCallback: this.createMockCallback({
        deviceKeyRSA: 'test-device-key',
        consoleLogEnabled: false,
        customEndpoint: 'https://protect.pingidentity.com'
      })
    },
    {
      name: 'PingOne Protect Evaluation Callback',
      type: 'PingProtectEvaluationCallback',
      description: 'PingOne Protect risk evaluation result',
      mockCallback: this.createMockCallback({
        riskScore: 0.2,
        riskLevel: 'LOW',
        signals: ['device_trusted', 'location_known'],
        recommendation: 'ALLOW'
      })
    }
  ];

  private createMockCallback(outputData: any) {
    return {
      getOutputByName: (name: string, defaultValue: any) => {
        return outputData[name] !== undefined ? outputData[name] : defaultValue;
      },
      getInputValue: () => undefined,
      setInputValue: (value: any) => {
        console.log('Mock setInputValue called with:', value);
      }
    };
  }

  onCallbackChange(callbackName: string, event: any) {
    console.log(`${callbackName} changed:`, event);
  }

  onCallbackSubmit(callbackName: string, value: any) {
    console.log(`${callbackName} submitted:`, value);
  }
}