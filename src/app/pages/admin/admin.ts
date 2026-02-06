import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-admin",
  standalone: true,
  template: `
    <div class="min-h-screen p-8" style="background-color: #282828;">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p class="text-gray-400">
            Welcome, {{ authService.currentUser()?.username }}
          </p>
        </div>

        <!-- Placeholder Content -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <!-- Stats Card 1 -->
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-2">Total Users</h3>
            <p class="text-3xl font-bold text-blue-400">-</p>
            <p class="text-sm text-gray-400 mt-2">Coming soon</p>
          </div>

          <!-- Stats Card 2 -->
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-2">
              Active Sessions
            </h3>
            <p class="text-3xl font-bold text-green-400">-</p>
            <p class="text-sm text-gray-400 mt-2">Coming soon</p>
          </div>

          <!-- Stats Card 3 -->
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-2">System Status</h3>
            <p class="text-3xl font-bold text-purple-400">-</p>
            <p class="text-sm text-gray-400 mt-2">Coming soon</p>
          </div>
        </div>

        <!-- Placeholder Message -->
        <div
          class="mt-8 bg-gray-800 rounded-lg p-8 border border-gray-700 text-center"
        >
          <svg
            class="w-16 h-16 text-gray-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h2 class="text-2xl font-semibold text-white mb-2">Admin Panel</h2>
          <p class="text-gray-400 max-w-md mx-auto">
            This is a placeholder for the admin dashboard. Admin features and
            functionality will be added here.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class AdminComponent {
  constructor(public authService: AuthService) {}
}
