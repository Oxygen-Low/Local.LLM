import { Component, OnInit } from "@angular/core";
import { RouterOutlet, Router, NavigationStart } from "@angular/router";
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
    // Initialize navigation visibility based on current URL
    this.updateNavigation(this.router.url);

    // Update navigation visibility on route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        this.updateNavigation(event.url);
      });
  }

  private updateNavigation(url: string) {
    // Hide navigation on home ("/") and auth routes ("/auth*")
    this.showNavigation = url !== "/" && !url.startsWith("/auth");
  }
}
