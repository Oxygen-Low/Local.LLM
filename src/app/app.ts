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
    this.updateNavigation();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateNavigation();
      });
  }

  private updateNavigation() {
    const url = this.router.url;
    this.showNavigation = url !== "/" && !url.startsWith("/auth");
  }
}
