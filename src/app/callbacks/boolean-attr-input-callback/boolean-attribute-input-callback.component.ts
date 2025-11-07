import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-boolean-attr-input-callback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ getPrompt() }}
      </label>
      <div class="flex items-center space-x-4">
        <label class="flex items-center">
          <input
            type="radio"
            [value]="true"
            [(ngModel)]="inputValue"
            (ngModelChange)="onInputChange($event)"
            [disabled]="disabled"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
          />
          <span class="ml-2 text-sm text-gray-900">{{ getTrueLabel() }}</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            [value]="false"
            [(ngModel)]="inputValue"
            (ngModelChange)="onInputChange($event)"
            [disabled]="disabled"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
          />
          <span class="ml-2 text-sm text-gray-900">{{ getFalseLabel() }}</span>
        </label>
      </div>
      <div *ngIf="getValidationError()" class="mt-1 text-sm text-red-600">
        {{ getValidationError() }}
      </div>
    </div>
  `
})
export class BooleanAttributeInputCallbackComponent implements BaseCallbackInterface, OnInit {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  inputValue: boolean | null = null;

  ngOnInit(): void {
    this.inputValue = this.callback.getInputValue();
  }

  getPrompt(): string {
    return this.callback.getOutputByName('prompt', 'Select an option');
  }

  getTrueLabel(): string {
    return this.callback.getOutputByName('trueLabel', 'Yes');
  }

  getFalseLabel(): string {
    return this.callback.getOutputByName('falseLabel', 'No');
  }

  getValidationError(): string {
    const failedPolicies = this.callback.getOutputByName('failedPolicies', []);
    if (failedPolicies && failedPolicies.length > 0) {
      return failedPolicies.map((policy: any) => policy.policyRequirement).join(', ');
    }
    return '';
  }

  onInputChange(value: boolean): void {
    this.callback.setInputValue(value);
    if (this.onSubmit) {
      this.onSubmit(value);
    }
  }
}