import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';
import { BaseBrandedCallback } from '../base-branded-callback';
import { BrandingService } from '../../services/branding.service';

@Component({
  selector: 'app-name-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [class]="getContainerClasses()" [ngStyle]="getThemeStyles()">
      <label [for]="inputId" [class]="getLabelClasses()">
        {{ callback?.getOutputByName('prompt', 'Username') || 'Username' }}
      </label>
      <input
        [id]="inputId"
        [formControl]="nameControl"
        type="text"
        [placeholder]="callback?.getOutputByName('prompt', 'Enter username') || 'Enter username'"
        [disabled]="disabled"
        [class]="getInputClasses()"
        [style.border-color]="nameControl.invalid && nameControl.touched ? '#dc2626' : ''"
        (blur)="updateCallback()"
        (keyup.enter)="updateCallback()"
      >
      <div *ngIf="nameControl.invalid && nameControl.touched" [class]="getErrorClasses()">
        <span *ngIf="nameControl.errors?.['required']">This field is required</span>
      </div>
    </div>
  `
})
export class NameCallbackComponent extends BaseBrandedCallback implements OnInit, OnDestroy, BaseCallbackInterface {
  @Input() callback: any;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  nameControl = new FormControl('', [Validators.required]);
  inputId = `name-input-${Math.random().toString(36).substr(2, 9)}`;

  constructor(brandingService: BrandingService) {
    super(brandingService);
  }

  ngOnInit(): void {
    const currentValue = this.callback?.getInputValue();
    if (currentValue) {
      this.nameControl.setValue(currentValue);
    }
  }

  updateCallback(): void {
    if (this.nameControl.valid) {
      this.callback.setInputValue(this.nameControl.value);
      this.valueChange.emit(this.callback);
    }
  }
}