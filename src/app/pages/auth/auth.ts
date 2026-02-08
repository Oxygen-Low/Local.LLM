import { Component } from "@angular/core";

import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-auth",
  standalone: true,
  imports: [FormsModule],
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
                [disabled]="isLoading"
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
              <div class="relative">
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  class="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition pr-10"
                  placeholder="Enter your password"
                  required
                  [disabled]="isLoading"
                  />
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  [disabled]="isLoading"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-0.5 transition-all"
                  [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                >
                  @if (showPassword) {
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12.013c0 1.66-1.342 3.001-3.001 3.001-1.659 0-3.001-1.342-3.001-3.001 0-1.659 1.342-3.001 3.001-3.001 1.659 0 3.001 1.342 3.001 3.001z" />
                    </svg>
                  }
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
              @if (isLoading) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              } @else {
                {{ isSignup ? "Create Account" : "Sign In" }}
              }
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
                [disabled]="isLoading"
                class="text-primary hover:text-primary/80 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {{ isSignup ? "Sign In" : "Sign Up" }}
              </button>
            </p>
          </div>

          <!-- Message -->
          @if (message) {
            <div
              class="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600"
              role="alert"
              aria-live="polite"
              >
              <p class="text-gray-300 text-sm text-center">{{ message }}</p>
            </div>
          }
        </div>
      </div>
    </div>
    `,
})
export class AuthComponent {
  username = "";
  password = "";
  showPassword = false;
  message = "";
  isSignup = false;
  isLoading = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.message = "Please fill in all fields";
      return;
    }

    this.isLoading = true;
    this.message = "";

    if (this.isSignup) {
      this.authService.register(this.username, this.password).subscribe({
        next: () => {
          this.message = "Registration successful!";
          // Keep loading state true as we navigate away
        },
        error: (err) => {
          this.isLoading = false;
          this.message = err.error?.error || "Registration failed";
        },
      });
    } else {
      this.authService.login(this.username, this.password).subscribe({
        next: () => {
          this.message = "Login successful!";
          // Keep loading state true as we navigate away
        },
        error: (err) => {
          this.isLoading = false;
          this.message = err.error?.error || "Login failed";
        },
      });
    }
  }

  toggleMode() {
    if (this.isLoading) return;
    this.isSignup = !this.isSignup;
    this.message = "";
    this.password = "";
  }
}
