import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-forbidden",
  standalone: true,
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4"
    >
      <div class="max-w-md w-full text-center">
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-white mb-4">403</h1>
          <h2 class="text-3xl font-semibold text-gray-300 mb-2">
            Access Forbidden
          </h2>
          <p class="text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>

        <div class="space-y-3">
          <button
            (click)="goBack()"
            class="w-full bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Go Back
          </button>
          <button
            (click)="goHome()"
            class="w-full bg-gray-800 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ForbiddenComponent {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(["/apps"]);
  }
}
