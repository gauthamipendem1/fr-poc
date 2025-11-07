import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCallbackInterface } from '../base-callback.interface';

@Component({
  selector: 'app-metadata-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Metadata callbacks are typically invisible - they pass data between steps -->
    <div class="hidden">
      <!-- This callback handles metadata and typically doesn't render anything visible -->
    </div>
  `
})
export class MetadataCallbackComponent implements BaseCallbackInterface, OnInit {
  @Input() callback!: any;
  @Input() onSubmit?: (value: any) => void;
  @Input() disabled = false;

  ngOnInit(): void {
    // Metadata callbacks often auto-process their data
    this.processMetadata();
  }

  private processMetadata(): void {
    // Extract and process any metadata
    const data = this.callback.getOutputByName('data', {});
    
    // Metadata callbacks typically don't require user interaction
    // They may set hidden values or trigger automatic processing
    if (data && this.onSubmit) {
      this.onSubmit(data);
    }
  }
}