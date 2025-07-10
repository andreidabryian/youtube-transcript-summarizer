import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { YouTubeApiService } from '../../core/services/youtube-api.service';
import { VideoInfo } from '../../shared/types/video-info.interface';
import { VideoSummary } from '../../shared/types/video-summary.interface';
import { SummaryRequest } from '../../shared/types/summary-request.interface';
import { FormValidationState } from '../../shared/types/form-validation-state.interface';
import {
  validateSummaryForm,
  sanitizeYouTubeUrl
} from '../../shared/utils/validation.utils';
import {
  formatDuration,
  formatNumber,
  formatDate
} from '../../shared/utils/formatting.utils';
import { VideoUrlInputComponent } from '../video-url-input/video-url-input.component';
import { MaxPointsSelectComponent } from '../max-points-select/max-points-select.component';
import { ErrorCardComponent } from '../error-card/error-card.component';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { SummaryCardComponent } from '../summary-card/summary-card.component';

/**
 * Component for handling video summary form
 * Manages form state, validation, and API interactions
 */
@Component({
  selector: 'app-summary-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VideoUrlInputComponent,
    MaxPointsSelectComponent,
    ErrorCardComponent,
    LoadingCardComponent,
    SummaryCardComponent
  ],
  templateUrl: './summary-form.component.html',
  styleUrls: ['./summary-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryFormComponent {
  private readonly youtubeService = inject(YouTubeApiService);

  private readonly _formData = signal<SummaryRequest>({
    videoUrl: '',
    maxPoints: 5
  });

  public readonly isLoading = signal(false);
  public readonly videoInfo = signal<VideoInfo | null>(null);
  public readonly summary = signal<VideoSummary | null>(null);
  public readonly error = signal<string | null>(null);
  public readonly validationState = signal<FormValidationState>({
    isValid: false,
    errors: {},
    touched: false
  });

  public readonly hasResults = computed(() =>
    this.videoInfo() !== null || this.summary() !== null || this.error() !== null
  );

  public readonly isFormValid = computed(() => this.validationState().isValid);

  public get formData(): SummaryRequest {
    return this._formData();
  }

  public set formData(value: SummaryRequest) {
    this._formData.set(value);
  }

  public get videoUrl(): string {
    return this._formData().videoUrl;
  }

  public set videoUrl(value: string) {
    this._formData.update(data => ({ ...data, videoUrl: value }));
  }

  public get maxPoints(): number {
    return this._formData().maxPoints;
  }

  public set maxPoints(value: number) {
    this._formData.update(data => ({ ...data, maxPoints: value }));
  }

  /**
   * Handles form submission
   */
  public async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      return;
    }

    this.setLoading(true);
    this.clearError();

    try {
      const sanitizedUrl = sanitizeYouTubeUrl(this.videoUrl);

      // First, get video info
      const info = await firstValueFrom(this.youtubeService.getVideoInfo(sanitizedUrl));
      this.setVideoInfo(info);

      // Check if transcript is available
      const hasTranscript = await firstValueFrom(this.youtubeService.checkTranscript(sanitizedUrl));

      if (!hasTranscript) {
        throw new Error('Транскрипция недоступна для данного видео. Убедитесь, что у видео есть субтитры.');
      }

      // Generate summary
      const summaryData = await firstValueFrom(this.youtubeService.generateSummary({
        videoUrl: sanitizedUrl,
        maxPoints: this.maxPoints
      }));

      this.setSummary(summaryData);
    } catch (err) {
      this.setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Validates form on field blur
   * @param fieldName - Name of the field that was blurred
   */
  public onFieldBlur(): void {
    this.validateForm();
  }

  /**
   * Validates the entire form
   */
  private validateForm(): void {
    const validation = validateSummaryForm({
      videoUrl: this.videoUrl,
      maxPoints: this.maxPoints
    });
    this.validationState.set({
      isValid: validation.isValid,
      errors: validation.errors,
      touched: true
    });
  }

  /**
   * Checks if a field has validation error
   * @param fieldName - Name of the field to check
   * @returns True if field has error
   */
  public hasFieldError(fieldName: string): boolean {
    return this.validationState().touched &&
      this.validationState().errors[fieldName] !== undefined;
  }

  /**
   * Gets error message for a field
   * @param fieldName - Name of the field
   * @returns Error message or empty string
   */
  public getFieldError(fieldName: string): string {
    return this.validationState().errors[fieldName] || '';
  }

  /**
   * Copies summary to clipboard
   */
  public copySummary(): void {
    if (!this.summary()) return;

    const summaryText = this.formatSummaryForCopy();

    navigator.clipboard.writeText(summaryText).then(() => {
      // Could add a toast notification here
      console.log('Summary copied to clipboard');
    }).catch(_err => {
      console.error('Failed to copy summary');
    });
  }

  /**
   * Resets the form to initial state
   */
  public resetForm(): void {
    this._formData.set({ videoUrl: '', maxPoints: 5 });
    this.setVideoInfo(null);
    this.setSummary(null);
    this.setError(null);
    this.validationState.set({
      isValid: false,
      errors: {},
      touched: false
    });
  }

  /**
   * Clears the current error
   */
  public clearError(): void {
    this.setError(null);
  }

  // Private setters for state management
  private setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  private setVideoInfo(info: VideoInfo | null): void {
    this.videoInfo.set(info);
  }

  private setSummary(summary: VideoSummary | null): void {
    this.summary.set(summary);
  }

  private setError(error: string | null): void {
    this.error.set(error);
  }

  /**
   * Formats summary for clipboard copying
   * @returns Formatted summary text
   */
  private formatSummaryForCopy(): string {
    if (!this.summary()) return '';

    const summary = this.summary()!;
    const video = summary.videoInfo;

    return `Саммари видео: ${video.title}
Автор: ${video.author}
Длительность: ${formatDuration(video.duration)}
Просмотры: ${formatNumber(video.viewCount)}

Ключевые пункты:
${summary.summaryPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

Полное саммари:
${summary.fullSummary}

Создано: ${formatDate(summary.generatedAt)}`;
  }

  // Utility methods for template
  public readonly formatDuration = formatDuration;
  public readonly formatNumber = formatNumber;
  public readonly formatDate = formatDate;
} 