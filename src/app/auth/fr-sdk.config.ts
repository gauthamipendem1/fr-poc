import { Config, TokenManager } from '@forgerock/javascript-sdk';
import { environment } from '../../environments/environment';

export function initializeForgeRockSDK(): void {
  // For development, construct full URL from current origin + path
  // For production, use full URL from environment
  const baseUrl = environment.fr.amUrl.startsWith('/') 
    ? window.location.origin + environment.fr.amUrl
    : environment.fr.amUrl;

  Config.set({
    serverConfig: { 
      baseUrl: baseUrl,
      timeout: 10000 
    },
    realmPath: environment.fr.realmPath,
    clientId: environment.fr.clientId,
    redirectUri: environment.fr.redirectUri,
    scope: environment.fr.scope
  });
}

export function getTokenManager() {
  return TokenManager;
}