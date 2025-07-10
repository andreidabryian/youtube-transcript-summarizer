/**
 * Summary request parameters
 * Parameters for requesting video summary
 */
export interface SummaryRequest {
  /** YouTube video URL */
  videoUrl: string;
  /** Maximum number of summary points */
  maxPoints: number;
} 