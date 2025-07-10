import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryCardComponent } from './summary-card.component';
import { VideoSummary } from '../../shared/types/video-summary.interface';
import { VideoInfo } from '../../shared/types/video-info.interface';

const mockVideoInfo: VideoInfo = {
  id: 'test-id',
  title: 'Test Video',
  author: 'Test Author',
  duration: '10:30',
  description: 'Test description',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  uploadDate: '2024-01-01T00:00:00Z',
  viewCount: 1000
};

const mockSummary: VideoSummary = {
  videoInfo: mockVideoInfo,
  summaryPoints: ['Point 1', 'Point 2'],
  fullSummary: 'Test summary content',
  generatedAt: '2024-01-01T00:00:00Z'
};

@Component({
  template: `
    <app-summary-card [summary]="summary"></app-summary-card>
  `,
  standalone: true,
  imports: [SummaryCardComponent]
})
class TestHostComponent {
  summary: VideoSummary = mockSummary;
}

describe('SummaryCardComponent', () => {
  let component: SummaryCardComponent;
  let fixture: ComponentFixture<SummaryCardComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    
    fixture = TestBed.createComponent(SummaryCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display summary content', () => {
    hostComponent.summary = mockSummary;
    hostFixture.detectChanges();
    
    const videoInfoCard = hostFixture.nativeElement.querySelector('[data-testid="video-info-card"]');
    const summarySection = hostFixture.nativeElement.querySelector('[data-testid="summary-section"]');
    const summaryPoints = hostFixture.nativeElement.querySelector('[data-testid="summary-points"]');
    const fullSummary = hostFixture.nativeElement.querySelector('[data-testid="full-summary"]');
    
    expect(videoInfoCard).toBeTruthy();
    expect(summarySection).toBeTruthy();
    expect(summaryPoints).toBeTruthy();
    expect(fullSummary).toBeTruthy();
    expect(fullSummary.textContent).toContain('Test summary content');
  });
}); 