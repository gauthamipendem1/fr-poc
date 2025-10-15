import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initializeForgeRockSDK } from './auth/fr-sdk.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.css'
})
export class App implements OnInit {
  ngOnInit(): void {
    // Initialize ForgeRock SDK on app startup
    initializeForgeRockSDK();
  }
}
