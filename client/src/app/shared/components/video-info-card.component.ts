import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoInfo } from '../types/video-info.interface';
import { 
  formatDuration, 
  formatNumber, 
  formatDate 
} from '../utils/formatting.utils';

/**
 * Reusable component for displaying video information
 * Shows video thumbnail, title, author, duration, views, and upload date
 */
@Component({
  selector: 'app-video-info-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-info-card.component.html',
  styleUrls: ['./video-info-card.component.css']
})
export class VideoInfoCardComponent {
  public videoInfo = input.required<VideoInfo>();
  public showDescription = input(false);
  public maxDescriptionLength = input(200);

  // Utility methods for template
  public readonly formatDuration = formatDuration;
  public readonly formatNumber = formatNumber;
  public readonly formatDate = formatDate;

  /**
   * Truncates video description to specified length
   * @param description - Full description text
   * @returns Truncated description
   */
  public truncateDescription(description: string): string {
    if (!description || description.length <= this.maxDescriptionLength()) {
      return description;
    }
    
    return description.substring(0, this.maxDescriptionLength()) + '...';
  }
} 