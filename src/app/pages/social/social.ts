import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

@Component({
  selector: 'app-social-media-sim',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="section-title">Social Media Simulator</h1>
          <p class="text-slate-400">
            Explore AI-generated social interactions powered by local LLMs
          </p>
        </div>

        <!-- Create Post -->
        <div class="card p-6 mb-8">
          <div class="flex gap-4 mb-4">
            <div class="text-3xl flex-shrink-0">👤</div>
            <div class="flex-grow">
              <textarea
                [(ngModel)]="newPostContent"
                placeholder="What's on your mind?"
                rows="3"
                class="input-field w-full mb-4"
              ></textarea>
              <div class="flex gap-3 justify-end">
                <button class="btn-secondary">
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
                      d="M15.172 7.172a4 4 0 11-5.656 0m0 0l3.5-3.5"
                    />
                  </svg>
                </button>
                <button class="btn-secondary">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button
                  (click)="createPost()"
                  class="btn-primary"
                  [disabled]="!newPostContent().trim()"
                  [class.opacity-50]="!newPostContent().trim()"
                >
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.16-1.41l-7-14z" />
                  </svg>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Feed -->
        <div class="space-y-4">
          <div
            *ngFor="let post of posts"
            class="card p-6 card-hover"
          >
            <!-- Post Header -->
            <div class="flex items-start gap-4 mb-4">
              <div class="text-3xl flex-shrink-0">{{ post.avatar }}</div>
              <div class="flex-grow min-w-0">
                <p class="font-bold text-slate-100">{{ post.author }}</p>
                <p class="text-sm text-slate-500">{{ post.timestamp }}</p>
              </div>
              <button class="text-slate-400 hover:text-slate-100 transition-colors">
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>

            <!-- Post Content -->
            <p class="text-slate-100 mb-4 leading-relaxed">{{ post.content }}</p>

            <!-- Post Stats -->
            <div class="flex gap-4 text-sm text-slate-400 mb-4 py-3 border-t border-b border-slate-800">
              <span>{{ post.likes }} likes</span>
              <span>{{ post.comments }} comments</span>
            </div>

            <!-- Post Actions -->
            <div class="flex gap-2 justify-around">
              <button
                (click)="toggleLike(post.id)"
                [class.text-primary]="post.isLiked"
                class="flex-1 flex items-center justify-center gap-2 text-slate-400 hover:text-primary hover:bg-primary/5 py-2 rounded transition-colors duration-250"
              >
                <svg
                  class="w-5 h-5"
                  [attr.fill]="post.isLiked ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Like
              </button>
              <button
                class="flex-1 flex items-center justify-center gap-2 text-slate-400 hover:text-secondary hover:bg-secondary/5 py-2 rounded transition-colors duration-250"
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Comment
              </button>
              <button
                class="flex-1 flex items-center justify-center gap-2 text-slate-400 hover:text-success hover:bg-success/5 py-2 rounded transition-colors duration-250"
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
                    d="M8.684 13.342C9.589 12.938 10.49 12.5 11.391 12c-.757.689-1.684 1.235-2.707 1.585m0 0a50.991 50.991 0 017.232-12.28m0 0a50.991 50.991 0 015.591 6.347C21.075 8.236 21.5 9.088 21.5 10m0 0H11.5m11.5 0v8.5"
                  />
                </svg>
                Share
              </button>
            </div>
          </div>

          <!-- Load More -->
          <button
            (click)="loadMorePosts()"
            class="w-full btn-secondary py-3"
          >
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SocialMediaSimComponent {
  newPostContent = signal('');

  posts: Post[] = [
    {
      id: '1',
      author: 'TechVision',
      avatar: '🤖',
      content:
        'Just discovered this amazing local LLM platform! The ability to run models locally while maintaining full privacy is a game-changer for developers. #LocalAI #Privacy',
      timestamp: '2 hours ago',
      likes: 342,
      comments: 45,
      isLiked: false,
    },
    {
      id: '2',
      author: 'CodeMaster',
      avatar: '👨‍💻',
      content:
        'Finally built a complete app using local LLMs. No more API rate limits, no latency issues, and everything runs offline. This is the future of AI development.',
      timestamp: '4 hours ago',
      likes: 587,
      comments: 123,
      isLiked: false,
    },
    {
      id: '3',
      author: 'AIEnthusiast',
      avatar: '🧠',
      content:
        'The credit system on local.llm is so transparent. Unlike other platforms, I know exactly where my credits are going. Love the detailed breakdown!',
      timestamp: '6 hours ago',
      likes: 201,
      comments: 34,
      isLiked: false,
    },
    {
      id: '4',
      author: 'DevCommunity',
      avatar: '👥',
      content:
        'Building collaborative AI projects has never been easier. The friends feature makes it simple to share models, collaborate, and scale together. #Collaboration #OpenSource',
      timestamp: '8 hours ago',
      likes: 456,
      comments: 89,
      isLiked: false,
    },
    {
      id: '5',
      author: 'PrivacyFirst',
      avatar: '🔒',
      content:
        'Security audit complete! All data stays on your machine. No cloud dependency, no surveillance, just pure computational power at your fingertips.',
      timestamp: '10 hours ago',
      likes: 678,
      comments: 156,
      isLiked: false,
    },
  ];

  createPost(): void {
    if (!this.newPostContent().trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: 'You',
      avatar: '👤',
      content: this.newPostContent(),
      timestamp: 'just now',
      likes: 0,
      comments: 0,
      isLiked: false,
    };

    this.posts.unshift(newPost);
    this.newPostContent.set('');
  }

  toggleLike(postId: string): void {
    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
    }
  }

  loadMorePosts(): void {
    const morePosts: Post[] = [
      {
        id: `post-${Date.now()}`,
        author: 'CreativeDesigner',
        avatar: '🎨',
        content:
          'Using the APIs to create something incredible with local LLMs. The possibilities are endless!',
        timestamp: '12 hours ago',
        likes: 234,
        comments: 45,
        isLiked: false,
      },
      {
        id: `post-${Date.now() + 1}`,
        author: 'DataScientist',
        avatar: '📊',
        content:
          'The performance metrics speak for themselves. Local processing beats cloud every time.',
        timestamp: '14 hours ago',
        likes: 567,
        comments: 120,
        isLiked: false,
      },
    ];

    this.posts.push(...morePosts);
  }
}
