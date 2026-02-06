import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { API_BASE_URL } from './api-url.token';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE_URL, useValue: window.location.origin + '/api' },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
};
