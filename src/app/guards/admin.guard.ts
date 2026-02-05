import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkStatus().pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        // Not authenticated at all, redirect to auth page
        return router.createUrlTree(['/auth']);
      }
      
      // Check if user is admin
      if (authService.isAdmin()) {
        return true;
      } else {
        // Authenticated but not admin, redirect to 403 page
        return router.createUrlTree(['/403']);
      }
    })
  );
};
