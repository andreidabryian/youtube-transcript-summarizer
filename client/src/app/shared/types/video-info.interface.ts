/**
 * Video information interface
 * Represents metadata about a YouTube video
 */
export interface VideoInfo {
  /** YouTube video ID */
  id: string;
  /** Video title */
  title: string;
  /** Channel/author name */
  author: string;
  /** Video duration in format "HH:MM:SS" */
  duration: string;
  /** Video description */
  description: string;
  /** Thumbnail URL */
  thumbnailUrl: string;
  /** Upload date in ISO format */
  uploadDate: string;
  /** View count */
  viewCount: number;
} 