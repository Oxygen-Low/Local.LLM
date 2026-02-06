import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { adminGuard } from "./guards/admin.guard";

export const routes: Routes = [
  {
    path: "about",
    loadComponent: () =>
      import("./pages/home/home").then((m) => m.AboutComponent),
  },
  {
    path: "",
    redirectTo: "about",
    pathMatch: "full",
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
    path: "social",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/social/social").then((m) => m.SocialMediaSimComponent),
  },
  {
    path: "admin",
    canActivate: [adminGuard],
    loadComponent: () =>
      import("./pages/admin/admin").then((m) => m.AdminComponent),
  },
  {
    path: "403",
    loadComponent: () =>
      import("./pages/forbidden/forbidden").then((m) => m.ForbiddenComponent),
  },
  {
    path: "auth",
    loadComponent: () =>
      import("./pages/auth/auth").then((m) => m.AuthComponent),
  },
  {
    path: "changelogs",
    loadComponent: () =>
      import("./pages/changelogs/changelogs").then((m) => m.ChangelogsComponent),
  },
];
