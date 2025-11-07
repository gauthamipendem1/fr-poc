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
  BooleanAttributeInputCallback = 'BooleanAttributeInputCallback',
  ChoiceCallback = 'ChoiceCallback',
  ConfirmationCallback = 'ConfirmationCallback',
  DeviceProfileCallback = 'DeviceProfileCallback',
  HiddenValueCallback = 'HiddenValueCallback',
  KbaCreateCallback = 'KbaCreateCallback',
  MetadataCallback = 'MetadataCallback',
  NameCallback = 'NameCallback',
  NumberAttributeInputCallback = 'NumberAttributeInputCallback',
  PasswordCallback = 'PasswordCallback',
  PingOneProtectEvaluationCallback = 'PingOneProtectEvaluationCallback',
  PingOneProtectInitializeCallback = 'PingOneProtectInitializeCallback',
  PollingWaitCallback = 'PollingWaitCallback',
  ReCaptchaCallback = 'ReCaptchaCallback',
  ReCaptchaEnterpriseCallback = 'ReCaptchaEnterpriseCallback',
  RedirectCallback = 'RedirectCallback',
  SelectIdPCallback = 'SelectIdPCallback',
  StringAttributeInputCallback = 'StringAttributeInputCallback',
  SuspendedTextOutputCallback = 'SuspendedTextOutputCallback',
  TermsAndConditionsCallback = 'TermsAndConditionsCallback',
  TextInputCallback = 'TextInputCallback',
  TextOutputCallback = 'TextOutputCallback',
  ValidatedCreatePasswordCallback = 'ValidatedCreatePasswordCallback',
  ValidatedCreateUsernameCallback = 'ValidatedCreateUsernameCallback',
  WebAuthnRegistrationCallback = 'WebAuthnRegistrationCallback',
  WebAuthnAuthenticationCallback = 'WebAuthnAuthenticationCallback'
}