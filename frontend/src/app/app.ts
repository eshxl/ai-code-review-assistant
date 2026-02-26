import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Added RouterLinkActive for bolding active tabs
  template: `
    <div class="min-h-screen bg-editor-bg text-gray-200 font-sans selection:bg-accent-primary/30">
      
      <nav class="bg-[#0d1117]/80 backdrop-blur-md border-b border-editor-border px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        
        <div class="flex items-center gap-3 cursor-pointer group" routerLink="/dashboard">
          <div class="w-8 h-8 bg-gradient-to-br from-accent-primary to-purple-600 rounded flex items-center justify-center shadow-[0_0_10px_rgba(47,129,247,0.4)] text-white font-bold group-hover:shadow-[0_0_15px_rgba(47,129,247,0.6)] transition-all">
            AI
          </div>
          <h1 class="font-mono text-lg font-bold text-gray-100 tracking-tight">CodeReview<span class="text-accent-primary">.io</span></h1>
        </div>
        
        <div class="flex gap-6 items-center text-sm font-semibold tracking-wide">
          <a routerLink="/dashboard" 
             routerLinkActive="text-white border-b-2 border-accent-primary pb-1" 
             [routerLinkActiveOptions]="{exact: true}" 
             class="text-editor-muted hover:text-gray-100 transition-colors pt-1">
             Dashboard
          </a>
          
          <a routerLink="/login" 
             class="px-4 py-2 rounded-lg border border-editor-border text-editor-muted hover:text-white hover:bg-status-critical/20 hover:border-status-critical/50 hover:shadow-[0_0_10px_rgba(248,81,73,0.2)] transition-all">
             Logout
          </a>
        </div>
      </nav>

      <main class="p-6 max-w-7xl mx-auto w-full">
        <router-outlet></router-outlet>
      </main>
      
    </div>
  `
})
export class App {}