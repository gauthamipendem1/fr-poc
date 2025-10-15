import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FRAuth, FRStep, StepType } from '@forgerock/javascript-sdk';
import { AuthStepState, StepData, CallbackData } from './models/callbacks';

@Injectable({
  providedIn: 'root'
})
export class TreeRunnerService {
  private stepStateSubject = new BehaviorSubject<AuthStepState>({
    isLoading: false,
    isComplete: false
  });

  public stepState$: Observable<AuthStepState> = this.stepStateSubject.asObservable();

  constructor() {}

  startTree(treeName: string): Observable<AuthStepState> {
    this.updateState({ isLoading: true, isComplete: false, error: undefined });

    return from(FRAuth.next(undefined, { tree: treeName })).pipe(
      map((step: any) => this.processStep(step)),
      catchError((error) => {
        this.updateState({ 
          isLoading: false, 
          error: error.message || 'Authentication failed',
          isComplete: false 
        });
        return throwError(() => error);
      })
    );
  }

  nextStep(step: FRStep): Observable<AuthStepState> {
    this.updateState({ isLoading: true });

    return from(FRAuth.next(step)).pipe(
      map((nextStep: any) => this.processStep(nextStep)),
      catchError((error) => {
        this.updateState({ 
          isLoading: false, 
          error: error.message || 'Step failed',
          isComplete: false 
        });
        return throwError(() => error);
      })
    );
  }

  private processStep(step: any): AuthStepState {
    if (step.type === StepType.LoginSuccess) {
      const state: AuthStepState = {
        isLoading: false,
        isComplete: true,
        error: undefined
      };
      this.updateState(state);
      return state;
    }

    if (step.type === StepType.LoginFailure) {
      const state: AuthStepState = {
        isLoading: false,
        isComplete: false,
        error: 'Authentication failed'
      };
      this.updateState(state);
      return state;
    }

    // Process callbacks for the current step
    const callbacks: CallbackData[] = step.callbacks?.map((callback: any) => ({
      type: callback.getType(),
      payload: callback
    })) || [];

    const stepData: StepData = {
      callbacks,
      header: this.extractHeader(step),
      description: this.extractDescription(step)
    };

    const state: AuthStepState = {
      currentStep: stepData,
      isLoading: false,
      isComplete: false,
      error: undefined
    };

    this.updateState(state);
    return state;
  }

  private extractHeader(step: any): string | undefined {
    // Look for TextOutputCallback with messageType 0 (information)
    const headerCallback = step.callbacks?.find((callback: any) => 
      callback.getType() === 'TextOutputCallback' &&
      callback.getOutputValue() && 
      callback.getMessageType() === 0
    );
    return headerCallback?.getOutputValue();
  }

  private extractDescription(step: any): string | undefined {
    // Look for TextOutputCallback with messageType 1 (warning) or 2 (error)
    const descCallback = step.callbacks?.find((callback: any) => 
      callback.getType() === 'TextOutputCallback' &&
      callback.getOutputValue() &&
      (callback.getMessageType() === 1 || callback.getMessageType() === 2)
    );
    return descCallback?.getOutputValue();
  }

  private updateState(partialState: Partial<AuthStepState>): void {
    const currentState = this.stepStateSubject.value;
    const newState = { ...currentState, ...partialState };
    this.stepStateSubject.next(newState);
  }

  getCurrentStep(): FRStep | null {
    const currentState = this.stepStateSubject.value;
    if (!currentState.currentStep?.callbacks?.length) {
      return null;
    }

    // Return the current step with callbacks
    const callbacks = currentState.currentStep.callbacks.map(cb => cb.payload);
    return { callbacks } as FRStep;
  }

  reset(): void {
    this.stepStateSubject.next({
      isLoading: false,
      isComplete: false,
      error: undefined
    });
  }
}