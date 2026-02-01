import { Component, OnInit } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd, NavigationStart } from "@angular/router";
import { NavigationComponent } from "./components/navigation";
import { CommonModule } from "@angular/common";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, CommonModule],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App implements OnInit {
  showNavigation = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize navigation visibility
    setTimeout(() => {
      this.updateNavigation(this.router.url || "/");
    }, 0);

    // Update on navigation start
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        this.updateNavigation(event.url);
      });

    // Also update on navigation end as fallback
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateNavigation(event.urlAfterRedirects);
      });
  }

  private updateNavigation(url: string) {
    // Hide navigation on home ("/") and auth routes ("/auth*")
    this.showNavigation = url !== "/" && !url.startsWith("/auth");
  }
}
