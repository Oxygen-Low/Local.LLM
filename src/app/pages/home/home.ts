import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section
      class="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <!-- Gradient Background -->
      <div
        class="absolute inset-0"
        style="background-color: #808080;"
      ></div>
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-20"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-20"
      ></div>

      <div
        class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div class="animate-fade-in">
          <!-- Main Heading -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span class="gradient-text">local.llm</span>
          </h1>

          <!-- Subheading -->
          <p
            class="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            An open-source community project.
          </p>

          <!-- Auth Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a routerLink="/auth" class="btn-primary"> Sign In </a>
            <a routerLink="/auth" class="btn-secondary"> Sign Up </a>
          </div>
        </div>

        <!-- Stats -->
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center">Why local.llm?</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            *ngFor="let feature of features"
            class="card p-8 card-hover group"
          >
            <h3 class="text-xl font-bold text-gray-100 mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-gray-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer CTA -->
    <section
      class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-gray-800"
    >
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-gray-100 mb-6">
          Ready to get started?
        </h2>
        <p>Hosted: Use this website.</p>
        <p>Self-Hosted: Go to our GitHub.</p>
      </div>
    </section>
  `,
})
export class AboutComponent {
  features = [
    {
      icon: "🤖",
      title: "Multiple Providers",
      description:
        "Connect to Ollama, OpenAI, OpenRouter, Deepseek, Claude, and more.",
    },
    {
      icon: "⚡",
      title: "Large Model Selection",
      description: "Pick any model from any provider.",
    },
    {
      icon: "🔒",
      title: "Private & Secure",
      description:
        "We almost never view your information, unless we detect you trying to bypass safety.",
    },
    {
      icon: "💰",
      title: "Credit System",
      description:
        "Free LLM credits with a daily and weekly limit for those who are unable to run LLM models on their device.",
    },
    {
      icon: "👥",
      title: "Share & Collaborate",
      description:
        "Some apps support multiplayer. Add your friends and create an adventure (or develop some things).",
    },
    {
      icon: "🧩",
      title: "Rich App Ecosystem",
      description: "Discover apps, many for different purposes.",
    },
  ];
}
