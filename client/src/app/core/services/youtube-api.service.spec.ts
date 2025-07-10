import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { YouTubeApiService } from './youtube-api.service';
import { VideoInfo } from '../../shared/types/video-info.interface';
import { VideoSummary } from '../../shared/types/video-summary.interface';
import { SummaryRequest } from '../../shared/types/summary-request.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../shared/constants/api.constants';

describe('YouTubeApiService', () => {
  let service: YouTubeApiService;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [YouTubeApiService]
    });

    service = TestBed.inject(YouTubeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getVideoInfo', () => {
    it('should return video info for valid URL', () => {
      const testUrl = 'https://www.youtube.com/watch?v=test-id';

      service.getVideoInfo(testUrl).subscribe(info => {
        expect(info).toEqual(mockVideoInfo);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}${API_ENDPOINTS.VIDEO_INFO}?videoUrl=${testUrl.trim()}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockVideoInfo);
    });

    it('should handle HTTP errors', () => {
      const testUrl = 'https://www.youtube.com/watch?v=invalid-id';

      service.getVideoInfo(testUrl).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('Ошибка');
        }
      });

      const req = httpMock.expectOne(`${API_BASE_URL}${API_ENDPOINTS.VIDEO_INFO}?videoUrl=${testUrl.trim()}`);
      req.flush('Error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('checkTranscript', () => {
    it('should return true when transcript is available', () => {
      const testUrl = 'https://www.youtube.com/watch?v=test-id';

      service.checkTranscript(testUrl).subscribe(hasTranscript => {
        expect(hasTranscript).toBe(true);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}${API_ENDPOINTS.CHECK_TRANSCRIPT}?videoUrl=${testUrl.trim()}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should return false when transcript is not available', () => {
      const testUrl = 'https://www.youtube.com/watch?v=no-transcript';

      service.checkTranscript(testUrl).subscribe(hasTranscript => {
        expect(hasTranscript).toBe(false);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}${API_ENDPOINTS.CHECK_TRANSCRIPT}?videoUrl=${testUrl.trim()}`);
      req.flush(false);
    });
  });

  describe('generateSummary', () => {
    it('should generate summary for valid request', () => {
      const request: SummaryRequest = {
        videoUrl: 'https://www.youtube.com/watch?v=test-id',
        maxPoints: 5
      };

      service.generateSummary(request).subscribe(summary => {
        expect(summary).toEqual(mockVideoSummary);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}${API_ENDPOINTS.SUMMARY}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        videoUrl: request.videoUrl.trim(),
        maxPoints: request.maxPoints
      });
      req.flush(mockVideoSummary);
    });
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const mockHealthStatus = { status: 'Healthy' };

      service.healthCheck().subscribe(status => {
        expect(status).toEqual(mockHealthStatus);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}${API_ENDPOINTS.HEALTH}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHealthStatus);
    });
  });
}); 