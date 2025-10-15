import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-validated-create-username-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-4">
      <label [for]="inputId" class="block text-sm font-medium text-gray-700 mb-2">
        {{ callback?.payload?.prompt || 'Create Username' }}
        <span *ngIf="isRequired" class="text-red-500">*</span>
      </label>
      <input
        [id]="inputId"
        [formControl]="usernameControl"
        type="text"
        [placeholder]="placeholder"
        [disabled]="disabled"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        (blur)="updateCallback()"
        (keyup.enter)="updateCallback()"
        (input)="onInput()"
      >
      
      <!-- Validation feedback -->
      <div *ngIf="usernameControl.invalid && usernameControl.touched" class="mt-1 text-sm text-red-600">
        <span *ngIf="usernameControl.errors?.['required']">Username is required</span>
        <span *ngIf="usernameControl.errors?.['minlength']">Username must be at least {{ minLength }} characters</span>
        <span *ngIf="usernameControl.errors?.['pattern']">Username contains invalid characters</span>
      </div>
      
      <!-- Validation policies display -->
      <div *ngIf="validationPolicies && validationPolicies.length > 0" class="mt-2 text-xs text-gray-600">
        <p class="font-medium">Username requirements:</p>
        <ul class="list-disc list-inside space-y-1">
          <li *ngFor="let policy of validationPolicies" 
              [class]="getPolicyClass(policy)">
            {{ policy.policyRequirement }}
          </li>
        </ul>
      </div>
      
      <!-- Real-time validation feedback -->
      <div *ngIf="validationMessage" class="mt-1 text-sm" [ngClass]="validationMessage.type === 'error' ? 'text-red-600' : 'text-green-600'">
        {{ validationMessage.message }}
      </div>
    </div>
  `
})
export class ValidatedCreateUsernameCallbackComponent implements OnInit, BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  usernameControl = new FormControl('');
  inputId = `username-input-${Math.random().toString(36).substr(2, 9)}`;
  validationPolicies: any[] = [];
  validationMessage: { type: string; message: string } | null = null;
  isRequired = true;
  minLength = 1;
  placeholder = 'Enter username';

  ngOnInit(): void {
    this.initializeFromCallback();
    this.setupValidation();
  }

  private initializeFromCallback(): void {
    if (this.callback?.payload) {
      // Get initial value
      const initialValue = this.callback.payload.getInputValue ? 
        this.callback.payload.getInputValue() : '';
      this.usernameControl.setValue(initialValue);

      // Get validation policies - ensure it's always an array
      const policies = this.callback.payload.getPolicies ? 
        this.callback.payload.getPolicies() : null;
      this.validationPolicies = Array.isArray(policies) ? policies : [];

      // Get prompt and placeholder
      this.placeholder = this.callback.payload.getPrompt ? 
        this.callback.payload.getPrompt() : 'Enter username';

      // Check if required
      this.isRequired = this.callback.payload.isRequired ? 
        this.callback.payload.isRequired() : true;
    }
  }

  private setupValidation(): void {
    const validators = [];
    
    if (this.isRequired) {
      validators.push(Validators.required);
    }

    // Add validators based on policies (only if we have policies)
    if (Array.isArray(this.validationPolicies) && this.validationPolicies.length > 0) {
      this.validationPolicies.forEach(policy => {
        if (policy && policy.policyId === 'MIN_LENGTH' && policy.params?.minLength) {
          this.minLength = policy.params.minLength;
          validators.push(Validators.minLength(this.minLength));
        }
        if (policy && policy.policyId === 'VALID_USERNAME_CHARS' && policy.params?.allowedChars) {
          const pattern = new RegExp(`^[${policy.params.allowedChars.replace(/[\[\]]/g, '')}]+$`);
          validators.push(Validators.pattern(pattern));
        }
      });
    }

    this.usernameControl.setValidators(validators);
    this.usernameControl.updateValueAndValidity();
  }

  onInput(): void {
    // Clear previous validation message
    this.validationMessage = null;
    
    // You could implement real-time validation here
    // For now, we'll validate on blur/submit
  }

  updateCallback(): void {
    if (this.usernameControl.valid) {
      const value = this.usernameControl.value || '';
      if (this.callback?.payload?.setInputValue) {
        this.callback.payload.setInputValue(value);
      }
      this.valueChange.emit(this.callback);
      
      this.validationMessage = {
        type: 'success',
        message: 'Username is valid'
      };
    } else {
      this.validationMessage = {
        type: 'error',
        message: 'Please fix the username errors above'
      };
    }
  }

  getPolicyClass(policy: any): string {
    // You could implement policy validation checking here
    // For now, return neutral styling
    return 'text-gray-600';
  }
}