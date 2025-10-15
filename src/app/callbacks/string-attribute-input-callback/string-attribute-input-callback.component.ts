import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-string-attribute-input-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-4">
      <label [for]="inputId" class="block text-sm font-medium text-gray-700 mb-2">
        {{ displayName }}
        <span *ngIf="isRequired" class="text-red-500">*</span>
      </label>
      
      <!-- Regular input for most attributes -->
      <input
        *ngIf="inputType !== 'textarea'"
        [id]="inputId"
        [formControl]="attributeControl"
        [type]="inputType"
        [placeholder]="placeholder"
        [disabled]="disabled"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        (blur)="updateCallback()"
        (keyup.enter)="updateCallback()"
      >
      
      <!-- Textarea for longer text inputs -->
      <textarea
        *ngIf="inputType === 'textarea'"
        [id]="inputId"
        [formControl]="attributeControl"
        [placeholder]="placeholder"
        [disabled]="disabled"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
        (blur)="updateCallback()"
      ></textarea>
      
      <!-- Validation feedback -->
      <div *ngIf="attributeControl.invalid && attributeControl.touched" class="mt-1 text-sm text-red-600">
        <span *ngIf="attributeControl.errors?.['required']">This field is required</span>
        <span *ngIf="attributeControl.errors?.['email']">Please enter a valid email address</span>
        <span *ngIf="attributeControl.errors?.['minlength']">Must be at least {{ minLength }} characters</span>
        <span *ngIf="attributeControl.errors?.['maxlength']">Must be no more than {{ maxLength }} characters</span>
        <span *ngIf="attributeControl.errors?.['pattern']">Invalid format</span>
      </div>
      
      <!-- Help text -->
      <div *ngIf="helpText" class="mt-1 text-xs text-gray-500">
        {{ helpText }}
      </div>
    </div>
  `
})
export class StringAttributeInputCallbackComponent implements OnInit, BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  attributeControl = new FormControl('');
  inputId = `string-attr-input-${Math.random().toString(36).substr(2, 9)}`;
  
  displayName = '';
  inputType = 'text';
  placeholder = '';
  helpText = '';
  isRequired = false;
  minLength = 0;
  maxLength = 255;

  ngOnInit(): void {
    this.initializeFromCallback();
    this.setupValidation();
  }

  private initializeFromCallback(): void {
    if (this.callback?.payload) {
      // Get attribute name and value
      const attributeName = this.callback.payload.getName ? 
        this.callback.payload.getName() : 'Attribute';
      
      this.displayName = this.formatDisplayName(attributeName);
      
      // Get initial value
      const initialValue = this.callback.payload.getInputValue ? 
        this.callback.payload.getInputValue() : '';
      this.attributeControl.setValue(initialValue);

      // Get prompt if available
      this.placeholder = this.callback.payload.getPrompt ? 
        this.callback.payload.getPrompt() : `Enter ${this.displayName.toLowerCase()}`;

      // Check if required
      this.isRequired = this.callback.payload.isRequired ? 
        this.callback.payload.isRequired() : false;

      // Set input type based on attribute name
      this.inputType = this.getInputType(attributeName);
      
      // Set help text based on attribute
      this.helpText = this.getHelpText(attributeName);
    }
  }

  private formatDisplayName(attributeName: string): string {
    // Convert camelCase or snake_case to human readable
    return attributeName
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  private getInputType(attributeName: string): string {
    const name = attributeName.toLowerCase();
    
    if (name.includes('email')) return 'email';
    if (name.includes('phone') || name.includes('mobile')) return 'tel';
    if (name.includes('password')) return 'password';
    if (name.includes('url') || name.includes('website')) return 'url';
    if (name.includes('date')) return 'date';
    if (name.includes('number') || name.includes('age')) return 'number';
    if (name.includes('description') || name.includes('bio') || name.includes('comment')) return 'textarea';
    
    return 'text';
  }

  private getHelpText(attributeName: string): string {
    const name = attributeName.toLowerCase();
    
    if (name.includes('email')) return 'We\'ll use this to contact you';
    if (name.includes('phone')) return 'Include country code if international';
    if (name.includes('firstname') || name.includes('given')) return 'Your first name';
    if (name.includes('lastname') || name.includes('family') || name.includes('surname')) return 'Your last name';
    if (name.includes('address')) return 'Your full address';
    if (name.includes('postal') || name.includes('zip')) return 'Postal/ZIP code';
    
    return '';
  }

  private setupValidation(): void {
    const validators = [];
    
    if (this.isRequired) {
      validators.push(Validators.required);
    }

    // Add type-specific validators
    if (this.inputType === 'email') {
      validators.push(Validators.email);
    }

    // Add length validators if needed
    if (this.minLength > 0) {
      validators.push(Validators.minLength(this.minLength));
    }
    if (this.maxLength > 0 && this.maxLength < 1000) {
      validators.push(Validators.maxLength(this.maxLength));
    }

    this.attributeControl.setValidators(validators);
    this.attributeControl.updateValueAndValidity();
  }

  updateCallback(): void {
    const value = this.attributeControl.value || '';
    if (this.callback?.payload?.setInputValue) {
      this.callback.payload.setInputValue(value);
    }
    this.valueChange.emit(this.callback);
  }
}