import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home").then((m) => m.HomeComponent),
  },
  {
    path: "apps",
    loadComponent: () =>
      import("./pages/apps/apps").then((m) => m.AppsListComponent),
  },
  {
    path: "settings",
    loadComponent: () =>
      import("./pages/settings/settings").then((m) => m.SettingsComponent),
  },
  {
    path: "friends",
    loadComponent: () =>
      import("./pages/friends/friends").then((m) => m.FriendsListComponent),
  },
  {
    path: "credits",
    loadComponent: () =>
      import("./pages/credits/credits").then((m) => m.CreditsComponent),
  },
  {
    path: "social",
    loadComponent: () =>
      import("./pages/social/social").then((m) => m.SocialMediaSimComponent),
  },
];
