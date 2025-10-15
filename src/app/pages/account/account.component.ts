import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenManager, FRUser } from '@forgerock/javascript-sdk';
import { UserInfo } from '../../auth/models/auth-outcome';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">My Account</h1>
            </div>
            <div class="flex items-center space-x-4">
              <button
                type="button"
                (click)="addPasskey()"
                [disabled]="!isWebAuthnSupported"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Add Passkey
              </button>
              <button
                type="button"
                (click)="logout()"
                class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main content -->
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            
            <!-- Profile Information -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Profile Information
                </h3>
                
                <div *ngIf="userInfo" class="space-y-4">
                  <div *ngIf="userInfo.name">
                    <dt class="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ userInfo.name }}</dd>
                  </div>
                  
                  <div *ngIf="userInfo.email">
                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ userInfo.email }}</dd>
                  </div>
                  
                  <div *ngIf="userInfo.preferred_username">
                    <dt class="text-sm font-medium text-gray-500">Username</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ userInfo.preferred_username }}</dd>
                  </div>
                  
                  <div *ngIf="userInfo.sub">
                    <dt class="text-sm font-medium text-gray-500">User ID</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono text-xs">{{ userInfo.sub }}</dd>
                  </div>
                </div>

                <div *ngIf="!userInfo" class="text-center py-4">
                  <svg class="animate-spin h-6 w-6 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">Loading profile...</p>
                </div>
              </div>
            </div>

            <!-- Token Information -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Session Information
                </h3>
                
                <div *ngIf="tokenInfo" class="space-y-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Token Type</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ tokenInfo.tokenType || 'Bearer' }}</dd>
                  </div>
                  
                  <div *ngIf="tokenInfo.expiresIn">
                    <dt class="text-sm font-medium text-gray-500">Expires In</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatExpiryTime(tokenInfo.expiresIn) }}</dd>
                  </div>
                  
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Access Token (last 8 chars)</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">
                      {{ getTokenSuffix(tokenInfo.accessToken) }}
                    </dd>
                  </div>
                  
                  <div *ngIf="tokenInfo.refreshToken">
                    <dt class="text-sm font-medium text-gray-500">Refresh Token Available</dt>
                    <dd class="mt-1 text-sm text-gray-900">Yes</dd>
                  </div>
                </div>

                <div *ngIf="!tokenInfo" class="text-center py-4">
                  <p class="text-sm text-gray-500">No token information available</p>
                </div>
              </div>
            </div>

            <!-- WebAuthn / Passkeys -->
            <div class="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Security Settings
                </h3>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Passkeys</h4>
                      <p class="text-sm text-gray-500">
                        Use your device's biometric authentication or security key for faster, more secure sign-ins.
                      </p>
                    </div>
                    <div>
                      <span *ngIf="isWebAuthnSupported" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Supported
                      </span>
                      <span *ngIf="!isWebAuthnSupported" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Not Supported
                      </span>
                    </div>
                  </div>

                  <div *ngIf="passkeyAction" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-blue-800">{{ passkeyAction }}</p>
                      </div>
                    </div>
                  </div>

                  <div *ngIf="passkeyError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-red-800">{{ passkeyError }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class AccountComponent implements OnInit {
  userInfo: UserInfo | null = null;
  tokenInfo: any = null;
  isWebAuthnSupported = false;
  passkeyAction: string | null = null;
  passkeyError: string | null = null;

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.isWebAuthnSupported = this.checkWebAuthnSupport();
    await this.loadUserInfo();
    await this.loadTokenInfo();
  }

  private async loadUserInfo(): Promise<void> {
    try {
      // Get user info from ID token
      const tokens = await TokenManager.getTokens();
      if (tokens && typeof tokens === 'object' && 'idToken' in tokens && tokens.idToken) {
        const payload = JSON.parse(atob(tokens.idToken.split('.')[1]));
        this.userInfo = payload;
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  }

  private async loadTokenInfo(): Promise<void> {
    try {
      this.tokenInfo = await TokenManager.getTokens();
    } catch (error) {
      console.error('Failed to load token info:', error);
    }
  }

  private checkWebAuthnSupport(): boolean {
    return !!(navigator.credentials && navigator.credentials.create);
  }

  async addPasskey(): Promise<void> {
    if (!this.isWebAuthnSupported) {
      this.passkeyError = 'Passkeys are not supported on this device';
      return;
    }

    this.passkeyAction = 'Setting up passkey...';
    this.passkeyError = null;

    try {
      // This would typically require a specific registration tree or API call
      // For now, we'll show a placeholder message
      this.passkeyAction = 'Passkey setup requires accessing a WebAuthn registration flow. Please use the registration page to add passkeys during account creation.';
      
      setTimeout(() => {
        this.passkeyAction = null;
      }, 5000);

    } catch (error: any) {
      console.error('Passkey registration failed:', error);
      this.passkeyError = 'Failed to add passkey. Please try again.';
      this.passkeyAction = null;
    }
  }

  formatExpiryTime(expiresIn: number): string {
    const hours = Math.floor(expiresIn / 3600);
    const minutes = Math.floor((expiresIn % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  getTokenSuffix(token?: string): string {
    if (!token) return 'N/A';
    return '...' + token.slice(-8);
  }

  async logout(): Promise<void> {
    try {
      // Clear tokens and redirect to login
      await FRUser.logout();
      TokenManager.deleteTokens();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout by clearing tokens and redirecting
      TokenManager.deleteTokens();
      this.router.navigate(['/login']);
    }
  }
}