import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.ts').then((m) => m.HomeComponent),
  },
  {
    path: 'apps',
    loadComponent: () =>
      import('./pages/apps/apps.ts').then((m) => m.AppsListComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.ts').then((m) => m.SettingsComponent),
  },
  {
    path: 'friends',
    loadComponent: () =>
      import('./pages/friends/friends.ts').then((m) => m.FriendsListComponent),
  },
  {
    path: 'credits',
    loadComponent: () =>
      import('./pages/credits/credits.ts').then((m) => m.CreditsComponent),
  },
  {
    path: 'social',
    loadComponent: () =>
      import('./pages/social/social.ts').then(
        (m) => m.SocialMediaSimComponent
      ),
  },
];
