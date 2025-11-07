import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-redirect-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <div class="p-4 bg-blue-50 border-l-4 border-blue-400">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              Redirecting...
            </h3>
            <div class="mt-2 text-sm text-blue-700">
              You will be redirected to continue the authentication process.
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <button 
          type="button"
          (click)="handleRedirect()"
          [disabled]="disabled"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to {{ getDomain() }}
        </button>
      </div>
    </div>
  `
})
export class RedirectCallbackComponent implements BaseCallbackInterface, OnInit {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  ngOnInit(): void {
    // Auto-redirect if configured to do so
    const autoRedirect = this.callback.getOutputByName('autoRedirect', false);
    if (autoRedirect && !this.disabled) {
      setTimeout(() => {
        this.handleRedirect();
      }, 1000);
    }
  }

  getRedirectUrl(): string {
    return this.callback.getOutputByName('redirectUrl', '') || 
           this.callback.getOutputByName('url', '');
  }

  getDomain(): string {
    try {
      const url = new URL(this.getRedirectUrl());
      return url.hostname;
    } catch {
      return 'external site';
    }
  }

  handleRedirect(): void {
    const redirectUrl = this.getRedirectUrl();
    if (redirectUrl) {
      // Set any required tracking data
      const trackingId = this.callback.getOutputByName('trackingId', '');
      if (trackingId) {
        this.callback.setInputValue(trackingId);
      }
      
      if (this.onSubmit) {
        this.onSubmit(redirectUrl);
      }
      
      // Perform the redirect
      window.location.href = redirectUrl;
    }
  }
}