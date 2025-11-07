import { CallbackType } from './models/callbacks';

export interface CallbackComponentMapping {
  type: string;
  component: string;
  selector: string;
}

export const CALLBACK_MAPPINGS: CallbackComponentMapping[] = [
  // Basic input callbacks
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
    type: CallbackType.TextInputCallback,
    component: 'TextInputCallbackComponent',
    selector: 'app-text-input-callback'
  },
  {
    type: CallbackType.NumberAttributeInputCallback,
    component: 'NumberAttributeInputCallbackComponent',
    selector: 'app-number-attribute-input-callback'
  },
  {
    type: CallbackType.StringAttributeInputCallback,
    component: 'StringAttributeInputCallbackComponent',
    selector: 'app-string-attribute-input-callback'
  },
  {
    type: CallbackType.BooleanAttributeInputCallback,
    component: 'BooleanAttributeInputCallbackComponent',
    selector: 'app-boolean-attr-input-callback'
  },
  
  // Choice and confirmation callbacks
  {
    type: CallbackType.ChoiceCallback,
    component: 'ChoiceCallbackComponent',
    selector: 'app-choice-callback'
  },
  {
    type: CallbackType.ConfirmationCallback,
    component: 'ConfirmationCallbackComponent',
    selector: 'app-confirmation-callback'
  },
  
  // Output callbacks
  {
    type: CallbackType.TextOutputCallback,
    component: 'TextOutputCallbackComponent',
    selector: 'app-text-output-callback'
  },
  {
    type: CallbackType.SuspendedTextOutputCallback,
    component: 'SuspendedTextOutputCallbackComponent',
    selector: 'app-suspended-text-output-callback'
  },
  
  // Security and verification callbacks
  {
    type: CallbackType.ReCaptchaCallback,
    component: 'RecaptchaCallbackComponent',
    selector: 'app-recaptcha-callback'
  },
  {
    type: CallbackType.ReCaptchaEnterpriseCallback,
    component: 'ReCaptchaEnterpriseCallbackComponent',
    selector: 'app-recaptcha-enterprise-callback'
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
  
  // Knowledge-based authentication
  {
    type: CallbackType.KbaCreateCallback,
    component: 'KbaCreateCallbackComponent',
    selector: 'app-kba-create-callback'
  },
  
  // Device and risk assessment
  {
    type: CallbackType.DeviceProfileCallback,
    component: 'DeviceProfileCallbackComponent',
    selector: 'app-device-profile-callback'
  },
  {
    type: CallbackType.PingOneProtectInitializeCallback,
    component: 'PingProtectInitializeCallbackComponent',
    selector: 'app-ping-protect-initialize-callback'
  },
  {
    type: CallbackType.PingOneProtectEvaluationCallback,
    component: 'PingProtectEvaluationCallbackComponent',
    selector: 'app-ping-protect-evaluation-callback'
  },
  
  // Identity provider and redirect callbacks
  {
    type: CallbackType.SelectIdPCallback,
    component: 'SelectIdPCallbackComponent',
    selector: 'app-select-idp-callback'
  },
  {
    type: CallbackType.RedirectCallback,
    component: 'RedirectCallbackComponent',
    selector: 'app-redirect-callback'
  },
  
  // System callbacks
  {
    type: CallbackType.MetadataCallback,
    component: 'MetadataCallbackComponent',
    selector: 'app-metadata-callback'
  },
  {
    type: CallbackType.PollingWaitCallback,
    component: 'PollingWaitCallbackComponent',
    selector: 'app-polling-wait-callback'
  },
  
  // Registration callbacks
  {
    type: CallbackType.ValidatedCreateUsernameCallback,
    component: 'ValidatedCreateUsernameCallbackComponent',
    selector: 'app-validated-create-username-callback'
  },
  {
    type: CallbackType.ValidatedCreatePasswordCallback,
    component: 'ValidatedCreatePasswordCallbackComponent',
    selector: 'app-validated-create-password-callback'
  },
  {
    type: CallbackType.TermsAndConditionsCallback,
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