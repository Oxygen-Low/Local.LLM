import { Component, signal, computed, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";
import { UpdateService } from "../services/update.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-update-notification",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @if (showNotification() && authService.isAuthenticated()) {
      <div
        class="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 text-white p-4 rounded-lg shadow-xl z-50 max-w-sm"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-yellow-500">New Update!</h3>
          <button (click)="dismiss()" class="text-gray-400 hover:text-white">
            <svg
              class="h-5 w-5"
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
        <p class="text-sm mb-3">Version: {{ updateService.currentVersion() }}</p>
        <a
          routerLink="/changelogs"
          (click)="dismiss()"
          class="text-sm text-blue-400 hover:underline"
          >View Changelogs</a
        >
      </div>
    }
  `,
})
export class UpdateNotificationComponent {
  private dismissedVersion = signal<string | null>(
    localStorage.getItem("dismissedUpdateVersion"),
  );

  showNotification = computed(() => {
    const lastUpdateAt = this.updateService.lastUpdateAt();
    const currentVersion = this.updateService.currentVersion();

    if (!lastUpdateAt || currentVersion === "Unknown") return false;

    // Check if dismissed
    if (this.dismissedVersion() === currentVersion) return false;

    // Check if within 1 hour
    const lastUpdateDate = new Date(lastUpdateAt);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    return lastUpdateDate > oneHourAgo;
  });

  constructor(
    public updateService: UpdateService,
    public authService: AuthService,
  ) {}

  dismiss() {
    const currentVersion = this.updateService.currentVersion();
    localStorage.setItem("dismissedUpdateVersion", currentVersion);
    this.dismissedVersion.set(currentVersion);
  }
}
