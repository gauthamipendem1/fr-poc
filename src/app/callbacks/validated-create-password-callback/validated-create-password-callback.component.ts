import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-validated-create-password-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-4">
      <label [for]="inputId" class="block text-sm font-medium text-gray-700 mb-2">
        {{ callback?.payload?.prompt || 'Create Password' }}
        <span *ngIf="isRequired" class="text-red-500">*</span>
      </label>
      <div class="relative">
        <input
          [id]="inputId"
          [formControl]="passwordControl"
          [type]="showPassword ? 'text' : 'password'"
          [placeholder]="placeholder"
          [disabled]="disabled"
          class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          (blur)="updateCallback()"
          (keyup.enter)="updateCallback()"
          (input)="onPasswordInput()"
        >
        <button
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
          (click)="togglePasswordVisibility()"
          [disabled]="disabled"
        >
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            <path *ngIf="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
          </svg>
        </button>
      </div>
      
      <!-- Validation feedback -->
      <div *ngIf="passwordControl.invalid && passwordControl.touched" class="mt-1 text-sm text-red-600">
        <span *ngIf="passwordControl.errors?.['required']">Password is required</span>
        <span *ngIf="passwordControl.errors?.['minlength']">Password must be at least {{ minLength }} characters</span>
        <span *ngIf="passwordControl.errors?.['policy']">{{ passwordControl.errors?.['policy'].message }}</span>
      </div>
      
      <!-- Password strength indicator -->
      <div *ngIf="passwordControl.value" class="mt-2">
        <div class="flex items-center space-x-2">
          <span class="text-xs text-gray-600">Strength:</span>
          <div class="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-300"
              [style.width.%]="passwordStrength"
              [ngClass]="getStrengthColorClass()"
            ></div>
          </div>
          <span class="text-xs" [ngClass]="getStrengthTextClass()">
            {{ getStrengthText() }}
          </span>
        </div>
      </div>
      
      <!-- Password policies display -->
      <div *ngIf="validationPolicies && validationPolicies.length > 0" class="mt-3 text-xs">
        <p class="font-medium text-gray-700 mb-2">Password requirements:</p>
        <ul class="space-y-1">
          <li *ngFor="let policy of validationPolicies" 
              class="flex items-center space-x-2"
              [ngClass]="getPolicyValidationClass(policy)">
            <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path *ngIf="isPolicyMet(policy)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              <path *ngIf="!isPolicyMet(policy)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{{ getPolicyDescription(policy) }}</span>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ValidatedCreatePasswordCallbackComponent implements OnInit, BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  passwordControl = new FormControl('');
  inputId = `password-input-${Math.random().toString(36).substr(2, 9)}`;
  showPassword = false;
  validationPolicies: any[] = [];
  isRequired = true;
  minLength = 8;
  placeholder = 'Enter password';
  passwordStrength = 0;

  ngOnInit(): void {
    this.initializeFromCallback();
    this.setupValidation();
  }

  private initializeFromCallback(): void {
    if (this.callback?.payload) {
      // Get initial value
      const initialValue = this.callback.payload.getInputValue ? 
        this.callback.payload.getInputValue() : '';
      this.passwordControl.setValue(initialValue);

      // Get validation policies - ensure it's always an array
      const policies = this.callback.payload.getPolicies ? 
        this.callback.payload.getPolicies() : null;
      this.validationPolicies = Array.isArray(policies) ? policies : [];

      // Get prompt and placeholder
      this.placeholder = this.callback.payload.getPrompt ? 
        this.callback.payload.getPrompt() : 'Enter password';

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
      });
    }

    // Add custom policy validator
    validators.push(this.policyValidator.bind(this));

    this.passwordControl.setValidators(validators);
    this.passwordControl.updateValueAndValidity();
  }

  private policyValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    // Only validate if we have policies array
    if (!Array.isArray(this.validationPolicies) || this.validationPolicies.length === 0) {
      return null;
    }

    const failedPolicies = this.validationPolicies.filter(policy => policy && !this.isPolicyMet(policy));
    
    if (failedPolicies.length > 0) {
      return {
        policy: {
          message: `Password does not meet ${failedPolicies.length} requirement(s)`
        }
      };
    }

    return null;
  }

  onPasswordInput(): void {
    this.calculatePasswordStrength();
    this.passwordControl.updateValueAndValidity();
  }

  private calculatePasswordStrength(): void {
    const password = this.passwordControl.value || '';
    let strength = 0;

    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    if (password.length >= 16) strength += 10;

    this.passwordStrength = Math.min(strength, 100);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  updateCallback(): void {
    const value = this.passwordControl.value || '';
    if (this.callback?.payload?.setInputValue) {
      this.callback.payload.setInputValue(value);
    }
    this.valueChange.emit(this.callback);
  }

  isPolicyMet(policy: any): boolean {
    const password = this.passwordControl.value || '';
    
    switch (policy.policyId) {
      case 'MIN_LENGTH':
        return password.length >= (policy.params?.minLength || 8);
      case 'AT_LEAST_X_CAPITAL_LETTERS':
        return (password.match(/[A-Z]/g) || []).length >= (policy.params?.numCaps || 1);
      case 'AT_LEAST_X_NUMBERS':
        return (password.match(/[0-9]/g) || []).length >= (policy.params?.numNums || 1);
      case 'AT_LEAST_X_SPECIAL_CHARACTERS':
        return (password.match(/[^A-Za-z0-9]/g) || []).length >= (policy.params?.numSpecial || 1);
      default:
        return true;
    }
  }

  getPolicyDescription(policy: any): string {
    switch (policy.policyId) {
      case 'MIN_LENGTH':
        return `At least ${policy.params?.minLength || 8} characters`;
      case 'AT_LEAST_X_CAPITAL_LETTERS':
        return `At least ${policy.params?.numCaps || 1} uppercase letter(s)`;
      case 'AT_LEAST_X_NUMBERS':
        return `At least ${policy.params?.numNums || 1} number(s)`;
      case 'AT_LEAST_X_SPECIAL_CHARACTERS':
        return `At least ${policy.params?.numSpecial || 1} special character(s)`;
      default:
        return policy.policyRequirement || 'Password requirement';
    }
  }

  getPolicyValidationClass(policy: any): string {
    return this.isPolicyMet(policy) ? 'text-green-600' : 'text-gray-500';
  }

  getStrengthColorClass(): string {
    if (this.passwordStrength >= 80) return 'bg-green-500';
    if (this.passwordStrength >= 60) return 'bg-yellow-500';
    if (this.passwordStrength >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  }

  getStrengthTextClass(): string {
    if (this.passwordStrength >= 80) return 'text-green-600';
    if (this.passwordStrength >= 60) return 'text-yellow-600';
    if (this.passwordStrength >= 40) return 'text-orange-600';
    return 'text-red-600';
  }

  getStrengthText(): string {
    if (this.passwordStrength >= 80) return 'Strong';
    if (this.passwordStrength >= 60) return 'Good';
    if (this.passwordStrength >= 40) return 'Fair';
    return 'Weak';
  }
}