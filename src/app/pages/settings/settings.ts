import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

type SettingsTab = "llm" | "account";

interface LLMProvider {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style="background-color: #282828;"
    >
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="section-title">Settings</h1>
          <p class="text-gray-400">Configure your local.llm experience</p>
        </div>

        <!-- Tab Navigation -->
        <div class="flex gap-4 mb-8">
          <button
            (click)="activeTab.set('llm')"
            [class.active]="activeTab() === 'llm'"
            class="px-6 py-3 font-medium transition-all duration-250 border-b-2 -mb-px"
            [ngClass]="
              activeTab() === 'llm'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            "
          >
            <svg
              class="w-5 h-5 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            LLM Configuration
          </button>
          <button
            (click)="activeTab.set('account')"
            [class.active]="activeTab() === 'account'"
            class="px-6 py-3 font-medium transition-all duration-250 border-b-2 -mb-px"
            [ngClass]="
              activeTab() === 'account'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            "
          >
            <svg
              class="w-5 h-5 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Account
          </button>
        </div>

        <!-- LLM Configuration Tab -->
        @if (activeTab() === "llm") {
          <div class="space-y-8">
            <!-- LLM Provider Selection -->
            <div class="card p-8">
              <h2 class="text-2xl font-bold text-gray-100 mb-6">
                LLM Provider
              </h2>
              <div class="mb-8">
                <label class="block text-sm font-medium text-gray-300 mb-3">
                  Select Provider
                </label>
                <select
                  [(ngModel)]="selectedProvider"
                  (change)="onProviderChange()"
                  class="input-field w-full"
                >
                  <option value="">-- Choose a provider --</option>
                  @for (provider of llmProviders; track provider) {
                    <option [value]="provider.id">
                      {{ provider.name }}
                    </option>
                  }
                </select>
                @if (selectedProvider) {
                  <p class="text-gray-400 text-sm mt-2">
                    {{ getProviderDescription() }}
                  </p>
                }
              </div>
              <!-- Dynamic Form Fields Based on Provider -->
              @if (selectedProvider && selectedProvider !== "built-in") {
                <div class="space-y-6 pt-6 border-t border-gray-800">
                  <!-- Ollama Fields -->
                  @if (selectedProvider === "ollama") {
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Ollama Base URL
                      </label>
                      <input
                        type="text"
                        placeholder="http://localhost:11434"
                        [(ngModel)]="formData.ollamaUrl"
                        class="input-field"
                      />
                      <p class="text-gray-500 text-sm mt-1">
                        The URL where Ollama is running
                      </p>
                    </div>
                  }
                  <!-- OpenAI Fields -->
                  @if (selectedProvider === "openai") {
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-300 mb-2"
                      >
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="sk-..."
                        [(ngModel)]="formData.apiKey"
                        class="input-field"
                      />
                      <p class="text-gray-500 text-sm mt-1">
                        Your OpenAI API key (stored locally)
                      </p>
                    </div>
                  }
                  <!-- OpenRouter Fields -->
                  @if (selectedProvider === "openrouter") {
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-300 mb-2"
                      >
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="sk-or-..."
                        [(ngModel)]="formData.apiKey"
                        class="input-field"
                      />
                      <p class="text-gray-500 text-sm mt-1">
                        Your OpenRouter API key
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Model Selection
                      </label>
                      <select [(ngModel)]="formData.model" class="input-field">
                        <option value="">-- Choose model --</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="gpt-4">GPT-4</option>
                        <option value="claude-2">Claude 2</option>
                      </select>
                    </div>
                  }
                  <!-- Deepseek Fields -->
                  @if (selectedProvider === "deepseek") {
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-300 mb-2"
                      >
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="sk-..."
                        [(ngModel)]="formData.apiKey"
                        class="input-field"
                      />
                      <p class="text-gray-500 text-sm mt-1">
                        Your Deepseek API key
                      </p>
                    </div>
                  }
                  <!-- Claude/Anthropic Fields -->
                  @if (selectedProvider === "claude") {
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-300 mb-2"
                      >
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="sk-ant-..."
                        [(ngModel)]="formData.apiKey"
                        class="input-field"
                      />
                      <p class="text-gray-500 text-sm mt-1">
                        Your Anthropic Claude API key
                      </p>
                    </div>
                  }
                  <!-- Save Button -->
                  <div class="pt-6 border-t border-gray-800">
                    <button (click)="saveLLMSettings()" class="btn-primary">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Configuration
                    </button>
                  </div>
                </div>
              }
              <!-- Built-in Information -->
              @if (selectedProvider === "built-in") {
                <div
                  class="p-6 bg-primary/5 border border-primary/20 rounded-lg mt-6"
                >
                  <div class="flex items-start gap-3">
                    <svg
                      class="w-6 h-6 text-primary flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div>
                      <h3 class="font-bold text-gray-100">Built-in Models</h3>
                      <p class="text-gray-400 text-sm mt-1">
                        Configure options for built-in model providers.
                      </p>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Account Tab -->
        @if (activeTab() === "account") {
          <div class="space-y-8">
            <!-- Profile Information -->
            <div class="card p-8">
              <h2 class="text-2xl font-bold text-gray-100 mb-6">
                Profile Information
              </h2>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="your_username"
                    [(ngModel)]="accountData.username"
                    class="input-field"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    [(ngModel)]="accountData.bio"
                    rows="4"
                    class="input-field"
                  ></textarea>
                </div>
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="public-profile"
                    [(ngModel)]="accountData.isPublic"
                    class="w-4 h-4"
                  />
                  <label
                    for="public-profile"
                    class="text-gray-300 cursor-pointer"
                  >
                    Make my profile public
                  </label>
                </div>
                <button (click)="saveAccountSettings()" class="btn-primary">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Profile
                </button>
              </div>
            </div>
            <!-- Security -->
            <div class="card p-8">
              <h2 class="text-2xl font-bold text-gray-100 mb-6">Security</h2>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    [(ngModel)]="passwordData.currentPassword"
                    class="input-field"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    [(ngModel)]="passwordData.newPassword"
                    class="input-field"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    [(ngModel)]="passwordData.confirmPassword"
                    class="input-field"
                  />
                </div>
                <button (click)="changePassword()" class="btn-primary">
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  Update Password
                </button>
              </div>
            </div>
            <!-- Logout -->
            <div class="card p-8">
              <h2 class="text-2xl font-bold text-gray-100 mb-6">Session</h2>
              <button
                (click)="logout()"
                class="btn-secondary w-full justify-center"
              >
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
            <!-- Data Management -->
            <div class="card p-8 border-error/20">
              <h2 class="text-2xl font-bold text-gray-100 mb-6">
                Data Management
              </h2>
              <p class="text-gray-400 mb-6">
                Manage your data and account deletion preferences.
              </p>
              <div class="space-y-4">
                <button class="w-full btn-secondary justify-center">
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Request Non-Essential Data Removal
                </button>
                <button
                  (click)="requestAccountDeletion()"
                  class="w-full btn-secondary justify-center border-error/50 hover:border-error hover:bg-error/10 text-error"
                >
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
                      d="M12 9v2m0 4v2m0 0H9m3 0h3"
                    />
                  </svg>
                  Request Account Deletion
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Toast Notification -->
      @if (showNotification()) {
        <div
          class="fixed bottom-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg-dark animate-fade-in"
        >
          {{ notificationMessage() }}
        </div>
      }

      <!-- Confirmation Modal -->
      @if (showDeleteModal()) {
        <div
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div class="card p-8 max-w-md mx-4">
            <h3 class="text-xl font-bold text-gray-100 mb-4">
              Confirm Account Deletion
            </h3>
            <p class="text-gray-400 mb-6">
              This action cannot be undone. All your data will be permanently
              deleted.
            </p>
            <div class="flex gap-3">
              <button
                (click)="showDeleteModal.set(false)"
                class="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                (click)="confirmAccountDeletion()"
                class="btn-primary flex-1"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .active {
        border-color: rgb(59, 130, 246);
        color: rgb(59, 130, 246);
      }
    `,
  ],
})
export class SettingsComponent {
  activeTab = signal<SettingsTab>("llm");
  selectedProvider = "";

  constructor(private authService: AuthService) {}
  showNotification = signal(false);
  notificationMessage = signal("");
  showDeleteModal = signal(false);

  llmProviders: LLMProvider[] = [
    {
      id: "ollama",
      name: "Ollama",
      description: "Run models locally with litellm wrapper",
    },
    { id: "openai", name: "OpenAI / ChatGPT", description: "OpenAI API" },
    {
      id: "openrouter",
      name: "OpenRouter",
      description: "Access multiple models through OpenRouter",
    },
    {
      id: "deepseek",
      name: "Deepseek",
      description: "Deepseek language models",
    },
    {
      id: "claude",
      name: "Claude / Anthropic",
      description: "Anthropic Claude models",
    },
    {
      id: "built-in",
      name: "Built-In Models",
      description: "Configure built-in model providers",
    },
  ];

  formData = {
    ollamaUrl: "",
    apiKey: "",
    model: "",
  };

  accountData = {
    username: "",
    bio: "",
    isPublic: false,
  };

  passwordData = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  onProviderChange(): void {
    this.formData = {
      ollamaUrl: "",
      apiKey: "",
      model: "",
    };
  }

  getProviderDescription(): string {
    const provider = this.llmProviders.find(
      (p) => p.id === this.selectedProvider,
    );
    return provider?.description || "";
  }

  saveLLMSettings(): void {
    this.showMessage("LLM configuration saved successfully!");
    // Settings would be saved to backend here
  }

  saveAccountSettings(): void {
    this.showMessage("Profile updated successfully!");
    // Settings would be saved to backend here
  }

  changePassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.showMessage("Passwords do not match!");
      return;
    }
    this.showMessage("Password updated successfully!");
    this.passwordData = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  }

  requestAccountDeletion(): void {
    this.showDeleteModal.set(true);
  }

  confirmAccountDeletion(): void {
    this.showDeleteModal.set(false);
    this.showMessage("Account deletion request submitted!");
  }

  logout(): void {
    this.authService.logout();
  }

  private showMessage(message: string): void {
    this.notificationMessage.set(message);
    this.showNotification.set(true);
    setTimeout(() => this.showNotification.set(false), 3000);
  }
}
