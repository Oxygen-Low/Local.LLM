import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

interface CreditUsage {
  app: string;
  credits: number;
  percentage: number;
  lastUsed: string;
  icon: string;
}

interface DailyLimit {
  model: string;
  used: number;
  limit: number;
}

@Component({
  selector: "app-credits",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style="background-color: #5a5a5a;"
    >
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="section-title">Credits</h1>
          <p class="text-gray-400">
            Track your credits and usage across models
          </p>
        </div>

        <!-- Main Balance Card -->
        <div class="card p-12 mb-12 text-center">
          <p class="text-gray-400 text-lg mb-4">Weekly Credits Available</p>
          <div class="text-7xl font-bold gradient-text mb-6">15,750</div>
          <p class="text-gray-300 text-lg mb-8">
            Reset in <span class="font-semibold">8 days</span>
          </p>
        </div>

        <!-- Daily/Weekly Limits -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div class="card p-8">
            <h2 class="text-2xl font-bold text-gray-100 mb-6">Daily Limits</h2>

            <div class="space-y-6">
              <div *ngFor="let limit of dailyLimits">
                <div class="flex justify-between items-end mb-2">
                  <p class="font-medium text-gray-300">{{ limit.model }}</p>
                  <p class="text-sm text-gray-400">
                    {{ limit.used }} / {{ limit.limit }}
                  </p>
                </div>
                <div
                  class="w-full bg-gray-800 rounded-full h-3 overflow-hidden"
                >
                  <div
                    class="bg-gradient-primary h-full transition-all duration-300"
                    [style.width.%]="(limit.used / limit.limit) * 100"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Weekly Usage Chart Placeholder -->
          <div class="card p-8">
            <h2 class="text-2xl font-bold text-gray-100 mb-6">Weekly Usage</h2>

            <div class="space-y-4">
              <div *ngFor="let day of weekDays" class="flex items-end gap-3">
                <p class="w-12 text-sm text-gray-400">{{ day.label }}</p>
                <div
                  class="flex-1 bg-gradient-primary rounded-t h-24 transition-all duration-300 hover:opacity-80"
                  [style.height.%]="(day.usage / 100) * 100"
                  style="min-height: 4px"
                ></div>
                <p class="w-12 text-right text-sm text-gray-400">
                  {{ day.usage }}
                </p>
              </div>
            </div>

            <p class="text-gray-500 text-xs mt-6 text-center">
              Credits used this week
            </p>
          </div>
        </div>

        <!-- Usage Breakdown -->
        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-100 mb-8">Usage Breakdown</h2>

          <!-- Stats Summary -->
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-800/50 rounded-lg"
          >
            <div class="text-center">
              <p class="text-sm text-gray-400 mb-1">Total Apps</p>
              <p class="text-3xl font-bold text-primary">6</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-400 mb-1">Models Used</p>
              <p class="text-3xl font-bold text-primary">4</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-400 mb-1">Total Credits Used</p>
              <p class="text-3xl font-bold text-primary">8,250</p>
            </div>
          </div>

          <!-- Detailed Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="border-b border-gray-800">
                <tr>
                  <th class="pb-4 px-4 text-gray-400 font-semibold text-sm">
                    App / Model
                  </th>
                  <th class="pb-4 px-4 text-gray-400 font-semibold text-sm">
                    Credits Used
                  </th>
                  <th class="pb-4 px-4 text-gray-400 font-semibold text-sm">
                    Usage %
                  </th>
                  <th class="pb-4 px-4 text-gray-400 font-semibold text-sm">
                    Last Used
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let usage of usageBreakdown"
                  class="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">{{ usage.icon }}</span>
                      <div>
                        <p class="text-gray-100 font-medium">
                          {{ usage.app }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-gray-100 font-medium">
                    {{ usage.credits.toLocaleString() }}
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-2">
                      <div class="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          class="bg-gradient-primary h-full rounded-full"
                          [style.width.%]="usage.percentage"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-400 w-10 text-right">
                        {{ usage.percentage }}%
                      </span>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-gray-400 text-sm">
                    {{ usage.lastUsed }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold text-gray-100 mb-8">FAQ</h2>

          <div class="space-y-4">
            <div class="card p-6">
              <h3 class="font-bold text-gray-100 mb-2">
                How are credits calculated?
              </h3>
              <p class="text-gray-400">
                Each LLM model has different credit limits. Every prompt and
                mini action uses a credit on the llm's type. (Mini actions refer
                to actions such as creating a file or editing a file.)
              </p>
            </div>

            <div class="card p-6">
              <h3 class="font-bold text-gray-100 mb-2">
                Can I carry over unused credits?
              </h3>
              <p class="text-gray-400">
                No, credits reset on a weekly basis. Any unused credits at the
                end of the week are not carried over to the next week.
              </p>
            </div>

            <div class="card p-6">
              <h3 class="font-bold text-gray-100 mb-2">
                What happens if I run out of credits?
              </h3>
              <p class="text-gray-400">
                You can still use external llm providers such as OpenAI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CreditsComponent {
  dailyLimits: DailyLimit[] = [
    {
      model: "Fast (Gemma3:4b) + Super Fast (Gemma3:1b)",
      used: 1500,
      limit: 2000,
    },
    { model: "Balanced (Mistral)", used: 450, limit: 800 },
    { model: "Power (nemotron-3-nano:30b)", used: 100, limit: 200 },
  ];

  weekDays = [
    { label: "Mon", usage: 85 },
    { label: "Tue", usage: 72 },
    { label: "Wed", usage: 95 },
    { label: "Thu", usage: 65 },
    { label: "Fri", usage: 88 },
    { label: "Sat", usage: 42 },
    { label: "Sun", usage: 30 },
  ];

  usageBreakdown: CreditUsage[] = [
    {
      app: "Social Media Simulator",
      credits: 2500,
      percentage: 30,
      lastUsed: "2 hours ago",
      icon: "📱",
    },
    {
      app: "Code Assistant",
      credits: 2100,
      percentage: 25,
      lastUsed: "1 day ago",
      icon: "💻",
    },
    {
      app: "Writing Helper",
      credits: 1800,
      percentage: 22,
      lastUsed: "3 days ago",
      icon: "✍️",
    },
    {
      app: "Email Composer",
      credits: 1200,
      percentage: 15,
      lastUsed: "1 week ago",
      icon: "📧",
    },
    {
      app: "Document Generator",
      credits: 650,
      percentage: 8,
      lastUsed: "5 days ago",
      icon: "📄",
    },
  ];
}
