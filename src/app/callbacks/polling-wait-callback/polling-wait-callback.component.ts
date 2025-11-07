import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-polling-wait-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <div class="p-4 bg-blue-50 border-l-4 border-blue-400">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400 animate-spin" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              {{ getTitle() }}
            </h3>
            <div class="mt-2 text-sm text-blue-700">
              {{ getMessage() }}
            </div>
            <div class="mt-2 text-xs text-blue-600" *ngIf="showCountdown">
              Next check in: {{ remainingTime }}s
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-4 flex space-x-2" *ngIf="!autoPolling">
        <button 
          type="button"
          (click)="checkNow()"
          [disabled]="disabled || isChecking"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isChecking ? 'Checking...' : 'Check Now' }}
        </button>
        <button 
          type="button"
          (click)="cancel()"
          [disabled]="disabled"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  `
})
export class PollingWaitCallbackComponent implements BaseCallbackInterface, OnInit, OnDestroy {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  autoPolling = true;
  showCountdown = true;
  isChecking = false;
  remainingTime = 0;
  
  private pollingInterval: any;
  private countdownInterval: any;

  ngOnInit(): void {
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  getTitle(): string {
    return this.callback.getOutputByName('title', 'Please Wait');
  }

  getMessage(): string {
    return this.callback.getOutputByName('message', 'Processing your request...');
  }

  getPollingInterval(): number {
    return this.callback.getOutputByName('pollingInterval', 5000); // Default 5 seconds
  }

  getMaxWaitTime(): number {
    return this.callback.getOutputByName('maxWaitTime', 300000); // Default 5 minutes
  }

  getAutoPolling(): boolean {
    return this.callback.getOutputByName('autoPolling', true);
  }

  getWaitId(): string {
    return this.callback.getOutputByName('waitId', '');
  }

  private startPolling(): void {
    this.autoPolling = this.getAutoPolling();
    const intervalMs = this.getPollingInterval();
    
    if (this.autoPolling) {
      this.remainingTime = Math.floor(intervalMs / 1000);
      this.startCountdown();
      
      this.pollingInterval = setInterval(() => {
        this.performCheck();
        this.remainingTime = Math.floor(intervalMs / 1000);
        this.startCountdown();
      }, intervalMs);

      // Set a maximum wait time
      setTimeout(() => {
        if (this.pollingInterval) {
          this.stopPolling();
          this.handleTimeout();
        }
      }, this.getMaxWaitTime());
    }
  }

  private startCountdown(): void {
    this.stopCountdown();
    
    this.countdownInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.stopCountdown();
  }

  private async performCheck(): Promise<void> {
    this.isChecking = true;
    
    try {
      // Set the wait ID or any polling parameters
      const waitId = this.getWaitId();
      if (waitId) {
        this.callback.setInputValue(waitId);
      }

      if (this.onSubmit) {
        this.onSubmit({ action: 'poll', waitId });
      }
    } catch (error) {
      console.error('Polling check failed:', error);
    } finally {
      this.isChecking = false;
    }
  }

  private handleTimeout(): void {
    if (this.onSubmit) {
      this.onSubmit({ action: 'timeout' });
    }
  }

  checkNow(): void {
    if (!this.isChecking) {
      this.performCheck();
    }
  }

  cancel(): void {
    this.stopPolling();
    if (this.onSubmit) {
      this.onSubmit({ action: 'cancel' });
    }
  }
}