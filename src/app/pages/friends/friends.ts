import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen: string;
  addedDate: string;
}

interface FriendRequest {
  id: string;
  username: string;
  avatar: string;
  timestamp: string;
  type: "incoming" | "outgoing";
}

@Component({
  selector: "app-friends-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-start">
          <div>
            <h1 class="section-title">Friends</h1>
            <p class="text-gray-400">
              Manage your friends and friend requests
            </p>
          </div>
          <button (click)="showAddFriendModal.set(true)" class="btn-primary">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Friend
          </button>
        </div>

        <!-- Friend Requests Section -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-gray-100 mb-6">
            Friend Requests ({{ friendRequests.length }})
          </h2>

          <div *ngIf="friendRequests.length === 0" class="card p-8 text-center">
            <div class="text-4xl mb-3">📬</div>
            <p class="text-gray-400">No pending friend requests</p>
          </div>

          <!-- Incoming Requests -->
          <div *ngIf="incomingRequests().length > 0" class="mb-8">
            <h3 class="text-gray-300 font-semibold mb-4">Incoming Requests</h3>
            <div class="space-y-3">
              <div
                *ngFor="let request of incomingRequests()"
                class="card p-4 flex items-center justify-between"
              >
                <div class="flex items-center gap-4">
                  <div class="text-4xl">{{ request.avatar }}</div>
                  <div>
                    <p class="font-semibold text-slate-100">
                      {{ request.username }}
                    </p>
                    <p class="text-sm text-slate-500">
                      Requested {{ request.timestamp }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    (click)="acceptRequest(request.id)"
                    class="btn-primary btn-small"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    (click)="declineRequest(request.id)"
                    class="btn-secondary btn-small"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Outgoing Requests -->
          <div *ngIf="outgoingRequests().length > 0" class="mb-8">
            <h3 class="text-gray-300 font-semibold mb-4">Sent Requests</h3>
            <div class="space-y-3">
              <div
                *ngFor="let request of outgoingRequests()"
                class="card p-4 flex items-center justify-between"
              >
                <div class="flex items-center gap-4">
                  <div class="text-4xl">{{ request.avatar }}</div>
                  <div>
                    <p class="font-semibold text-slate-100">
                      {{ request.username }}
                    </p>
                    <p class="text-sm text-slate-500">
                      Sent {{ request.timestamp }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    (click)="cancelRequest(request.id)"
                    class="btn-secondary btn-small"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Friends List Section -->
        <div>
          <h2 class="text-2xl font-bold text-slate-100 mb-6">
            Friends ({{ friends.length }})
          </h2>

          <div *ngIf="friends.length === 0" class="card p-8 text-center">
            <div class="text-4xl mb-3">👥</div>
            <p class="text-gray-400">You haven't added any friends yet</p>
            <button
              (click)="showAddFriendModal.set(true)"
              class="btn-primary mt-4"
            >
              Find Friends
            </button>
          </div>

          <div
            *ngIf="friends.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div
              *ngFor="let friend of friends"
              class="card p-6 card-hover flex items-center justify-between"
            >
              <div class="flex items-center gap-4 flex-grow">
                <div class="relative">
                  <div class="text-5xl">{{ friend.avatar }}</div>
                  <div
                    class="absolute bottom-0 right-0 w-4 h-4 rounded-full"
                    [ngClass]="getStatusColor(friend.status)"
                  ></div>
                </div>
                <div class="flex-grow">
                  <p class="font-semibold text-slate-100">
                    {{ friend.username }}
                  </p>
                  <p class="text-sm text-slate-500">
                    {{ getStatusText(friend.status, friend.lastSeen) }}
                  </p>
                </div>
              </div>
              <button
                (click)="removeFriend(friend.id)"
                class="btn-secondary btn-small ml-2"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Friend Modal -->
      <div
        *ngIf="showAddFriendModal()"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div class="card p-8 max-w-md w-full">
          <h3 class="text-xl font-bold text-slate-100 mb-6">Add Friend</h3>

          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Search Username
              </label>
              <input
                type="text"
                [(ngModel)]="searchUsername"
                placeholder="Enter username..."
                class="input-field"
              />
            </div>

            <div class="max-h-64 overflow-y-auto space-y-2">
              <div
                *ngFor="let user of searchResults()"
                class="p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <span class="text-2xl">👤</span>
                  <span class="text-slate-100">{{ user }}</span>
                </div>
                <button
                  (click)="sendFriendRequest(user)"
                  class="text-primary hover:text-secondary"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h6m-6 4h10m-10 4h10m-10 4h6M17 1.5v6m3-3h-6"
                    />
                  </svg>
                </button>
              </div>

              <div
                *ngIf="searchResults().length === 0 && searchUsername"
                class="text-center py-6 text-slate-500"
              >
                No users found
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              (click)="showAddFriendModal.set(false)"
              class="btn-secondary flex-1"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FriendsListComponent {
  showAddFriendModal = signal(false);
  searchUsername = signal("");

  friends: Friend[] = [
    {
      id: "1",
      username: "alex_dev",
      avatar: "👨‍💻",
      status: "online",
      lastSeen: "now",
      addedDate: "2024-01-15",
    },
    {
      id: "2",
      username: "creative_mind",
      avatar: "🎨",
      status: "online",
      lastSeen: "now",
      addedDate: "2024-01-20",
    },
    {
      id: "3",
      username: "data_scientist",
      avatar: "📊",
      status: "away",
      lastSeen: "2 hours ago",
      addedDate: "2024-01-10",
    },
  ];

  friendRequests: FriendRequest[] = [
    {
      id: "1",
      username: "tech_lover",
      avatar: "🤖",
      timestamp: "1 hour ago",
      type: "incoming",
    },
    {
      id: "2",
      username: "design_pro",
      avatar: "✏️",
      timestamp: "2 days ago",
      type: "outgoing",
    },
  ];

  incomingRequests() {
    return this.friendRequests.filter((r) => r.type === "incoming");
  }

  outgoingRequests() {
    return this.friendRequests.filter((r) => r.type === "outgoing");
  }

  searchResults() {
    if (!this.searchUsername()) return [];
    const query = this.searchUsername().toLowerCase();
    return ["john_smith", "maria_garcia", "david_chen"].filter((u) =>
      u.includes(query),
    );
  }

  acceptRequest(id: string): void {
    const request = this.friendRequests.find((r) => r.id === id);
    if (request) {
      this.friends.push({
        id: `f-${id}`,
        username: request.username,
        avatar: request.avatar,
        status: "offline",
        lastSeen: "just now",
        addedDate: new Date().toISOString().split("T")[0],
      });
      this.friendRequests = this.friendRequests.filter((r) => r.id !== id);
    }
  }

  declineRequest(id: string): void {
    this.friendRequests = this.friendRequests.filter((r) => r.id !== id);
  }

  cancelRequest(id: string): void {
    this.friendRequests = this.friendRequests.filter((r) => r.id !== id);
  }

  removeFriend(id: string): void {
    this.friends = this.friends.filter((f) => f.id !== id);
  }

  sendFriendRequest(username: string): void {
    const request: FriendRequest = {
      id: `req-${Date.now()}`,
      username,
      avatar: "👤",
      timestamp: "just now",
      type: "outgoing",
    };
    this.friendRequests.push(request);
    this.searchUsername.set("");
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "online":
        return "bg-success";
      case "away":
        return "bg-warning";
      case "offline":
        return "bg-slate-600";
      default:
        return "bg-slate-600";
    }
  }

  getStatusText(status: string, lastSeen: string): string {
    if (status === "online") return "Online";
    if (status === "away") return "Away";
    return `Last seen ${lastSeen}`;
  }
}
