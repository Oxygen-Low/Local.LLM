import { Component, signal, OnInit, HostListener } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="w-64 bg-black flex flex-col h-full fixed left-0 top-0 bottom-0 z-50 md:relative md:z-auto md:sticky md:top-0 transition-transform duration-300 ease-in-out"
      [class.translate-x-0]="sidebarOpen() || !isMobile()"
      [class.-translate-x-full]="!sidebarOpen() && isMobile()"
    >
      <!-- Logo Section -->
      <div class="px-6 py-8">
        <a
          routerLink="/"
          class="text-2xl font-semibold text-white hover:text-gray-300 transition-colors block"
        >
          local.llm
        </a>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto py-6">
        <div class="space-y-1 px-4">
          <a
            routerLink="/apps"
            routerLinkActive="text-white bg-gray-900"
            class="text-gray-400 hover:text-white hover:bg-gray-900 block px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Apps
          </a>
          <a
            routerLink="/friends"
            routerLinkActive="text-white bg-gray-900"
            class="text-gray-400 hover:text-white hover:bg-gray-900 block px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Friends
          </a>
          <a
            routerLink="/settings"
            routerLinkActive="text-white bg-gray-900"
            class="text-gray-400 hover:text-white hover:bg-gray-900 block px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Settings
          </a>
        </div>
      </div>

      <!-- User Menu -->
      <div class="px-4 py-6">
        <button
          class="w-full flex items-center justify-center p-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-colors duration-200"
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
          class="w-full flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-colors duration-200"
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
    @if (sidebarOpen()) {
      <div
        (click)="sidebarOpen.set(false)"
        class="fixed inset-0 bg-black/40 z-40 md:hidden"
      ></div>
    }

    <!-- Mobile Menu Button (in header) -->
    <div class="fixed top-0 right-0 z-50 md:hidden p-4">
      <button
        (click)="sidebarOpen.set(!sidebarOpen())"
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-colors duration-200"
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
export class NavigationComponent implements OnInit {
  sidebarOpen = signal(false);
  isMobile = signal(false);

  ngOnInit() {
    this.updateIsMobile();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.updateIsMobile();
  }

  private updateIsMobile() {
    this.isMobile.set(window.innerWidth < 768);
  }
}
