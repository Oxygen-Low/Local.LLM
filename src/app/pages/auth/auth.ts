import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-auth",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center px-4"
      style="background-color: #282828;"
    >
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-20"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-20"
        ></div>
      </div>

      <!-- Auth Card -->
      <div class="relative z-10 w-full max-w-md">
        <div class="bg-gray-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-100 mb-2">
              {{ isSignup ? "Create Account" : "Welcome Back" }}
            </h1>
            <p class="text-gray-400">
              {{
                isSignup ? "Create a new account" : "Sign in to your account"
              }}
            </p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Username Field -->
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-gray-300 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                [(ngModel)]="username"
                name="username"
                class="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter your username"
                required
              />
            </div>

            <!-- Password Field -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                [(ngModel)]="password"
                name="password"
                class="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter your password"
                required
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {{ isSignup ? "Create Account" : "Sign In" }}
            </button>
          </form>

          <!-- Toggle Mode -->
          <div class="mt-6 text-center">
            <p class="text-gray-400 text-sm">
              {{
                isSignup ? "Already have an account?" : "Don't have an account?"
              }}
              <button
                (click)="toggleMode()"
                class="text-primary hover:text-primary/80 font-semibold transition"
              >
                {{ isSignup ? "Sign In" : "Sign Up" }}
              </button>
            </p>
          </div>

          <!-- Message -->
          <div
            *ngIf="message"
            class="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600"
          >
            <p class="text-gray-300 text-sm text-center">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthComponent {
  username = "";
  password = "";
  message = "";
  isSignup = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.message = "Please fill in all fields";
      return;
    }

    if (this.isSignup) {
      this.authService.register(this.username, this.password).subscribe({
        next: () => {
          this.message = "Registration successful!";
        },
        error: (err) => {
          this.message = err.error?.error || "Registration failed";
        },
      });
    } else {
      this.authService.login(this.username, this.password).subscribe({
        next: () => {
          this.message = "Login successful!";
        },
        error: (err) => {
          this.message = err.error?.error || "Login failed";
        },
      });
    }
  }

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.message = "";
    this.password = "";
  }
}
