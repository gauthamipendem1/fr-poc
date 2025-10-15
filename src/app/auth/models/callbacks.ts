export interface CallbackData {
  type: string;
  payload: any;
}

export interface StepData {
  callbacks: CallbackData[];
  header?: string;
  description?: string;
}

export interface AuthStepState {
  currentStep?: StepData;
  isLoading: boolean;
  error?: string;
  isComplete: boolean;
}

export enum CallbackType {
  NameCallback = 'NameCallback',
  PasswordCallback = 'PasswordCallback',
  ChoiceCallback = 'ChoiceCallback',
  BooleanAttributeInputCallback = 'BooleanAttributeInputCallback',
  KbaCreateCallback = 'KbaCreateCallback',
  TextOutputCallback = 'TextOutputCallback',
  ReCaptchaCallback = 'ReCaptchaCallback',
  WebAuthnRegistrationCallback = 'WebAuthnRegistrationCallback',
  WebAuthnAuthenticationCallback = 'WebAuthnAuthenticationCallback',
  PollingWaitCallback = 'PollingWaitCallback',
  HiddenValueCallback = 'HiddenValueCallback'
}