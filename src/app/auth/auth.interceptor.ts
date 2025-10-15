import { HttpInterceptorFn } from '@angular/common/http';
import { TokenManager } from '@forgerock/javascript-sdk';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Only add auth header to API requests (not AM requests)
  if (req.url.includes('/api/')) {
    return from(TokenManager.getTokens()).pipe(
      switchMap(tokens => {
        if (tokens && typeof tokens === 'object' && 'accessToken' in tokens) {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
          });
          return next(authReq);
        }
        return next(req);
      })
    );
  }

  return next(req);
};