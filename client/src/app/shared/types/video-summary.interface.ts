import { VideoInfo } from './video-info.interface';

/**
 * Video summary interface
 * Represents the generated summary of a video
 */
export interface VideoSummary {
  /** Video information */
  videoInfo: VideoInfo;
  /** Array of key summary points */
  summaryPoints: string[];
  /** Full summary text */
  fullSummary: string;
  /** Generation timestamp */
  generatedAt: string;
} 