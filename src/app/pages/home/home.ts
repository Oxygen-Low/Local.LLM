import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section
      class="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <!-- Gradient Background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
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
            class="text-xl sm:text-2xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            An open-source community project.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a routerLink="/apps" class="btn-primary">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Explore Apps
            </a>
            <a routerLink="/settings" class="btn-secondary">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Configure
            </a>
          </div>
        </div>

        <!-- Stats -->
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center">Why local.llm?</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            *ngFor="let feature of features"
            class="card p-8 card-hover group"
          >
            <h3 class="text-xl font-bold text-slate-100 mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-slate-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer CTA -->
    <section
      class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 to-slate-800"
    >
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-slate-100 mb-6">
          Ready to get started?
        </h2>
        <p class="text-xl text-slate-400 mb-8">
          Clone or fork our github repository - Or just use this website.
        </p>
      </div>
    </section>
  `,
})
export class HomeComponent {
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
