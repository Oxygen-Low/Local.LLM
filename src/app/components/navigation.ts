import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav
      class="w-64 bg-black border-r border-gray-800 flex flex-col h-full fixed left-0 top-0 bottom-0 z-50 md:relative md:z-auto md:sticky md:top-0"
      [class.translate-x-0]="sidebarOpen() || !isMobile()"
      [class.-translate-x-full]="!sidebarOpen() && isMobile()"
    >
      <!-- Logo Section -->
      <div class="px-6 py-8 border-b border-gray-800">
        <a
          routerLink="/"
          class="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity block"
        >
          local.llm
        </a>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto py-6">
        <div class="space-y-2 px-4">
          <a
            routerLink="/apps"
            routerLinkActive="bg-gray-900 text-primary border-l-4 border-primary"
            class="text-gray-300 hover:text-white hover:bg-gray-900 block px-4 py-3 rounded-lg font-medium transition-colors duration-250 border-l-4 border-transparent"
          >
            Apps
          </a>
          <a
            routerLink="/friends"
            routerLinkActive="bg-gray-900 text-primary border-l-4 border-primary"
            class="text-gray-300 hover:text-white hover:bg-gray-900 block px-4 py-3 rounded-lg font-medium transition-colors duration-250 border-l-4 border-transparent"
          >
            Friends
          </a>
          <a
            routerLink="/credits"
            routerLinkActive="bg-gray-900 text-primary border-l-4 border-primary"
            class="text-gray-300 hover:text-white hover:bg-gray-900 block px-4 py-3 rounded-lg font-medium transition-colors duration-250 border-l-4 border-transparent"
          >
            Credits
          </a>
          <a
            routerLink="/settings"
            routerLinkActive="bg-gray-900 text-primary border-l-4 border-primary"
            class="text-gray-300 hover:text-white hover:bg-gray-900 block px-4 py-3 rounded-lg font-medium transition-colors duration-250 border-l-4 border-transparent"
          >
            Settings
          </a>
        </div>
      </div>

      <!-- User Menu -->
      <div class="border-t border-gray-800 px-4 py-6">
        <button
          class="w-full flex items-center justify-center p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-250"
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

      <!-- Mobile Close Button -->
      <div class="md:hidden px-4 pb-4">
        <button
          (click)="sidebarOpen.set(false)"
          class="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-250"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div
      *ngIf="sidebarOpen()"
      (click)="sidebarOpen.set(false)"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
    ></div>

    <!-- Mobile Menu Button (in header) -->
    <div class="fixed top-0 right-0 z-50 md:hidden p-4">
      <button
        (click)="sidebarOpen.set(!sidebarOpen())"
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-250"
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
  `,
})
export class NavigationComponent {
  sidebarOpen = signal(false);
}
