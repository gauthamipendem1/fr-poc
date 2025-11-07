import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-suspended-text-output-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <div class="p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              {{ getTitle() }}
            </h3>
            <div class="mt-2 text-sm text-yellow-700" [innerHTML]="getMessage()">
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="hasAction()" class="mt-4">
        <button 
          type="button"
          (click)="handleAction()"
          [disabled]="disabled"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  `
})
export class SuspendedTextOutputCallbackComponent implements BaseCallbackInterface {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  getTitle(): string {
    return this.callback.getOutputByName('title', 'Information');
  }

  getMessage(): string {
    return this.callback.getOutputByName('message', '');
  }

  hasAction(): boolean {
    return this.callback.getOutputByName('hasAction', false);
  }

  handleAction(): void {
    if (this.onSubmit) {
      this.onSubmit(true);
    }
  }
}