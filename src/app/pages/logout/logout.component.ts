import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenManager, FRUser } from '@forgerock/javascript-sdk';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 text-center">
        <div>
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 class="text-xl font-medium text-gray-900 mb-2">Signing out...</h2>
          <p class="text-sm text-gray-600">Please wait while we securely sign you out.</p>
        </div>
      </div>
    </div>
  `
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    try {
      // Perform logout
      await FRUser.logout();
      TokenManager.deleteTokens();
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout by clearing tokens
      TokenManager.deleteTokens();
    } finally {
      // Redirect to login after a brief delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    }
  }
}