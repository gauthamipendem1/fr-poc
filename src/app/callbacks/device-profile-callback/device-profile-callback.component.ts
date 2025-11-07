import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-device-profile-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4" *ngIf="shouldShowMessage()">
      <div class="p-4 bg-blue-50 border-l-4 border-blue-400">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              Device Information
            </h3>
            <div class="mt-2 text-sm text-blue-700">
              Collecting device information for security purposes...
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DeviceProfileCallbackComponent implements BaseCallbackInterface, OnInit {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  ngOnInit(): void {
    this.collectDeviceProfile();
  }

  shouldShowMessage(): boolean {
    return this.callback.getOutputByName('message', false);
  }

  private collectDeviceProfile(): void {
    try {
      const profile = this.generateDeviceProfile();
      this.callback.setInputValue(JSON.stringify(profile));
      
      if (this.onSubmit) {
        this.onSubmit(profile);
      }
    } catch (error) {
      console.error('Error collecting device profile:', error);
      if (this.onSubmit) {
        this.onSubmit({});
      }
    }
  }

  private generateDeviceProfile(): any {
    const profile: any = {};

    try {
      // Basic device information
      profile.userAgent = navigator.userAgent;
      profile.platform = navigator.platform;
      profile.language = navigator.language;
      profile.languages = navigator.languages;
      profile.cookieEnabled = navigator.cookieEnabled;
      profile.onLine = navigator.onLine;
      
      // Screen information
      profile.screen = {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight
      };

      // Timezone
      profile.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      profile.timezoneOffset = new Date().getTimezoneOffset();

      // Browser features
      profile.features = {
        webgl: this.supportsWebGL(),
        canvas: this.supportsCanvas(),
        localStorage: this.supportsLocalStorage(),
        sessionStorage: this.supportsSessionStorage(),
        indexedDB: this.supportsIndexedDB(),
        webRTC: this.supportsWebRTC()
      };

      // Hardware concurrency (number of logical processor cores)
      if ('hardwareConcurrency' in navigator) {
        profile.hardwareConcurrency = (navigator as any).hardwareConcurrency;
      }

      // Device memory (if available)
      if ('deviceMemory' in navigator) {
        profile.deviceMemory = (navigator as any).deviceMemory;
      }

      // Connection information (if available)
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        profile.connection = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        };
      }

    } catch (error) {
      console.warn('Error generating device profile:', error);
    }

    return profile;
  }

  private supportsWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  private supportsCanvas(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch {
      return false;
    }
  }

  private supportsLocalStorage(): boolean {
    try {
      return typeof localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  private supportsSessionStorage(): boolean {
    try {
      return typeof sessionStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  private supportsIndexedDB(): boolean {
    try {
      return 'indexedDB' in window;
    } catch {
      return false;
    }
  }

  private supportsWebRTC(): boolean {
    try {
      return !!(window as any).RTCPeerConnection || !!(window as any).webkitRTCPeerConnection || !!(window as any).mozRTCPeerConnection;
    } catch {
      return false;
    }
  }
}