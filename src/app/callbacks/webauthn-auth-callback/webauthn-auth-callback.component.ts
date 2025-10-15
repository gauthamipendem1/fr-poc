import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebAuthnStepType, FRWebAuthn } from '@forgerock/javascript-sdk';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-webauthn-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">
          Sign in with your passkey
        </h3>
        
        <p class="text-sm text-gray-500 mb-6">
          Use your device's biometric authentication or security key to sign in securely.
        </p>

        <div *ngIf="isProcessing" class="mb-4">
          <div class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Waiting for authentication...
          </div>
        </div>

        <div *ngIf="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <div class="space-y-3">
          <button
            type="button"
            (click)="authenticateWithPasskey()"
            [disabled]="disabled || isProcessing"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span *ngIf="!isProcessing">Use Passkey</span>
            <span *ngIf="isProcessing">Authenticating...</span>
          </button>

          <button
            type="button"
            (click)="usePasswordInstead()"
            [disabled]="disabled || isProcessing"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Use password instead
          </button>
        </div>
      </div>
    </div>
  `
})
export class WebauthnAuthCallbackComponent implements OnInit, BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  isProcessing = false;
  error: string | null = null;

  ngOnInit(): void {
    // Check if WebAuthn is supported
    if (!this.isWebAuthnSupported()) {
      this.error = 'Passkeys are not supported on this device or browser';
    }
  }

  async authenticateWithPasskey(): Promise<void> {
    if (!this.isWebAuthnSupported()) {
      this.error = 'WebAuthn is not supported on this device';
      return;
    }

    this.isProcessing = true;
    this.error = null;

    try {
      // Use ForgeRock SDK WebAuthn helper
      const webAuthnOutcome = await FRWebAuthn.authenticate(this.callback);
      
      if (webAuthnOutcome) {
        // Authentication successful, callback has been updated
        this.valueChange.emit(this.callback);
      } else {
        this.error = 'Passkey authentication failed. Please try again.';
      }
    } catch (error: any) {
      console.error('WebAuthn authentication error:', error);
      
      if (error.name === 'NotAllowedError') {
        this.error = 'Authentication was cancelled or not allowed';
      } else if (error.name === 'InvalidStateError') {
        this.error = 'No passkey found for this account';
      } else if (error.name === 'NotSupportedError') {
        this.error = 'Passkeys are not supported on this device';
      } else {
        this.error = 'Authentication failed. Please try again.';
      }
    } finally {
      this.isProcessing = false;
    }
  }

  usePasswordInstead(): void {
    // Set a flag to skip WebAuthn and use password
    this.callback.payload.setSkip(true);
    this.valueChange.emit(this.callback);
  }

  private isWebAuthnSupported(): boolean {
    return !!(navigator.credentials && navigator.credentials.get);
  }
}