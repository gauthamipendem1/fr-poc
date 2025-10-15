import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-password-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-4">
      <label [for]="inputId" class="block text-sm font-medium text-gray-700 mb-2">
        {{ callback?.payload?.prompt || 'Password' }}
      </label>
      <div class="relative">
        <input
          [id]="inputId"
          [formControl]="passwordControl"
          [type]="showPassword ? 'text' : 'password'"
          [placeholder]="callback?.payload?.prompt || 'Enter password'"
          [disabled]="disabled"
          class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          (blur)="updateCallback()"
          (keyup.enter)="updateCallback()"
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
      <div *ngIf="passwordControl.invalid && passwordControl.touched" class="mt-1 text-sm text-red-600">
        <span *ngIf="passwordControl.errors?.['required']">This field is required</span>
      </div>
    </div>
  `
})
export class PasswordCallbackComponent implements OnInit, BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  passwordControl = new FormControl('', [Validators.required]);
  showPassword = false;
  inputId = `password-input-${Math.random().toString(36).substr(2, 9)}`;

  ngOnInit(): void {
    if (this.callback?.payload?.input?.[0]?.value) {
      this.passwordControl.setValue(this.callback.payload.input[0].value);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  updateCallback(): void {
    if (this.passwordControl.valid) {
      this.callback.payload.setInputValue(this.passwordControl.value);
      this.valueChange.emit(this.callback);
    }
  }
}