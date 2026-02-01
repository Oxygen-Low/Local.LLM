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
    // Hide navigation on home and auth routes
    const updateNavigation = () => {
      const url = this.router.url || "/";
      this.showNavigation = url !== "/" && !url.startsWith("/auth");
    };

    updateNavigation();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(updateNavigation);
  }
}
