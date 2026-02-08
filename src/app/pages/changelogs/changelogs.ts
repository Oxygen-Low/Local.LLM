import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { UpdateService } from "../../services/update.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-changelogs",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          [innerHTML]="content()"
        ></div>
      </div>
    </div>
  `,
})
export class ChangelogsComponent implements OnInit {
  content = signal<SafeHtml>("");
  error = signal<string | null>(null);

  private sanitizer = inject(DomSanitizer);
  private updateService = inject(UpdateService);
  private router = inject(Router);

  ngOnInit() {
    this.updateService.getChangelogs().subscribe({
      next: (data) => {
        this.content.set(this.sanitizer.bypassSecurityTrustHtml(data.content));
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
