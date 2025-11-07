import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

declare global {
  interface Window {
    grecaptcha: any;
    recaptchaEnterpriseCallback: () => void;
  }
}

@Component({
  selector: 'app-recaptcha-enterprise-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <div class="mb-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ getPrompt() }}
        </label>
      </div>
      <div [id]="recaptchaId" class="recaptcha-container"></div>
      <div *ngIf="error" class="mt-2 text-sm text-red-600">
        {{ error }}
      </div>
    </div>
  `
})
export class ReCaptchaEnterpriseCallbackComponent implements BaseCallbackInterface, OnInit, OnDestroy {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  recaptchaId = `recaptcha-enterprise-${Math.random().toString(36).substr(2, 9)}`;
  widgetId: number | null = null;
  error: string = '';
  private scriptLoaded = false;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.loadRecaptcha();
  }

  ngOnDestroy(): void {
    if (this.widgetId !== null && window.grecaptcha) {
      try {
        window.grecaptcha.enterprise.reset(this.widgetId);
      } catch (error) {
        console.warn('Error resetting reCAPTCHA Enterprise:', error);
      }
    }
  }

  getPrompt(): string {
    return this.callback.getOutputByName('prompt', 'Please complete the reCAPTCHA Enterprise verification');
  }

  getSiteKey(): string {
    return this.callback.getOutputByName('recaptchaEnterpriseKey', '') ||
           this.callback.getOutputByName('siteKey', '');
  }

  getAction(): string {
    return this.callback.getOutputByName('action', 'submit');
  }

  private async loadRecaptcha(): Promise<void> {
    if (this.scriptLoaded && window.grecaptcha?.enterprise) {
      this.renderRecaptcha();
      return;
    }

    try {
      await this.loadRecaptchaScript();
      this.renderRecaptcha();
    } catch (error) {
      this.error = 'Failed to load reCAPTCHA Enterprise';
      console.error('reCAPTCHA Enterprise load error:', error);
    }
  }

  private loadRecaptchaScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        resolve();
        return;
      }

      // Set up callback function
      window.recaptchaEnterpriseCallback = () => {
        this.ngZone.run(() => {
          this.scriptLoaded = true;
          resolve();
        });
      };

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/enterprise.js?onload=recaptchaEnterpriseCallback&render=explicit';
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA Enterprise script'));
      
      document.head.appendChild(script);
    });
  }

  private renderRecaptcha(): void {
    if (!window.grecaptcha?.enterprise || !this.getSiteKey()) {
      this.error = 'reCAPTCHA Enterprise not available or site key missing';
      return;
    }

    try {
      this.widgetId = window.grecaptcha.enterprise.render(this.recaptchaId, {
        'sitekey': this.getSiteKey(),
        'action': this.getAction(),
        'callback': (token: string) => {
          this.ngZone.run(() => {
            this.onRecaptchaSuccess(token);
          });
        },
        'error-callback': () => {
          this.ngZone.run(() => {
            this.onRecaptchaError();
          });
        },
        'expired-callback': () => {
          this.ngZone.run(() => {
            this.onRecaptchaExpired();
          });
        }
      });
    } catch (error) {
      this.error = 'Failed to render reCAPTCHA Enterprise';
      console.error('reCAPTCHA Enterprise render error:', error);
    }
  }

  private onRecaptchaSuccess(token: string): void {
    this.error = '';
    this.callback.setInputValue(token);
    if (this.onSubmit) {
      this.onSubmit(token);
    }
  }

  private onRecaptchaError(): void {
    this.error = 'reCAPTCHA Enterprise verification failed';
    this.callback.setInputValue('');
  }

  private onRecaptchaExpired(): void {
    this.error = 'reCAPTCHA Enterprise verification expired. Please try again.';
    this.callback.setInputValue('');
  }
}