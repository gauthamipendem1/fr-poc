import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-choice-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ callback?.payload?.prompt || 'Select an option' }}
      </label>
      
      <!-- Radio buttons for single selection -->
      <div *ngIf="!isMultiSelect" class="space-y-2">
        <div *ngFor="let choice of choices; let i = index" class="flex items-center">
          <input
            [id]="'choice-' + i"
            [formControl]="choiceControl"
            [value]="i"
            type="radio"
            [disabled]="disabled"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:cursor-not-allowed"
            (change)="updateCallback()"
          >
          <label [for]="'choice-' + i" class="ml-3 block text-sm font-medium text-gray-700">
            {{ choice }}
          </label>
        </div>
      </div>

      <!-- Checkboxes for multiple selection -->
      <div *ngIf="isMultiSelect" class="space-y-2">
        <div *ngFor="let choice of choices; let i = index" class="flex items-center">
          <input
            [id]="'choice-' + i"
            type="checkbox"
            [checked]="selectedChoices.includes(i)"
            [disabled]="disabled"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
            (change)="toggleChoice(i)"
          >
          <label [for]="'choice-' + i" class="ml-3 block text-sm font-medium text-gray-700">
            {{ choice }}
          </label>
        </div>
      </div>

      <div *ngIf="choiceControl.invalid && choiceControl.touched" class="mt-1 text-sm text-red-600">
        <span *ngIf="choiceControl.errors?.['required']">Please select an option</span>
      </div>
    </div>
  `
})
export class ChoiceCallbackComponent implements OnInit, BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  choiceControl = new FormControl('', [Validators.required]);
  choices: string[] = [];
  selectedChoices: number[] = [];
  isMultiSelect = false;

  ngOnInit(): void {
    this.choices = this.callback?.payload?.choices || [];
    this.isMultiSelect = this.callback?.payload?.multiSelect || false;
    
    const defaultChoice = this.callback?.payload?.defaultChoice;
    if (defaultChoice !== undefined) {
      if (this.isMultiSelect) {
        this.selectedChoices = Array.isArray(defaultChoice) ? defaultChoice : [defaultChoice];
      } else {
        this.choiceControl.setValue(defaultChoice);
      }
    }
  }

  toggleChoice(index: number): void {
    if (this.isMultiSelect) {
      const choiceIndex = this.selectedChoices.indexOf(index);
      if (choiceIndex > -1) {
        this.selectedChoices.splice(choiceIndex, 1);
      } else {
        this.selectedChoices.push(index);
      }
      this.updateCallback();
    }
  }

  updateCallback(): void {
    if (this.isMultiSelect) {
      this.callback.payload.setChoiceIndex(this.selectedChoices);
    } else {
      const selectedIndex = this.choiceControl.value;
      if (selectedIndex !== null && selectedIndex !== '') {
        this.callback.payload.setChoiceIndex(parseInt(selectedIndex));
      }
    }
    this.valueChange.emit(this.callback);
  }
}