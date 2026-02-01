import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav
      class="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 glass-effect"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a
              routerLink="/"
              class="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity"
            >
              local.llm
            </a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a
                routerLink="/apps"
                routerLinkActive="text-primary border-b-2 border-primary"
                class="text-slate-300 hover:text-slate-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-250"
              >
                Apps
              </a>
              <a
                routerLink="/friends"
                routerLinkActive="text-primary border-b-2 border-primary"
                class="text-slate-300 hover:text-slate-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-250"
              >
                Friends
              </a>
              <a
                routerLink="/credits"
                routerLinkActive="text-primary border-b-2 border-primary"
                class="text-slate-300 hover:text-slate-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-250"
              >
                Credits
              </a>
              <a
                routerLink="/settings"
                routerLinkActive="text-primary border-b-2 border-primary"
                class="text-slate-300 hover:text-slate-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-250"
              >
                Settings
              </a>
            </div>
          </div>

          <!-- User Menu Icon -->
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <button
                class="p-1 rounded-full text-slate-400 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary transition-colors duration-250"
              >
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              class="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-250"
            >
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="mobileMenuOpen()" class="md:hidden border-t border-slate-800">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            routerLink="/"
            routerLinkActive="bg-slate-800 text-primary"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="mobileMenuOpen.set(false)"
            class="text-slate-300 hover:bg-slate-800 hover:text-slate-100 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-250"
          >
            Home
          </a>
          <a
            routerLink="/apps"
            routerLinkActive="bg-slate-800 text-primary"
            (click)="mobileMenuOpen.set(false)"
            class="text-slate-300 hover:bg-slate-800 hover:text-slate-100 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-250"
          >
            Apps
          </a>
          <a
            routerLink="/friends"
            routerLinkActive="bg-slate-800 text-primary"
            (click)="mobileMenuOpen.set(false)"
            class="text-slate-300 hover:bg-slate-800 hover:text-slate-100 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-250"
          >
            Friends
          </a>
          <a
            routerLink="/credits"
            routerLinkActive="bg-slate-800 text-primary"
            (click)="mobileMenuOpen.set(false)"
            class="text-slate-300 hover:bg-slate-800 hover:text-slate-100 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-250"
          >
            Credits
          </a>
          <a
            routerLink="/settings"
            routerLinkActive="bg-slate-800 text-primary"
            (click)="mobileMenuOpen.set(false)"
            class="text-slate-300 hover:bg-slate-800 hover:text-slate-100 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-250"
          >
            Settings
          </a>
        </div>
      </div>
    </nav>
  `,
})
export class NavigationComponent {
  mobileMenuOpen = signal(false);
}
