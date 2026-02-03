import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home").then((m) => m.AboutComponent),
  },
  {
    path: "apps",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/apps/apps").then((m) => m.AppsListComponent),
  },
  {
    path: "settings",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/settings/settings").then((m) => m.SettingsComponent),
  },
  {
    path: "friends",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/friends/friends").then((m) => m.FriendsListComponent),
  },
  {
    path: "credits",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/credits/credits").then((m) => m.CreditsComponent),
  },
  {
    path: "social",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/social/social").then((m) => m.SocialMediaSimComponent),
  },
  {
    path: "auth",
    loadComponent: () =>
      import("./pages/auth/auth").then((m) => m.AuthComponent),
  },
];
