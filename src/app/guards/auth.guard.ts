import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkStatus().pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        // If the user tries to access directly via the url (like https://local.LLM.ai/)
        // then it should redirect them to /about, however if they access a page, it should redirect them to /auth.

        // Root path is redirected to /about in routes, so if they are here, they tried to access a protected page.
        // Wait, if they go to / it redirects to /about which is NOT protected.
        // So any protected route should redirect to /auth.

        return router.createUrlTree(['/auth']);
      }
    })
  );
};
