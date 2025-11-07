import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCallbackInterface } from '../base-callback.interface';

interface SecurityQuestion {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-kba-create-callback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        {{ getPrompt() }}
      </h3>
      <div class="space-y-4">
        <div *ngFor="let question of securityQuestions; let i = index; trackBy: trackByFn" class="border border-gray-200 rounded-lg p-4">
          <label [for]="'question-' + i" class="block text-sm font-medium text-gray-700 mb-2">
            Security Question {{ i + 1 }}
          </label>
          <select
            [id]="'question-' + i"
            [(ngModel)]="question.question"
            (ngModelChange)="onQuestionChange(i, $event)"
            [disabled]="disabled"
            class="block w-full mb-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">Select a security question...</option>
            <option *ngFor="let predefinedQuestion of getPredefinedQuestions(); trackBy: trackQuestionByFn" [value]="predefinedQuestion">
              {{ predefinedQuestion }}
            </option>
          </select>
          
          <label [for]="'answer-' + i" class="block text-sm font-medium text-gray-700 mb-1">
            Your Answer
          </label>
          <input
            [id]="'answer-' + i"
            type="text"
            [(ngModel)]="question.answer"
            (ngModelChange)="onAnswerChange(i, $event)"
            [disabled]="disabled"
            [placeholder]="'Enter your answer for question ' + (i + 1)"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
        </div>
      </div>
      <div *ngIf="getValidationError()" class="mt-2 text-sm text-red-600">
        {{ getValidationError() }}
      </div>
    </div>
  `
})
export class KbaCreateCallbackComponent implements BaseCallbackInterface, OnInit {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  securityQuestions: SecurityQuestion[] = [];

  ngOnInit(): void {
    this.initializeQuestions();
  }

  getPrompt(): string {
    return this.callback.getOutputByName('prompt', 'Please set up your security questions');
  }

  getRequiredQuestionCount(): number {
    return this.callback.getOutputByName('questionCount', 3);
  }

  getPredefinedQuestions(): string[] {
    const predefined = this.callback.getOutputByName('predefinedQuestions', []);
    if (predefined && predefined.length > 0) {
      return predefined;
    }
    
    // Default security questions
    return [
      "What was the name of your first pet?",
      "What is your mother's maiden name?",
      "What was the name of your elementary school?",
      "In what city were you born?",
      "What is the name of your favorite childhood friend?",
      "What was your childhood nickname?",
      "In what city did you meet your spouse/significant other?",
      "What is the name of your favorite childhood teacher?",
      "What was the make of your first car?",
      "What is your father's middle name?"
    ];
  }

  getValidationError(): string {
    const failedPolicies = this.callback.getOutputByName('failedPolicies', []);
    if (failedPolicies && failedPolicies.length > 0) {
      return failedPolicies.map((policy: any) => policy.policyRequirement).join(', ');
    }
    return '';
  }

  private initializeQuestions(): void {
    const questionCount = this.getRequiredQuestionCount();
    this.securityQuestions = Array(questionCount).fill(null).map(() => ({
      question: '',
      answer: ''
    }));

    // Load any existing data
    const existingData = this.callback.getInputValue();
    if (existingData && Array.isArray(existingData)) {
      existingData.forEach((item: any, index: number) => {
        if (this.securityQuestions[index]) {
          this.securityQuestions[index] = {
            question: item.question || '',
            answer: item.answer || ''
          };
        }
      });
    }
  }

  onQuestionChange(index: number, question: string): void {
    this.securityQuestions[index].question = question;
    this.updateCallback();
  }

  onAnswerChange(index: number, answer: string): void {
    this.securityQuestions[index].answer = answer;
    this.updateCallback();
  }

  private updateCallback(): void {
    const kbaData = this.securityQuestions.map(sq => ({
      question: sq.question,
      answer: sq.answer
    }));
    
    this.callback.setInputValue(kbaData);
    
    if (this.onSubmit) {
      this.onSubmit(kbaData);
    }
  }

  trackByFn(index: number): number {
    return index;
  }

  trackQuestionByFn(index: number, question: string): string {
    return question;
  }
}