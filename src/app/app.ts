import { Component, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { NavigationComponent } from "./components/navigation";
import { CountdownBannerComponent } from "./components/countdown-banner";
import { UpdateNotificationComponent } from "./components/update-notification";

import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    NavigationComponent,
    CountdownBannerComponent,
    UpdateNotificationComponent,
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App implements OnInit {
  showNavigation = signal(true);

  constructor(private router: Router) {}

  ngOnInit() {
    // Set initial state
    this.updateNavigationVisibility(this.router.url);

    // Subscribe to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateNavigationVisibility(event.url);
      });
  }

  private updateNavigationVisibility(url: string) {
    // Hide navigation on the about page ("/about" or "/") and auth routes
    const isAboutPage = url === "/" || url.startsWith("/about");
    const isAuthPage = url.startsWith("/auth");
    this.showNavigation.set(!(isAboutPage || isAuthPage));
  }
}
