import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-terms-and-conditions-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-6">
      <!-- Terms content display -->
      <div *ngIf="termsContent" class="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 max-h-64 overflow-y-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-3">{{ termsTitle }}</h3>
        <div class="text-sm text-gray-700 prose prose-sm max-w-none" [innerHTML]="termsContent"></div>
      </div>

      <!-- Simple terms link if no content -->
      <div *ngIf="!termsContent && termsUrl" class="mb-4 p-4 border border-gray-200 rounded-lg bg-blue-50">
        <p class="text-sm text-gray-700">
          Please review our 
          <a [href]="termsUrl" target="_blank" class="text-blue-600 hover:text-blue-800 underline">
            {{ termsTitle }}
          </a>
          before proceeding.
        </p>
      </div>

      <!-- Acceptance checkbox -->
      <div class="flex items-start space-x-3">
        <div class="flex items-center h-5">
          <input
            [id]="inputId"
            [formControl]="acceptanceControl"
            type="checkbox"
            [disabled]="disabled"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
            (change)="updateCallback()"
          >
        </div>
        <div class="text-sm">
          <label [for]="inputId" class="font-medium text-gray-700 cursor-pointer">
            {{ acceptanceText }}
            <span *ngIf="isRequired" class="text-red-500">*</span>
          </label>
          <p *ngIf="acceptanceDescription" class="text-gray-500 mt-1">
            {{ acceptanceDescription }}
          </p>
        </div>
      </div>

      <!-- Validation feedback -->
      <div *ngIf="acceptanceControl.invalid && acceptanceControl.touched" class="mt-2 text-sm text-red-600">
        <span *ngIf="acceptanceControl.errors?.['required']">
          You must accept the {{ termsTitle.toLowerCase() }} to continue
        </span>
      </div>

      <!-- Additional links -->
      <div *ngIf="additionalLinks?.length" class="mt-4 text-xs text-gray-600">
        <p>Related documents:</p>
        <ul class="list-disc list-inside space-y-1 mt-1">
          <li *ngFor="let link of additionalLinks">
            <a [href]="link.url" target="_blank" class="text-blue-600 hover:text-blue-800 underline">
              {{ link.title }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class TermsAndConditionsCallbackComponent implements OnInit, BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  acceptanceControl = new FormControl(false);
  inputId = `terms-input-${Math.random().toString(36).substr(2, 9)}`;
  
  termsTitle = 'Terms and Conditions';
  termsContent = '';
  termsUrl = '';
  acceptanceText = 'I accept the terms and conditions';
  acceptanceDescription = '';
  isRequired = true;
  additionalLinks: { title: string; url: string }[] = [];

  ngOnInit(): void {
    this.initializeFromCallback();
    this.setupValidation();
  }

  private initializeFromCallback(): void {
    if (this.callback?.payload) {
      // Get initial acceptance state
      const initialValue = this.callback.payload.getInputValue ? 
        this.callback.payload.getInputValue() : false;
      this.acceptanceControl.setValue(initialValue);

      // Get terms content
      this.termsContent = this.callback.payload.getTerms ? 
        this.callback.payload.getTerms() : '';

      // Get terms URL if no content
      this.termsUrl = this.callback.payload.getTermsUrl ? 
        this.callback.payload.getTermsUrl() : '';

      // Get acceptance text
      this.acceptanceText = this.callback.payload.getPrompt ? 
        this.callback.payload.getPrompt() : 'I accept the terms and conditions';

      // Get title
      this.termsTitle = this.callback.payload.getTitle ? 
        this.callback.payload.getTitle() : 'Terms and Conditions';

      // Check if required
      this.isRequired = this.callback.payload.isRequired ? 
        this.callback.payload.isRequired() : true;

      // Set up additional helpful text
      this.acceptanceDescription = this.getAcceptanceDescription();
      
      // Set up additional links (privacy policy, etc.)
      this.additionalLinks = this.getAdditionalLinks();
    }
  }

  private getAcceptanceDescription(): string {
    if (this.termsContent || this.termsUrl) {
      return 'By checking this box, you agree to be bound by these terms.';
    }
    return 'Please confirm your acceptance to continue with registration.';
  }

  private getAdditionalLinks(): { title: string; url: string }[] {
    // You could get these from the callback or configure them based on your needs
    const links = [];
    
    if (this.callback?.payload?.getPrivacyPolicyUrl) {
      links.push({
        title: 'Privacy Policy',
        url: this.callback.payload.getPrivacyPolicyUrl()
      });
    }
    
    if (this.callback?.payload?.getCookiePolicyUrl) {
      links.push({
        title: 'Cookie Policy',
        url: this.callback.payload.getCookiePolicyUrl()
      });
    }

    return links;
  }

  private setupValidation(): void {
    const validators = [];
    
    if (this.isRequired) {
      validators.push(Validators.requiredTrue);
    }

    this.acceptanceControl.setValidators(validators);
    this.acceptanceControl.updateValueAndValidity();
  }

  updateCallback(): void {
    const accepted = this.acceptanceControl.value || false;
    
    if (this.callback?.payload?.setInputValue) {
      this.callback.payload.setInputValue(accepted);
    }
    
    this.valueChange.emit(this.callback);
  }
}