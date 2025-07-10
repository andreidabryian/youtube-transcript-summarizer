import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoInfoCardComponent } from '../../shared/components/video-info-card.component';
import { VideoSummary } from '../../shared/types/video-summary.interface';
import { formatDate } from '../../shared/utils/formatting.utils';

/**
 * Component for displaying video summary
 * Shows summary points, full summary and actions
 */
@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule, VideoInfoCardComponent],
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryCardComponent {
  public summary = input.required<VideoSummary>();
  public copySummary = output<void>();
  public reset = output<void>();

  public readonly formatDate = formatDate;

  public onCopySummary(): void {
    this.copySummary.emit();
  }

  public onReset(): void {
    this.reset.emit();
  }
} 