/**
 * API constants and configuration
 */

/**
 * Base API URL
 */
export const API_BASE_URL = 'http://localhost:7001';

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  /** Get video information */
  VIDEO_INFO: '/api/youtube/info',
  /** Check if video has transcript */
  CHECK_TRANSCRIPT: '/api/youtube/check-transcript',
  /** Generate video summary */
  SUMMARY: '/api/youtube/summary',
  /** Health check endpoint */
  HEALTH: '/health'
} as const;

/**
 * HTTP headers
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  APPLICATION_JSON: 'application/json',
  ACCEPT: 'Accept'
} as const;

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000;

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  BACKOFF_MULTIPLIER: 2
} as const; 