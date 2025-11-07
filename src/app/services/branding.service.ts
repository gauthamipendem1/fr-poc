import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface BrandConfig {
  name: string;
  cssFile: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
    fontFamily: string;
  };
  logo?: string;
  title: string;
  layout: 'standard' | 'compact' | 'modern' | 'minimal' | 'enterprise' | 'mobile';
  spacing: {
    container: string;
    input: string;
    button: string;
    margin: string;
  };
  typography: {
    scale: 'small' | 'medium' | 'large';
    weight: 'light' | 'normal' | 'bold';
  };
}

@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  private currentBrandSubject = new BehaviorSubject<BrandConfig>(this.getDefaultBrand());
  public currentBrand$ = this.currentBrandSubject.asObservable();

  private brandConfigs: { [key: string]: BrandConfig } = {
    'a': {
      name: 'Brand A',
      cssFile: 'a.css',
      theme: {
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        backgroundColor: '#f8fafc',
        textColor: '#1e293b',
        borderRadius: '0.5rem',
        fontFamily: 'Inter, sans-serif'
      },
      title: 'Brand A Authentication',
      layout: 'enterprise',
      spacing: {
        container: '2rem',
        input: '1rem',
        button: '1rem 2rem',
        margin: '1.5rem'
      },
      typography: {
        scale: 'medium',
        weight: 'normal'
      }
    },
    'b': {
      name: 'Brand B',
      cssFile: 'b.css',
      theme: {
        primaryColor: '#dc2626',
        secondaryColor: '#ef4444',
        backgroundColor: '#fef2f2',
        textColor: '#7f1d1d',
        borderRadius: '1rem',
        fontFamily: 'Roboto, sans-serif'
      },
      title: 'Brand B Portal',
      layout: 'modern',
      spacing: {
        container: '2.5rem',
        input: '1.25rem',
        button: '1.25rem 2.5rem',
        margin: '2rem'
      },
      typography: {
        scale: 'large',
        weight: 'bold'
      }
    },
    'c': {
      name: 'Brand C',
      cssFile: 'c.css',
      theme: {
        primaryColor: '#059669',
        secondaryColor: '#10b981',
        backgroundColor: '#f0fdf4',
        textColor: '#064e3b',
        borderRadius: '0.25rem',
        fontFamily: 'Poppins, sans-serif'
      },
      title: 'Brand C Solutions',
      layout: 'compact',
      spacing: {
        container: '1rem',
        input: '0.625rem',
        button: '0.625rem 1.25rem',
        margin: '0.75rem'
      },
      typography: {
        scale: 'small',
        weight: 'normal'
      }
    },
    'minimal': {
      name: 'Minimal',
      cssFile: 'minimal.css',
      theme: {
        primaryColor: '#000000',
        secondaryColor: '#666666',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderRadius: '0',
        fontFamily: 'system-ui, sans-serif'
      },
      title: 'Minimal Design',
      layout: 'minimal',
      spacing: {
        container: '1rem',
        input: '0.5rem',
        button: '0.5rem 1rem',
        margin: '1rem'
      },
      typography: {
        scale: 'small',
        weight: 'light'
      }
    },
    'mobile': {
      name: 'Mobile',
      cssFile: 'mobile.css',
      theme: {
        primaryColor: '#10b981',
        secondaryColor: '#34d399',
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        borderRadius: '0.75rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
      },
      title: 'Mobile App',
      layout: 'mobile',
      spacing: {
        container: '1rem',
        input: '1rem',
        button: '1rem',
        margin: '1rem'
      },
      typography: {
        scale: 'medium',
        weight: 'normal'
      }
    }
  };

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.detectAndApplyBrand(event.url);
      });
    
    // Initial brand detection
    this.detectAndApplyBrand(this.router.url);
  }

  private detectAndApplyBrand(url: string): void {
    // Extract brand from URL path (e.g., /a/login -> brand 'a')
    const pathSegments = url.split('/').filter(segment => segment.length > 0);
    const brandKey = pathSegments[0] || 'default';
    
    const brand = this.brandConfigs[brandKey] || this.getDefaultBrand();
    this.currentBrandSubject.next(brand);
    this.loadBrandCSS(brand.cssFile);
  }

  private loadBrandCSS(cssFile: string): void {
    // Remove existing brand CSS link if present
    const existingLink = document.getElementById('brand-css');
    if (existingLink) {
      existingLink.remove();
    }

    // Load external brand CSS file
    const link = document.createElement('link');
    link.id = 'brand-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `/assets/styles/brands/${cssFile}`;
    
    // Apply custom properties as fallback and for dynamic values
    this.applyBrandStyles();
    
    // Append the CSS link to head
    document.head.appendChild(link);
  }

  private applyBrandStyles(): void {
    const brand = this.getCurrentBrand();
    const body = document.body;
    
    // Apply CSS custom properties to the body
    Object.entries(this.getThemeStyles()).forEach(([property, value]) => {
      body.style.setProperty(property, value);
    });
    
    // Add brand-specific CSS classes
    body.className = body.className.replace(/brand-\w+/g, '').replace(/layout-\w+/g, '');
    body.classList.add(`brand-${brand.name.toLowerCase().replace(/\s+/g, '-')}`);
    body.classList.add(`layout-${brand.layout}`);
  }

  private getDefaultBrand(): BrandConfig {
    return {
      name: 'Default',
      cssFile: 'default.css',
      theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderRadius: '0.375rem',
        fontFamily: 'system-ui, sans-serif'
      },
      title: 'ForgeRock Authentication',
      layout: 'standard',
      spacing: {
        container: '1.5rem',
        input: '0.75rem',
        button: '0.75rem 1.5rem',
        margin: '1rem'
      },
      typography: {
        scale: 'medium',
        weight: 'normal'
      }
    };
  }

  getCurrentBrand(): BrandConfig {
    return this.currentBrandSubject.value;
  }

  getBrandConfig(brandKey: string): BrandConfig | undefined {
    return this.brandConfigs[brandKey];
  }

  // Method to get brand-specific CSS classes
  getBrandClasses(): string {
    const brand = this.getCurrentBrand();
    return `brand-${brand.name.toLowerCase().replace(/\s+/g, '-')} layout-${brand.layout}`;
  }

  // Method to get inline styles for dynamic theming
  getThemeStyles(): { [key: string]: string } {
    const brand = this.getCurrentBrand();
    const theme = brand.theme;
    const spacing = brand.spacing;
    const typography = brand.typography;
    
    return {
      '--brand-primary': theme.primaryColor,
      '--brand-secondary': theme.secondaryColor,
      '--brand-bg': theme.backgroundColor,
      '--brand-text': theme.textColor,
      '--brand-radius': theme.borderRadius,
      '--brand-font': theme.fontFamily,
      '--brand-container-padding': spacing.container,
      '--brand-input-padding': spacing.input,
      '--brand-button-padding': spacing.button,
      '--brand-margin': spacing.margin,
      '--brand-font-scale': typography.scale === 'small' ? '0.875' : typography.scale === 'large' ? '1.125' : '1',
      '--brand-font-weight': typography.weight === 'light' ? '300' : typography.weight === 'bold' ? '700' : '400'
    };
  }
}