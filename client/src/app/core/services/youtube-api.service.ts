import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { VideoInfo } from '../../shared/types/video-info.interface';
import { VideoSummary } from '../../shared/types/video-summary.interface';
import { SummaryRequest } from '../../shared/types/summary-request.interface';
import { 
  API_BASE_URL, 
  API_ENDPOINTS, 
  RETRY_CONFIG 
} from '../../shared/constants/api.constants';

/**
 * Service for interacting with YouTube API
 * Handles video information retrieval and summary generation
 */
@Injectable({
  providedIn: 'root'
})
export class YouTubeApiService {
  private readonly baseUrl = API_BASE_URL;
  private readonly http = inject(HttpClient);

  /**
   * Gets video information from YouTube
   * @param videoUrl - YouTube video URL
   * @returns Observable with video information
   */
  public getVideoInfo(videoUrl: string): Observable<VideoInfo> {
    const url = `${this.baseUrl}${API_ENDPOINTS.VIDEO_INFO}`;
    const params = { videoUrl: videoUrl.trim() };

    return this.http.get<VideoInfo>(url, { params }).pipe(
      this.handleRetry(),
      this.handleError('getVideoInfo')
    ) as Observable<VideoInfo>;
  }

  /**
   * Checks if video has available transcript
   * @param videoUrl - YouTube video URL
   * @returns Observable with boolean indicating transcript availability
   */
  public checkTranscript(videoUrl: string): Observable<boolean> {
    const url = `${this.baseUrl}${API_ENDPOINTS.CHECK_TRANSCRIPT}`;
    const params = { videoUrl: videoUrl.trim() };

    return this.http.get<boolean>(url, { params }).pipe(
      this.handleRetry(),
      this.handleError('checkTranscript')
    ) as Observable<boolean>;
  }

  /**
   * Generates summary for a YouTube video
   * @param request - Summary request parameters
   * @returns Observable with video summary
   */
  public generateSummary(request: SummaryRequest): Observable<VideoSummary> {
    const url = `${this.baseUrl}${API_ENDPOINTS.SUMMARY}`;
    const body = {
      videoUrl: request.videoUrl.trim(),
      maxPoints: request.maxPoints
    };

    return this.http.post<VideoSummary>(url, body).pipe(
      this.handleRetry(),
      this.handleError('generateSummary')
    ) as Observable<VideoSummary>;
  }

  /**
   * Performs health check on the API
   * @returns Observable with health status
   */
  public healthCheck(): Observable<{ status: string }> {
    const url = `${this.baseUrl}${API_ENDPOINTS.HEALTH}`;

    return this.http.get<{ status: string }>(url).pipe(
      this.handleRetry(),
      this.handleError('healthCheck')
    ) as Observable<{ status: string }>;
  }

  /**
   * Handles retry logic for failed requests
   * @returns RxJS operator for retry logic
   */
  private handleRetry() {
    return retry({
      count: RETRY_CONFIG.MAX_RETRIES,
      delay: (_error, retryCount) => {
        const delayTime = Math.min(
          RETRY_CONFIG.RETRY_DELAY * Math.pow(RETRY_CONFIG.BACKOFF_MULTIPLIER, retryCount),
          10000
        );
        console.warn(`Request failed, retrying... (attempt ${retryCount + 1})`);
        return timer(delayTime);
      }
    });
  }

  /**
   * Handles HTTP errors and provides meaningful error messages
   * @param operation - Name of the operation that failed
   * @returns RxJS operator for error handling
   */
  private handleError(operation: string) {
    return catchError((error: HttpErrorResponse) => {
      let errorMessage: string;

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Ошибка клиента: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error || 'Неверный запрос. Проверьте URL видео.';
            break;
          case 404:
            errorMessage = 'Видео не найдено или недоступно.';
            break;
          case 500:
            errorMessage = 'Ошибка сервера. Попробуйте позже.';
            break;
          default:
            errorMessage = `Ошибка ${error.status}: ${error.message}`;
        }
      }

      console.error(`${operation} failed:`, error);
      return throwError(() => new Error(errorMessage));
    });
  }
} 