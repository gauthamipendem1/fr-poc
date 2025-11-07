import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

interface IdPProvider {
  provider: string;
  uiConfig?: {
    buttonText?: string;
    buttonClass?: string;
    buttonCustomStyle?: string;
    buttonCustomStyleHover?: string;
    buttonDisplayName?: string;
    buttonImage?: string;
    iconBackground?: string;
    iconClass?: string;
    iconFontColor?: string;
  };
}

@Component({
  selector: 'app-select-idp-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <div class="mb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ getPrompt() }}
        </h3>
      </div>
      
      <div class="space-y-3">
        <button
          *ngFor="let provider of getProviders(); trackBy: trackByFn"
          type="button"
          (click)="selectProvider(provider)"
          [disabled]="disabled"
          class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          [style]="getProviderStyle(provider)"
        >
          <img 
            *ngIf="provider.uiConfig?.buttonImage" 
            [src]="provider.uiConfig?.buttonImage || ''" 
            [alt]="getProviderDisplayName(provider)"
            class="w-5 h-5 mr-3"
          />
          <i 
            *ngIf="provider.uiConfig?.iconClass && !provider.uiConfig?.buttonImage"
            [class]="provider.uiConfig?.iconClass || ''"
            [style.background]="provider.uiConfig?.iconBackground || ''"
            [style.color]="provider.uiConfig?.iconFontColor || ''"
            class="mr-3"
          ></i>
          {{ getProviderDisplayName(provider) }}
        </button>
      </div>
    </div>
  `
})
export class SelectIdPCallbackComponent implements BaseCallbackInterface {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  getPrompt(): string {
    return this.callback.getOutputByName('prompt', 'Select an identity provider:');
  }

  getProviders(): IdPProvider[] {
    const providers = this.callback.getOutputByName('providers', []);
    return Array.isArray(providers) ? providers : [];
  }

  getProviderDisplayName(provider: IdPProvider): string {
    return provider.uiConfig?.buttonDisplayName || 
           provider.uiConfig?.buttonText || 
           provider.provider;
  }

  getProviderStyle(provider: IdPProvider): any {
    const styles: any = {};
    
    if (provider.uiConfig?.buttonCustomStyle) {
      Object.assign(styles, this.parseCustomStyle(provider.uiConfig.buttonCustomStyle));
    }
    
    if (provider.uiConfig?.buttonClass) {
      // Handle CSS classes - this would need to be handled via ngClass in the template
      // for now, we'll just apply basic styling
    }
    
    return styles;
  }

  parseCustomStyle(styleString: string): any {
    const styles: any = {};
    if (styleString) {
      const declarations = styleString.split(';');
      declarations.forEach(declaration => {
        const [property, value] = declaration.split(':').map(s => s.trim());
        if (property && value) {
          // Convert CSS property names to camelCase for Angular style binding
          const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          styles[camelProperty] = value;
        }
      });
    }
    return styles;
  }

  selectProvider(provider: IdPProvider): void {
    this.callback.setInputValue(provider.provider);
    if (this.onSubmit) {
      this.onSubmit(provider.provider);
    }
  }

  trackByFn(index: number, provider: IdPProvider): string {
    return provider.provider;
  }
}