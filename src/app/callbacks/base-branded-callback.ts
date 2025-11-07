import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BrandingService, BrandConfig } from '../services/branding.service';

@Injectable()
export class BaseBrandedCallback implements OnDestroy {
  protected currentBrand: BrandConfig;
  private brandSubscription: Subscription;

  constructor(protected brandingService: BrandingService) {
    this.currentBrand = this.brandingService.getCurrentBrand();
    this.brandSubscription = this.brandingService.currentBrand$.subscribe(
      brand => this.currentBrand = brand
    );
  }

  ngOnDestroy(): void {
    if (this.brandSubscription) {
      this.brandSubscription.unsubscribe();
    }
  }

  // Helper methods for components to get brand-specific styling
  getBrandClasses(): string {
    return this.brandingService.getBrandClasses();
  }

  getThemeStyles(): { [key: string]: string } {
    return this.brandingService.getThemeStyles();
  }

  getInputClasses(): string {
    const baseClasses = 'form-input';
    const brandClasses = this.getBrandClasses();
    return `${baseClasses} ${brandClasses}`;
  }

  getButtonClasses(): string {
    const baseClasses = 'btn-primary';
    const brandClasses = this.getBrandClasses();
    return `${baseClasses} ${brandClasses}`;
  }

  getLabelClasses(): string {
    const baseClasses = 'form-label';
    const brandClasses = this.getBrandClasses();
    return `${baseClasses} ${brandClasses}`;
  }

  getContainerClasses(): string {
    const baseClasses = 'callback-container';
    const brandClasses = this.getBrandClasses();
    return `${baseClasses} ${brandClasses}`;
  }

  getChoiceOptionClasses(): string {
    const baseClasses = 'choice-option';
    const brandClasses = this.getBrandClasses();
    return `${baseClasses} ${brandClasses}`;
  }

  getErrorClasses(): string {
    const baseClasses = 'error-message';
    const brandClasses = this.getBrandClasses();
    return `${baseClasses} ${brandClasses}`;
  }

  // Layout-specific helper methods
  isCompactLayout(): boolean {
    return this.currentBrand.layout === 'compact';
  }

  isModernLayout(): boolean {
    return this.currentBrand.layout === 'modern';
  }

  isStandardLayout(): boolean {
    return this.currentBrand.layout === 'standard';
  }
}