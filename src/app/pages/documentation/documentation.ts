import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BrandingService, BrandConfig } from '../../services/branding.service';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentation.html',
  styleUrls: ['./documentation.css']
})
export class DocumentationComponent implements OnInit, OnDestroy {
  currentBrand!: BrandConfig;
  private subscription = new Subscription();
  activeSection = 'overview';

  constructor(private brandingService: BrandingService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.brandingService.currentBrand$.subscribe(brand => {
        this.currentBrand = brand;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}