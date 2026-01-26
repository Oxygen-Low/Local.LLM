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
            <span class="gradient-text"><p>local.llm</p></span>
          </h1>

          <!-- Subheading -->
          <p
            class="text-xl sm:text-2xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            Run powerful language models locally. Access multiple LLM providers,
            manage your credits, and build amazing applications—all from your
            machine.
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
        <div
          class="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 pt-20 border-t border-slate-800"
        >
          <div class="card p-6" *ngFor="let stat of stats">
            <div class="text-4xl font-bold gradient-text mb-2">
              {{ stat.value }}
            </div>
            <p class="text-slate-400">{{ stat.label }}</p>
          </div>
        </div>
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
            <div
              class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-250"
            >
              {{ feature.icon }}
            </div>
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
          Set up your LLM provider and start building in minutes.
        </p>
        <a routerLink="/settings" class="btn-primary text-lg py-3 px-8">
          Get Started Now
        </a>
      </div>
    </section>
  `,
})
export class HomeComponent {
  stats = [
    { value: "∞", label: "Local Processing" },
    { value: "5+", label: "LLM Providers" },
    { value: "Fast", label: "Response Time" },
  ];

  features = [
    {
      icon: "🤖",
      title: "Multiple Providers",
      description:
        "Connect to Ollama, OpenAI, OpenRouter, Deepseek, Claude, and more.",
    },
    {
      icon: "⚡",
      title: "Blazing Fast",
      description:
        "Local processing means no network latency. Get instant responses.",
    },
    {
      icon: "🔒",
      title: "Private & Secure",
      description:
        "Your data stays on your machine. Full control over your environment.",
    },
    {
      icon: "💰",
      title: "Credit System",
      description:
        "Transparent pricing with daily limits and usage tracking for all providers.",
    },
    {
      icon: "👥",
      title: "Share & Collaborate",
      description:
        "Invite friends, share apps, and build together on the platform.",
    },
    {
      icon: "🧩",
      title: "Rich App Ecosystem",
      description:
        "Discover and create powerful applications powered by local LLMs.",
    },
  ];
}
