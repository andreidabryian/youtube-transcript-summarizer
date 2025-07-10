import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoInfoCardComponent } from '../../shared/components/video-info-card.component';
import { VideoInfo } from '../../shared/types/video-info.interface';

/**
 * Component for displaying loading state
 * Shows video info and loading spinner
 */
@Component({
  selector: 'app-loading-card',
  standalone: true,
  imports: [CommonModule, VideoInfoCardComponent],
  templateUrl: './loading-card.component.html',
  styleUrls: ['./loading-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingCardComponent {
  public videoInfo = input.required<VideoInfo>();
} 