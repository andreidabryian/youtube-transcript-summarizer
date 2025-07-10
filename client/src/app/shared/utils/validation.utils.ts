/**
 * Validation utilities for form validation
 */

/**
 * YouTube URL patterns for validation
 */
const YOUTUBE_URL_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
  /^https?:\/\/youtu\.be\/[\w-]+/,
  /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
  /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/
];

/**
 * Validates if a string is a valid YouTube URL
 * @param url - The URL to validate
 * @returns True if the URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  const trimmedUrl = url.trim();
  return YOUTUBE_URL_PATTERNS.some(pattern => pattern.test(trimmedUrl));
}

/**
 * Validates form fields and returns validation state
 * @param formData - The form data to validate
 * @returns Validation state object
 */
export function validateSummaryForm(formData: {
  videoUrl: string;
  maxPoints: number;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  // Validate video URL
  if (!formData.videoUrl || !formData.videoUrl.trim()) {
    errors['videoUrl'] = 'URL видео обязателен';
  } else if (!isValidYouTubeUrl(formData.videoUrl)) {
    errors['videoUrl'] = 'Пожалуйста, введите корректный URL YouTube видео';
  }
  
  // Validate max points
  if (!formData.maxPoints || formData.maxPoints < 1 || formData.maxPoints > 20) {
    errors['maxPoints'] = 'Количество пунктов должно быть от 1 до 20';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Sanitizes YouTube URL by trimming whitespace and ensuring proper format
 * @param url - The URL to sanitize
 * @returns Sanitized URL
 */
export function sanitizeYouTubeUrl(url: string): string {
  if (!url) return '';
  
  let sanitized = url.trim();
  
  // Remove any extra parameters that might cause issues
  if (sanitized.includes('&')) {
    sanitized = sanitized.split('&')[0];
  }
  
  return sanitized;
} 