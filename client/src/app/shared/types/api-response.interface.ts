/**
 * API response wrapper
 * Generic wrapper for API responses
 */
export interface ApiResponse<T> {
  /** Response data */
  data?: T;
  /** Error message if any */
  error?: string;
  /** Success status */
  success: boolean;
} 