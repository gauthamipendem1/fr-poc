import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenManager } from '@forgerock/javascript-sdk';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  try {
    const tokens = await TokenManager.getTokens();
    
    if (tokens && typeof tokens === 'object' && 'accessToken' in tokens) {
      // Check if token is not expired
      const accessToken = tokens.accessToken;
      if (accessToken && !isTokenExpired(accessToken)) {
        return true;
      }
    }
  } catch (error) {
    console.error('Error checking authentication status:', error);
  }

  // Redirect to login if not authenticated
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Assume expired if we can't parse
  }
}