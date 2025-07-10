import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoInfo } from '../shared/types/video-info.interface';
import { VideoSummary } from '../shared/types/video-summary.interface';
import { SummaryRequest } from '../shared/types/summary-request.interface';

@Injectable({
  providedIn: 'root'
})
export class YouTubeService {
  private readonly apiUrl = 'https://localhost:7001/api/youtube';
  private readonly http = inject(HttpClient);

  public getVideoInfo(videoUrl: string): Observable<VideoInfo> {
    const params = { videoUrl };
    return this.http.get<VideoInfo>(`${this.apiUrl}/info`, { params });
  }

  public getSummary(videoUrl: string, maxPoints: number = 5): Observable<VideoSummary> {
    const params = {
      videoUrl,
      maxPoints: maxPoints.toString()
    };
    return this.http.get<VideoSummary>(`${this.apiUrl}/summary`, { params });
  }

  public createSummary(request: SummaryRequest): Observable<VideoSummary> {
    console.log('YouTubeService: Отправляем POST запрос на', `${this.apiUrl}/summary`);
    console.log('YouTubeService: Данные запроса:', request);
    return this.http.post<VideoSummary>(`${this.apiUrl}/summary`, request);
  }

  public checkTranscript(videoUrl: string): Observable<boolean> {
    const params = { videoUrl };
    return this.http.get<boolean>(`${this.apiUrl}/check-transcript`, { params });
  }
} 