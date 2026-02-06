import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { adminGuard } from "./guards/admin.guard";

export const routes: Routes = [
  {
    path: "about",
    title: "Local.LLM",
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
    title: "Local.LLM",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/apps/apps").then((m) => m.AppsListComponent),
  },
  {
    path: "settings",
    title: "Local.LLM",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/settings/settings").then((m) => m.SettingsComponent),
  },
  {
    path: "friends",
    title: "Local.LLM",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/friends/friends").then((m) => m.FriendsListComponent),
  },
  {
    path: "social",
    title: "Local.LLM",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/social/social").then((m) => m.SocialMediaSimComponent),
  },
  {
    path: "admin",
    title: "Local.LLM",
    canActivate: [adminGuard],
    loadComponent: () =>
      import("./pages/admin/admin").then((m) => m.AdminComponent),
  },
  {
    path: "403",
    title: "Local.LLM",
    loadComponent: () =>
      import("./pages/forbidden/forbidden").then((m) => m.ForbiddenComponent),
  },
  {
    path: "auth",
    title: "Local.LLM",
    loadComponent: () =>
      import("./pages/auth/auth").then((m) => m.AuthComponent),
  },
  {
    path: "changelogs",
    title: "Local.LLM",
    loadComponent: () =>
      import("./pages/changelogs/changelogs").then((m) => m.ChangelogsComponent),
  },
];
