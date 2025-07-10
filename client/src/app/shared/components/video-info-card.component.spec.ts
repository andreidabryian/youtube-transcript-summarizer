import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoInfoCardComponent } from './video-info-card.component';
import { VideoInfo } from '../types/video-info.interface';

const mockVideoInfo: VideoInfo = {
  id: 'test-id',
  title: 'Test Video Title',
  author: 'Test Author',
  duration: '00:10:30',
  description: 'Test description',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  uploadDate: '2024-01-01T00:00:00Z',
  viewCount: 1000
};

@Component({
  template: `
    <app-video-info-card [videoInfo]="videoInfo"></app-video-info-card>
  `,
  standalone: true,
  imports: [VideoInfoCardComponent]
})
class TestHostComponent {
  videoInfo: VideoInfo = mockVideoInfo;
}

describe('VideoInfoCardComponent', () => {
  let component: VideoInfoCardComponent;
  let fixture: ComponentFixture<VideoInfoCardComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    
    fixture = TestBed.createComponent(VideoInfoCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display video title', () => {
    hostComponent.videoInfo = mockVideoInfo;
    hostFixture.detectChanges();
    const titleElement = hostFixture.nativeElement.querySelector('.video-title');
    expect(titleElement.textContent).toContain('Test Video Title');
  });
}); 