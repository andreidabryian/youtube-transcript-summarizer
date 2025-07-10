import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingCardComponent } from './loading-card.component';
import { VideoInfo } from '../../shared/types/video-info.interface';

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

@Component({
  template: `
    <app-loading-card [videoInfo]="videoInfo"></app-loading-card>
  `,
  standalone: true,
  imports: [LoadingCardComponent]
})
class TestHostComponent {
  videoInfo = mockVideoInfo;
}

describe('LoadingCardComponent', () => {
  let component: LoadingCardComponent;
  let fixture: ComponentFixture<LoadingCardComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    
    fixture = TestBed.createComponent(LoadingCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner', () => {
    const spinnerElement = hostFixture.nativeElement.querySelector('.spinner');
    expect(spinnerElement).toBeTruthy();
  });

  it('should display video info', () => {
    const videoInfoCard = hostFixture.nativeElement.querySelector('[data-testid="video-info-card"]');
    const titleElement = videoInfoCard.querySelector('.video-title');
    expect(titleElement.textContent).toContain('Test Video');
  });
}); 