import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TreeRunnerService } from '../../auth/tree-runner.service';
import { AuthStepState } from '../../auth/models/callbacks';
import { environment } from '../../../environments/environment';
import { NameCallbackComponent } from '../../callbacks/name-callback/name-callback.component';
import { PasswordCallbackComponent } from '../../callbacks/password-callback/password-callback.component';
import { ChoiceCallbackComponent } from '../../callbacks/choice-callback/choice-callback.component';
import { TextOutputCallbackComponent } from '../../callbacks/text-output-callback/text-output-callback.component';
import { WebauthnRegisterCallbackComponent } from '../../callbacks/webauthn-register-callback/webauthn-register-callback.component';
import { WebauthnAuthCallbackComponent } from '../../callbacks/webauthn-auth-callback/webauthn-auth-callback.component';
import { getCallbackMapping } from '../../auth/callback-mapper';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NameCallbackComponent,
    PasswordCallbackComponent,
    ChoiceCallbackComponent,
    TextOutputCallbackComponent,
    WebauthnRegisterCallbackComponent,
    WebauthnAuthCallbackComponent
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
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
                  [callback]="callbackData"
                  [disabled]="stepState.isLoading"
                  (valueChange)="onCallbackChange($event)">
                </app-name-callback>

                <!-- Password Callback -->
                <app-password-callback 
                  *ngIf="callbackData.type === 'PasswordCallback'"
                  [callback]="callbackData"
                  [disabled]="stepState.isLoading"
                  (valueChange)="onCallbackChange($event)">
                </app-password-callback>

                <!-- Choice Callback -->
                <app-choice-callback 
                  *ngIf="callbackData.type === 'ChoiceCallback'"
                  [callback]="callbackData"
                  [disabled]="stepState.isLoading"
                  (valueChange)="onCallbackChange($event)">
                </app-choice-callback>

                <!-- Text Output Callback -->
                <app-text-output-callback 
                  *ngIf="callbackData.type === 'TextOutputCallback'"
                  [callback]="callbackData"
                  [disabled]="stepState.isLoading">
                </app-text-output-callback>

                <!-- WebAuthn Registration Callback -->
                <app-webauthn-register-callback 
                  *ngIf="callbackData.type === 'WebAuthnRegistrationCallback'"
                  [callback]="callbackData"
                  [disabled]="stepState.isLoading"
                  (valueChange)="onCallbackChange($event)">
                </app-webauthn-register-callback>

                <!-- WebAuthn Authentication Callback -->
                <app-webauthn-auth-callback 
                  *ngIf="callbackData.type === 'WebAuthnAuthenticationCallback'"
                  [callback]="callbackData"
                  [disabled]="stepState.isLoading"
                  (valueChange)="onCallbackChange($event)">
                </app-webauthn-auth-callback>

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
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit, OnDestroy {
  stepState: AuthStepState | null = null;
  private subscription = new Subscription();

  constructor(
    private treeRunner: TreeRunnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
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