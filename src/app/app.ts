import { Component, OnInit } from "@angular/core";
import { RouterOutlet, Router } from "@angular/router";
import { NavigationComponent } from "./components/navigation";
import { CommonModule } from "@angular/common";

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
    this.router.events.subscribe(() => {
      this.showNavigation = !this.router.url.startsWith("/auth") && this.router.url !== "/";
    });
  }
}
