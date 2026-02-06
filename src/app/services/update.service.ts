import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { interval, of } from "rxjs";
import { switchMap, catchError, map } from "rxjs/operators";
import { API_BASE_URL } from "../api-url.token";

export interface UpdateStatus {
  updatePending: boolean;
  restartAt: number | null;
  updateVersion: string | null;
  currentVersion: string;
  lastUpdateAt: string | null;
  autoUpdateShowChangelogs: boolean;
}

export interface Changelogs {
  content: string;
  lastUpdateAt: string | null;
}

@Injectable({
  providedIn: "root",
})
export class UpdateService {
  private apiUrl = inject(API_BASE_URL);

  private statusSignal = signal<UpdateStatus | null>(null);

  updatePending = computed(() => this.statusSignal()?.updatePending || false);
  restartAt = computed(() => this.statusSignal()?.restartAt || null);
  updateVersion = computed(() => this.statusSignal()?.updateVersion || null);
  currentVersion = computed(() => this.statusSignal()?.currentVersion || "Unknown");
  lastUpdateAt = computed(() => this.statusSignal()?.lastUpdateAt || null);
  showChangelogsEnabled = computed(
    () => this.statusSignal()?.autoUpdateShowChangelogs || false,
  );

  // Real-time countdown in seconds
  countdown = signal<number>(0);

  constructor(private http: HttpClient) {
    // Initial fetch
    this.fetchStatus();

    // Poll every 10 seconds for update status
    interval(10000)
      .pipe(
        switchMap(() => this.fetchUpdateStatus()),
        catchError(() => of(null)),
      )
      .subscribe((status) => {
        this.statusSignal.set(status);
      });

    // Update countdown every second if update is pending
    setInterval(() => {
      const restart = this.restartAt();
      if (restart) {
        const remaining = Math.max(0, Math.floor((restart - Date.now()) / 1000));
        this.countdown.set(remaining);
      }
    }, 1000);
  }

  private fetchStatus() {
    this.fetchUpdateStatus().subscribe((status) => {
      this.statusSignal.set(status);
    });
  }

  private fetchUpdateStatus() {
    return this.http
      .get<UpdateStatus>(`${this.apiUrl}/update-status`, {
        withCredentials: true,
      })
      .pipe(catchError(() => of(null)));
  }

  getChangelogs() {
    return this.http.get<Changelogs>(`${this.apiUrl}/changelogs`, {
      withCredentials: true,
    });
  }
}
