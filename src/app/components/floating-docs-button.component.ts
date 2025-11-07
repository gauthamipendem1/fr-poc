import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-floating-docs-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50">
      <a 
        routerLink="/documentation" 
        class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        title="View Documentation"
      >
        <span class="text-lg">📚</span>
        <span class="hidden sm:inline font-medium">Docs</span>
      </a>
    </div>
  `,
  styles: [`
    :host {
      pointer-events: none;
    }
    
    a {
      pointer-events: auto;
    }
    
    @media (max-width: 640px) {
      .fixed {
        bottom: 1rem;
        right: 1rem;
      }
    }
  `]
})
export class FloatingDocsButtonComponent {}