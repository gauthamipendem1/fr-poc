import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

declare global {
  interface Window {
    PingOneProtect?: any;
  }
}

@Component({
  selector: 'app-ping-protect-evaluation-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <div class="p-4 bg-blue-50 border-l-4 border-blue-400">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400 animate-spin" viewBox="0 0 24 24" *ngIf="evaluating">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" *ngIf="!evaluating">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              {{ evaluating ? 'Evaluating Security Risk' : 'Security Evaluation Complete' }}
            </h3>
            <div class="mt-2 text-sm text-blue-700">
              {{ evaluating ? 'Analyzing behavioral and device signals...' : 'Risk assessment completed successfully.' }}
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="error" class="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
        <div class="text-sm text-red-700">
          {{ error }}
        </div>
      </div>
    </div>
  `
})
export class PingProtectEvaluationCallbackComponent implements BaseCallbackInterface, OnInit {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  evaluating = true;
  error: string = '';
  private evaluationTimeout: any;

  ngOnInit(): void {
    this.performEvaluation();
  }

  ngOnDestroy(): void {
    if (this.evaluationTimeout) {
      clearTimeout(this.evaluationTimeout);
    }
  }

  private async performEvaluation(): Promise<void> {
    try {
      // Set a timeout for evaluation
      this.evaluationTimeout = setTimeout(() => {
        this.error = 'Risk evaluation timed out';
        this.evaluating = false;
        this.handleEvaluationComplete(null);
      }, 15000); // 15 second timeout

      if (!window.PingOneProtect) {
        throw new Error('PingOne Protect SDK not initialized');
      }

      const evaluationData = await this.collectEvaluationData();
      
      clearTimeout(this.evaluationTimeout);
      this.evaluating = false;
      this.handleEvaluationComplete(evaluationData);
    } catch (error) {
      clearTimeout(this.evaluationTimeout);
      this.evaluating = false;
      this.error = error instanceof Error ? error.message : 'Risk evaluation failed';
      this.handleEvaluationComplete(null);
    }
  }

  private async collectEvaluationData(): Promise<any> {
    if (!window.PingOneProtect) {
      throw new Error('PingOne Protect SDK not available');
    }

    try {
      // Collect behavioral and device signals
      const signals = await window.PingOneProtect.getSignals();
      
      // Get any additional evaluation parameters from the callback
      const evaluationConfig = this.getEvaluationConfig();
      
      const evaluationData = {
        signals,
        timestamp: Date.now(),
        sessionId: this.generateSessionId(),
        userId: evaluationConfig.userId,
        evaluationType: evaluationConfig.evaluationType || 'authentication',
        customAttributes: evaluationConfig.customAttributes || {},
        
        // Include any additional context
        userAgent: navigator.userAgent,
        ipAddress: evaluationConfig.clientIP,
        deviceId: evaluationConfig.deviceId
      };

      return evaluationData;
    } catch (error) {
      throw new Error(`Failed to collect evaluation data: ${error}`);
    }
  }

  private getEvaluationConfig(): any {
    return {
      userId: this.callback.getOutputByName('userId', ''),
      evaluationType: this.callback.getOutputByName('evaluationType', 'authentication'),
      clientIP: this.callback.getOutputByName('clientIP', ''),
      deviceId: this.callback.getOutputByName('deviceId', ''),
      customAttributes: this.callback.getOutputByName('customAttributes', {}),
      
      // Additional evaluation parameters
      riskPolicies: this.callback.getOutputByName('riskPolicies', []),
      contextualData: this.callback.getOutputByName('contextualData', {})
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleEvaluationComplete(evaluationData: any): void {
    const result = {
      success: evaluationData !== null,
      data: evaluationData,
      timestamp: Date.now(),
      error: evaluationData ? null : this.error
    };

    this.callback.setInputValue(JSON.stringify(result));
    
    if (this.onSubmit) {
      this.onSubmit(result);
    }
  }
}