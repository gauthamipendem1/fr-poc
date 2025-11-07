import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';
import { BaseBrandedCallback } from '../base-branded-callback';
import { BrandingService } from '../../services/branding.service';

@Component({
  selector: 'app-choice-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [class]="getContainerClasses()" [ngStyle]="getThemeStyles()">
      <label [class]="getLabelClasses()">
        {{ callback?.getOutputByName('prompt', 'Select an option') || 'Select an option' }}
      </label>
      
      <!-- Radio buttons for single selection -->
      <div *ngIf="!isMultiSelect" [ngClass]="{'space-y-2': !isCompactLayout(), 'space-y-1': isCompactLayout()}">
        <div *ngFor="let choice of choices; let i = index" [class]="getChoiceOptionClasses()">
          <input
            [id]="'choice-' + i"
            [formControl]="choiceControl"
            [value]="i"
            type="radio"
            [disabled]="disabled"
            class="h-4 w-4 focus:ring-2 disabled:cursor-not-allowed"
            [style.accent-color]="currentBrand.theme.primaryColor"
            (change)="updateCallback()"
          >
          <label [for]="'choice-' + i" class="ml-3 cursor-pointer">
            {{ choice }}
          </label>
        </div>
      </div>

      <!-- Checkboxes for multiple selection -->
      <div *ngIf="isMultiSelect" [ngClass]="{'space-y-2': !isCompactLayout(), 'space-y-1': isCompactLayout()}">
        <div *ngFor="let choice of choices; let i = index" [class]="getChoiceOptionClasses()">
          <input
            [id]="'choice-' + i"
            type="checkbox"
            [checked]="selectedChoices.includes(i)"
            [disabled]="disabled"
            class="h-4 w-4 rounded focus:ring-2 disabled:cursor-not-allowed"
            [style.accent-color]="currentBrand.theme.primaryColor"
            (change)="toggleChoice(i)"
          >
          <label [for]="'choice-' + i" class="ml-3 cursor-pointer">
            {{ choice }}
          </label>
        </div>
      </div>

      <div *ngIf="choiceControl.invalid && choiceControl.touched" [class]="getErrorClasses()">
        <span *ngIf="choiceControl.errors?.['required']">Please select an option</span>
      </div>
    </div>
  `
})
export class ChoiceCallbackComponent extends BaseBrandedCallback implements OnInit, OnDestroy, BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  choiceControl = new FormControl('', [Validators.required]);
  choices: string[] = [];
  selectedChoices: number[] = [];
  isMultiSelect = false;

  constructor(brandingService: BrandingService) {
    super(brandingService);
  }

  ngOnInit(): void {
    // Get choices from ForgeRock callback output
    this.choices = this.callback?.getOutputByName('choices', []) || [];
    this.isMultiSelect = this.callback?.getOutputByName('multiSelect', false) || false;
    
    // Get default choice and current value
    const defaultChoice = this.callback?.getOutputByName('defaultChoice', 0);
    const currentValue = this.callback?.getInputValue();
    
    // Set initial value
    const initialValue = currentValue !== undefined ? currentValue : defaultChoice;
    
    if (this.isMultiSelect) {
      this.selectedChoices = Array.isArray(initialValue) ? initialValue : [initialValue];
    } else {
      this.choiceControl.setValue(initialValue);
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
      // Set multiple choices for multi-select
      this.callback.setInputValue(this.selectedChoices);
    } else {
      // Set single choice for single-select
      const selectedIndex = this.choiceControl.value;
      if (selectedIndex !== null && selectedIndex !== '') {
        this.callback.setInputValue(parseInt(selectedIndex));
      }
    }
    this.valueChange.emit(this.callback);
  }
}