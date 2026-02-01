import { Component, OnInit } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
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
    // Subscribe to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Get current route
        const currentRoute = this.router.url;
        console.log("Route changed to:", currentRoute); // Debug

        // Hide navigation on home and auth pages
        if (currentRoute === "/" || currentRoute.startsWith("/auth")) {
          this.showNavigation = false;
        } else {
          this.showNavigation = true;
        }
      });

    // Set initial state
    const initialRoute = this.router.url;
    console.log("Initial route:", initialRoute); // Debug
    if (initialRoute === "/" || initialRoute.startsWith("/auth")) {
      this.showNavigation = false;
    }
  }
}
