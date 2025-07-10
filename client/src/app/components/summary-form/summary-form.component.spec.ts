import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { SummaryFormComponent } from './summary-form.component';
import { VideoUrlInputComponent } from '../video-url-input/video-url-input.component';
import { MaxPointsSelectComponent } from '../max-points-select/max-points-select.component';
import { ErrorCardComponent } from '../error-card/error-card.component';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { SummaryCardComponent } from '../summary-card/summary-card.component';
import { VideoInfoCardComponent } from '../../shared/components/video-info-card.component';
import { YouTubeApiService } from '../../core/services/youtube-api.service';
import { VideoInfo } from '../../shared/types/video-info.interface';
import { VideoSummary } from '../../shared/types/video-summary.interface';

describe('SummaryFormComponent', () => {
  let component: SummaryFormComponent;
  let fixture: ComponentFixture<SummaryFormComponent>;
  let youtubeService: jasmine.SpyObj<YouTubeApiService>;

  const mockVideoInfo: VideoInfo = {
    id: 'test-id',
    title: 'Test Video',
    author: 'Test Author',
    duration: '00:10:30',
    description: 'Test description',
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    uploadDate: '2024-01-01T00:00:00Z',
    viewCount: 1000
  };

  const mockVideoSummary: VideoSummary = {
    videoInfo: mockVideoInfo,
    summaryPoints: ['Point 1', 'Point 2', 'Point 3'],
    fullSummary: 'This is a test summary',
    generatedAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('YouTubeApiService', [
      'getVideoInfo',
      'checkTranscript',
      'generateSummary'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        SummaryFormComponent,
        VideoUrlInputComponent,
        MaxPointsSelectComponent,
        ErrorCardComponent,
        LoadingCardComponent,
        SummaryCardComponent,
        VideoInfoCardComponent,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: YouTubeApiService, useValue: spy }
      ]
    }).compileComponents();

    youtubeService = TestBed.inject(YouTubeApiService) as jasmine.SpyObj<YouTubeApiService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.videoInfo()).toBeNull();
    expect(component.summary()).toBeNull();
    expect(component.formData.videoUrl).toBe('');
    expect(component.formData.maxPoints).toBe(5);
  });

  it('should validate form on field blur', () => {
    component.videoUrl = 'invalid-url';
    component.maxPoints = 0;
    component.onFieldBlur();

    expect(component.hasFieldError('videoUrl')).toBe(true);
    expect(component.hasFieldError('maxPoints')).toBe(true);
    expect(component.getFieldError('videoUrl')).toContain('корректный URL');
    expect(component.getFieldError('maxPoints')).toContain('от 1 до 20');
  });

  it('should copy summary to clipboard', () => {
    component.summary.set(mockVideoSummary);
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

    component.copySummary();

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('should reset form', () => {
    component.videoInfo.set(mockVideoInfo);
    component.summary.set(mockVideoSummary);
    component.error.set('Some error');
    component.videoUrl = 'https://www.youtube.com/watch?v=test-id';
    component.maxPoints = 10;

    component.resetForm();

    expect(component.videoInfo()).toBeNull();
    expect(component.summary()).toBeNull();
    expect(component.error()).toBeNull();
    expect(component.formData.videoUrl).toBe('');
    expect(component.formData.maxPoints).toBe(5);
  });

  it('should not submit when form is invalid', async () => {
    component.videoUrl = 'invalid-url';
    component.onFieldBlur();

    await component.onSubmit();

    expect(youtubeService.getVideoInfo).not.toHaveBeenCalled();
  });

  it('should have results when video info is set', () => {
    component.videoInfo.set(mockVideoInfo);
    expect(component.hasResults()).toBe(true);
  });

  it('should have results when summary is set', () => {
    component.summary.set(mockVideoSummary);
    expect(component.hasResults()).toBe(true);
  });

  it('should have results when error is set', () => {
    component.error.set('Some error');
    expect(component.hasResults()).toBe(true);
  });

  it('should not have results when nothing is set', () => {
    expect(component.hasResults()).toBe(false);
  });

  it('should have form valid computed property', () => {
    expect(component.isFormValid()).toBe(false);
  });

  it('should have format utility methods', () => {
    expect(component.formatDuration).toBeDefined();
    expect(component.formatNumber).toBeDefined();
    expect(component.formatDate).toBeDefined();
  });
}); 