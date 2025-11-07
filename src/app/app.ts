import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initializeForgeRockSDK } from './auth/fr-sdk.config';
import { BrandingService } from './services/branding.service';
import { FloatingDocsButtonComponent } from './components/floating-docs-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FloatingDocsButtonComponent],
  template: `
    <div [class]="brandingService.getBrandClasses()" [ngStyle]="brandingService.getThemeStyles()">
      <router-outlet></router-outlet>
      <app-floating-docs-button></app-floating-docs-button>
    </div>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(public brandingService: BrandingService) {}

  ngOnInit(): void {
    // Initialize ForgeRock SDK on app startup
    initializeForgeRockSDK();
  }
}
