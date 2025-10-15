import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-name-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-4">
      <label [for]="inputId" class="block text-sm font-medium text-gray-700 mb-2">
        {{ callback?.payload?.prompt || 'Username' }}
      </label>
      <input
        [id]="inputId"
        [formControl]="nameControl"
        type="text"
        [placeholder]="callback?.payload?.prompt || 'Enter username'"
        [disabled]="disabled"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        (blur)="updateCallback()"
        (keyup.enter)="updateCallback()"
      >
      <div *ngIf="nameControl.invalid && nameControl.touched" class="mt-1 text-sm text-red-600">
        <span *ngIf="nameControl.errors?.['required']">This field is required</span>
      </div>
    </div>
  `
})
export class NameCallbackComponent implements OnInit, BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  nameControl = new FormControl('', [Validators.required]);
  inputId = `name-input-${Math.random().toString(36).substr(2, 9)}`;

  ngOnInit(): void {
    if (this.callback?.payload?.input?.[0]?.value) {
      this.nameControl.setValue(this.callback.payload.input[0].value);
    }
  }

  updateCallback(): void {
    if (this.nameControl.valid) {
      this.callback.payload.setInputValue(this.nameControl.value);
      this.valueChange.emit(this.callback);
    }
  }
}