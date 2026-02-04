import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  lastUsed: string;
  status: "active" | "inactive" | "new";
  category: string;
}

@Component({
  selector: "app-apps-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style="background-color: #282828;"
    >
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="section-title">Available Apps</h1>
          <p class="text-gray-400 text-lg mb-8">
            Discover and launch apps and games that use LLMs.
          </p>

          <!-- Search and Filter -->
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search apps..."
              [(ngModel)]="searchQuery"
              class="input-field flex-1"
            />
            <select [(ngModel)]="selectedCategory" class="input-field sm:w-48">
              <option value="">All Categories</option>
              @for (cat of categories; track cat) {
                <option [value]="cat">
                  {{ cat }}
                </option>
              }
            </select>
          </div>
        </div>

        <!-- Apps Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (app of filteredApps(); track app) {
            <div class="card p-6 card-hover flex flex-col">
              <!-- App Icon and Status -->
              <div class="flex justify-between items-start mb-4">
                <div class="text-5xl">{{ app.icon }}</div>
                <span class="badge" [ngClass]="getStatusBadgeClass(app.status)">
                  {{ app.status === "new" ? "✨ New" : app.status }}
                </span>
              </div>
              <!-- App Info -->
              <h3 class="text-xl font-bold text-gray-100 mb-2">
                {{ app.name }}
              </h3>
              <p class="text-gray-400 text-sm mb-4 flex-grow">
                {{ app.description }}
              </p>
              <!-- App Category -->
              <div class="mb-4">
                <span class="badge badge-primary text-xs">{{
                  app.category
                }}</span>
              </div>
              <!-- Stats -->
              <div class="mb-6 py-4">
                <p class="text-xs text-gray-500 mb-1">Last Used</p>
                <p class="text-sm font-semibold text-gray-100">
                  {{ app.lastUsed }}
                </p>
              </div>
              <!-- Actions -->
              <div class="flex gap-3">
                <button class="btn-primary flex-1 text-sm">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"
                    />
                  </svg>
                  Launch
                </button>
                <button class="btn-secondary flex-1 text-sm">
                  <svg
                    class="w-4 h-4"
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
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Empty State -->
        @if (filteredApps().length === 0) {
          <div class="text-center py-12">
            <div class="text-5xl mb-4">📦</div>
            <h3 class="text-2xl font-bold text-gray-100 mb-2">No apps found</h3>
            <p class="text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class AppsListComponent {
  searchQuery = signal("");
  selectedCategory = signal("");

  categories = ["Productivity", "Writing", "Analysis", "Development", "Social"];

  apps: App[] = [
    {
      id: "1",
      name: "Social Media Simulator",
      description: "Simulate social media interactions powered by local LLMs",
      icon: "📱",
      lastUsed: "2 hours ago",
      status: "active",
      category: "Social",
    },
    {
      id: "2",
      name: "Code Assistant",
      description: "Get AI-powered code suggestions and explanations",
      icon: "💻",
      lastUsed: "1 day ago",
      status: "active",
      category: "Development",
    },
    {
      id: "3",
      name: "Writing Helper",
      description:
        "Enhance your writing with AI-powered suggestions and improvements",
      icon: "✍️",
      lastUsed: "3 days ago",
      status: "active",
      category: "Writing",
    },
    {
      id: "4",
      name: "Content Analyzer",
      description:
        "Analyze and summarize content with advanced NLP capabilities",
      icon: "📊",
      lastUsed: "Never",
      status: "new",
      category: "Analysis",
    },
    {
      id: "5",
      name: "Email Composer",
      description: "Generate professional emails with AI assistance",
      icon: "📧",
      lastUsed: "1 week ago",
      status: "inactive",
      category: "Productivity",
    },
    {
      id: "6",
      name: "Document Generator",
      description: "Create structured documents using templates and AI content",
      icon: "📄",
      lastUsed: "5 days ago",
      status: "active",
      category: "Productivity",
    },
  ];

  filteredApps = (() => {
    return this.apps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        app.description
          .toLowerCase()
          .includes(this.searchQuery().toLowerCase());
      const matchesCategory =
        !this.selectedCategory() || app.category === this.selectedCategory();

      return matchesSearch && matchesCategory;
    });
  }).bind(this);

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "active":
        return "badge-success";
      case "inactive":
        return "badge-warning";
      case "new":
        return "badge-primary";
      default:
        return "badge-primary";
    }
  }
}
