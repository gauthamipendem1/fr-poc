import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-number-attribute-input-callback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-4">
      <label [for]="inputId" class="block text-sm font-medium text-gray-700 mb-2">
        {{ getPrompt() }}
      </label>
      <input
        [id]="inputId"
        type="number"
        [(ngModel)]="inputValue"
        (ngModelChange)="onInputChange($event)"
        [disabled]="disabled"
        [required]="isRequired()"
        [min]="getMinValue()"
        [max]="getMaxValue()"
        [step]="getStep()"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div *ngIf="getValidationError()" class="mt-1 text-sm text-red-600">
        {{ getValidationError() }}
      </div>
    </div>
  `
})
export class NumberAttributeInputCallbackComponent implements BaseCallbackInterface, OnInit {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  inputId = `number-input-${Math.random().toString(36).substr(2, 9)}`;
  inputValue: number | null = null;

  ngOnInit(): void {
    this.inputValue = this.callback.getInputValue() || null;
  }

  getPrompt(): string {
    return this.callback.getOutputByName('prompt', 'Enter a number');
  }

  isRequired(): boolean {
    return this.callback.getOutputByName('required', false);
  }

  getMinValue(): number | null {
    return this.callback.getOutputByName('min', null);
  }

  getMaxValue(): number | null {
    return this.callback.getOutputByName('max', null);
  }

  getStep(): number {
    return this.callback.getOutputByName('step', 1);
  }

  getValidationError(): string {
    const failedPolicies = this.callback.getOutputByName('failedPolicies', []);
    if (failedPolicies && failedPolicies.length > 0) {
      return failedPolicies.map((policy: any) => policy.policyRequirement).join(', ');
    }
    return '';
  }

  onInputChange(value: number | null): void {
    this.callback.setInputValue(value);
    if (this.onSubmit) {
      this.onSubmit(value);
    }
  }
}