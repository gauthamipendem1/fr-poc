import { CallbackType } from './models/callbacks';

export interface CallbackComponentMapping {
  type: string;
  component: string;
  selector: string;
}

export const CALLBACK_MAPPINGS: CallbackComponentMapping[] = [
  {
    type: CallbackType.NameCallback,
    component: 'NameCallbackComponent',
    selector: 'app-name-callback'
  },
  {
    type: CallbackType.PasswordCallback,
    component: 'PasswordCallbackComponent',
    selector: 'app-password-callback'
  },
  {
    type: CallbackType.ChoiceCallback,
    component: 'ChoiceCallbackComponent',
    selector: 'app-choice-callback'
  },
  {
    type: CallbackType.BooleanAttributeInputCallback,
    component: 'BooleanAttributeInputCallbackComponent',
    selector: 'app-boolean-attr-input-callback'
  },
  {
    type: CallbackType.KbaCreateCallback,
    component: 'KbaCreateCallbackComponent',
    selector: 'app-kba-create-callback'
  },
  {
    type: CallbackType.TextOutputCallback,
    component: 'TextOutputCallbackComponent',
    selector: 'app-text-output-callback'
  },
  {
    type: CallbackType.ReCaptchaCallback,
    component: 'RecaptchaCallbackComponent',
    selector: 'app-recaptcha-callback'
  },
  {
    type: CallbackType.WebAuthnRegistrationCallback,
    component: 'WebauthnRegisterCallbackComponent',
    selector: 'app-webauthn-register-callback'
  },
  {
    type: CallbackType.WebAuthnAuthenticationCallback,
    component: 'WebauthnAuthCallbackComponent',
    selector: 'app-webauthn-auth-callback'
  },
  {
    type: CallbackType.PollingWaitCallback,
    component: 'PollingWaitCallbackComponent',
    selector: 'app-polling-wait-callback'
  },
  // New callback types for registration
  {
    type: 'ValidatedCreateUsernameCallback',
    component: 'ValidatedCreateUsernameCallbackComponent',
    selector: 'app-validated-create-username-callback'
  },
  {
    type: 'StringAttributeInputCallback',
    component: 'StringAttributeInputCallbackComponent',
    selector: 'app-string-attribute-input-callback'
  },
  {
    type: 'ValidatedCreatePasswordCallback',
    component: 'ValidatedCreatePasswordCallbackComponent',
    selector: 'app-validated-create-password-callback'
  },
  {
    type: 'TermsAndConditionsCallback',
    component: 'TermsAndConditionsCallbackComponent',
    selector: 'app-terms-and-conditions-callback'
  }
];

export function getCallbackMapping(callbackType: string): CallbackComponentMapping | null {
  return CALLBACK_MAPPINGS.find(mapping => mapping.type === callbackType) || null;
}

export function getSupportedCallbackTypes(): string[] {
  return CALLBACK_MAPPINGS.map(mapping => mapping.type);
}