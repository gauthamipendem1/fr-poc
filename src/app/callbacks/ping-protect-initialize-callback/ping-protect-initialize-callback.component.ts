import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

declare global {
  interface Window {
    PingOneProtect?: any;
  }
}

@Component({
  selector: 'app-ping-protect-initialize-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <div class="p-4 bg-blue-50 border-l-4 border-blue-400">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400 animate-spin" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              Initializing Security Protection
            </h3>
            <div class="mt-2 text-sm text-blue-700">
              Setting up PingOne Protect for enhanced security...
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="error" class="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
        <div class="text-sm text-red-700">
          {{ error }}
        </div>
      </div>
    </div>
  `
})
export class PingProtectInitializeCallbackComponent implements BaseCallbackInterface, OnInit {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  error: string = '';
  private initializationTimeout: any;

  ngOnInit(): void {
    this.initializePingProtect();
  }

  ngOnDestroy(): void {
    if (this.initializationTimeout) {
      clearTimeout(this.initializationTimeout);
    }
  }

  private async initializePingProtect(): Promise<void> {
    try {
      const config = this.getConfiguration();
      
      if (!config.envId || !config.consoleLogEnabled !== undefined) {
        throw new Error('Missing required PingOne Protect configuration');
      }

      // Set a timeout for initialization
      this.initializationTimeout = setTimeout(() => {
        this.error = 'PingOne Protect initialization timed out';
        this.handleInitializationComplete(false);
      }, 10000); // 10 second timeout

      await this.loadPingProtectScript();
      await this.initializeProtectSDK(config);
      
      clearTimeout(this.initializationTimeout);
      this.handleInitializationComplete(true);
    } catch (error) {
      clearTimeout(this.initializationTimeout);
      this.error = error instanceof Error ? error.message : 'Failed to initialize PingOne Protect';
      this.handleInitializationComplete(false);
    }
  }

  private getConfiguration(): any {
    return {
      envId: this.callback.getOutputByName('envId', ''),
      consoleLogEnabled: this.callback.getOutputByName('consoleLogEnabled', false),
      lazyMetadata: this.callback.getOutputByName('lazyMetadata', false),
      behavioralDataCollection: this.callback.getOutputByName('behavioralDataCollection', true),
      deviceAttributesToIgnore: this.callback.getOutputByName('deviceAttributesToIgnore', []),
      customHost: this.callback.getOutputByName('customHost', ''),
      
      // Additional configuration options
      disableTags: this.callback.getOutputByName('disableTags', []),
      enableTrust: this.callback.getOutputByName('enableTrust', true),
      disableCookies: this.callback.getOutputByName('disableCookies', false)
    };
  }

  private loadPingProtectScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if SDK is already loaded
      if (window.PingOneProtect) {
        resolve();
        return;
      }

      const config = this.getConfiguration();
      const host = config.customHost || 'https://cdn.pingidentity.com/signal/latest';
      const script = document.createElement('script');
      
      script.src = `${host}/signal-sdk.min.js`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load PingOne Protect SDK'));
      
      document.head.appendChild(script);
    });
  }

  private async initializeProtectSDK(config: any): Promise<void> {
    if (!window.PingOneProtect) {
      throw new Error('PingOne Protect SDK not available');
    }

    try {
      await window.PingOneProtect.init({
        envId: config.envId,
        consoleLogEnabled: config.consoleLogEnabled,
        lazyMetadata: config.lazyMetadata,
        behavioralDataCollection: config.behavioralDataCollection,
        deviceAttributesToIgnore: config.deviceAttributesToIgnore,
        disableTags: config.disableTags,
        enableTrust: config.enableTrust,
        disableCookies: config.disableCookies
      });

      // Start data collection if enabled
      if (config.behavioralDataCollection) {
        window.PingOneProtect.start();
      }
    } catch (error) {
      throw new Error(`PingOne Protect initialization failed: ${error}`);
    }
  }

  private handleInitializationComplete(success: boolean): void {
    const result = {
      initialized: success,
      timestamp: Date.now(),
      error: success ? null : this.error
    };

    this.callback.setInputValue(JSON.stringify(result));
    
    if (this.onSubmit) {
      this.onSubmit(result);
    }
  }
}