import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-confirmation-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <div class="mb-2" [innerHTML]="getMessage()"></div>
      <div class="flex gap-2">
        <button 
          *ngFor="let option of getOptions(); trackBy: trackByFn"
          type="button"
          (click)="handleSelection(option.value)"
          [disabled]="disabled"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ option.name }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmationCallbackComponent implements BaseCallbackInterface, OnInit {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  ngOnInit(): void {
    // Component initialization
  }

  getMessage(): string {
    return this.callback.getOutputByName('prompt', '');
  }

  getOptions(): Array<{ name: string; value: number }> {
    const options = this.callback.getOutputByName('options', []);
    const optionType = this.callback.getOutputByName('optionType', 0);
    
    // Default options based on optionType
    const defaultOptions = [
      { name: 'OK', value: 0 },
      { name: 'Cancel', value: 1 }
    ];

    if (options && options.length > 0) {
      return options.map((option: string, index: number) => ({
        name: option,
        value: index
      }));
    }

    return defaultOptions;
  }

  handleSelection(value: number): void {
    this.callback.setInputValue(value);
    if (this.onSubmit) {
      this.onSubmit(value);
    }
  }

  trackByFn(index: number, item: any): number {
    return item.value;
  }
}