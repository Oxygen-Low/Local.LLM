import { Component, OnInit, signal } from "@angular/core";
import { UpdateService } from "../../services/update.service";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-changelogs",
  standalone: true,
  template: `
    <div class="container mx-auto px-6 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-white mb-8">Changelogs</h1>

        @if (error()) {
          <div
            class="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6"
          >
            {{ error() }}
          </div>
        }

        <div
          class="prose prose-invert prose-yellow max-w-none bg-[#1e1e1e] p-8 rounded-xl border border-gray-800 shadow-2xl"
        >
          <pre
            class="whitespace-pre-wrap font-sans text-gray-300 border-none p-0 bg-transparent"
            >{{ content() }}</pre
          >
        </div>
      </div>
    </div>
  `,
})
export class ChangelogsComponent implements OnInit {
  content = signal<string>("");
  error = signal<string | null>(null);

  constructor(
    private updateService: UpdateService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.updateService.getChangelogs().subscribe({
      next: (data) => {
        this.content.set(data.content);
      },
      error: (err: any) => {
        if (err.status === 403) {
          this.router.navigate(["/403"]);
        } else if (err.status === 401) {
          this.router.navigate(["/auth"]);
        } else {
          this.error.set("Failed to load changelogs.");
        }
      },
    });
  }
}
