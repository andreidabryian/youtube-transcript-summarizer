import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Component for video URL input field
 * Handles URL input with validation and error display
 */
@Component({
  selector: 'app-video-url-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-url-input.component.html',
  styleUrls: ['./video-url-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoUrlInputComponent {
  public videoUrl = input.required<string>();
  public hasError = input.required<boolean>();
  public errorMessage = input.required<string>();

  public videoUrlChange = output<string>();
  public blur = output<void>();

  public onVideoUrlChange(value: string): void {
    this.videoUrlChange.emit(value);
  }

  public onBlur(): void {
    this.blur.emit();
  }
} 