import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenManager, FRAuth } from '@forgerock/javascript-sdk';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 text-center">
        <div *ngIf="isProcessing">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg class="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-medium text-gray-900 mb-2">Completing authentication...</h2>
          <p class="text-sm text-gray-600">Please wait while we complete your sign-in.</p>
        </div>

        <div *ngIf="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Authentication Error</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
              <div class="mt-4">
                <button 
                  type="button" 
                  (click)="redirectToLogin()" 
                  class="text-sm font-medium text-red-800 hover:text-red-600"
                >
                  Return to login
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="success" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">Authentication successful! Redirecting...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CallbackComponent implements OnInit {
  isProcessing = true;
  error: string | null = null;
  success = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Get the authorization code and state from URL parameters
      const code = this.route.snapshot.queryParams['code'];
      const state = this.route.snapshot.queryParams['state'];
      const errorParam = this.route.snapshot.queryParams['error'];

      if (errorParam) {
        throw new Error(`Authorization failed: ${errorParam}`);
      }

      if (!code) {
        throw new Error('Authorization code not found in callback URL');
      }

      // Use ForgeRock SDK to complete the OIDC flow
      await this.completeOAuthFlow();

      this.success = true;
      this.isProcessing = false;

      // Redirect to account page after successful authentication
      setTimeout(() => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
        this.router.navigate([returnUrl]);
      }, 1500);

    } catch (error: any) {
      console.error('Callback processing failed:', error);
      this.error = error.message || 'Authentication failed';
      this.isProcessing = false;
    }
  }

  private async completeOAuthFlow(): Promise<void> {
    try {
      // Handle OAuth callback by getting tokens
      const tokens = await TokenManager.getTokens();
      
      if (!tokens || (typeof tokens === 'object' && !('accessToken' in tokens))) {
        throw new Error('Failed to obtain valid tokens');
      }

    } catch (error) {
      console.error('Error completing OAuth flow:', error);
      throw new Error('Failed to complete authentication process');
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}