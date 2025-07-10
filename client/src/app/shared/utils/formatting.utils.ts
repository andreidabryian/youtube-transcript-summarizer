/**
 * Formatting utilities for displaying data
 */

/**
 * Formats duration string to human-readable format
 * @param duration - Duration in format "HH:MM:SS" or "MM:SS"
 * @returns Formatted duration string
 */
export function formatDuration(duration: string): string {
  if (!duration) return 'Неизвестно';
  
  const parts = duration.split(':').map(Number);
  
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    if (hours > 0) {
      return `${hours}ч ${minutes}м ${seconds}с`;
    }
    return `${minutes}м ${seconds}с`;
  } else if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return `${minutes}м ${seconds}с`;
  }
  
  return duration;
}

/**
 * Formats number with appropriate suffix (K, M, B)
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  if (!num || num === 0) return '0';
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toString();
}

/**
 * Formats date string to localized format
 * @param dateString - Date string in ISO format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'Неизвестно';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Неизвестно';
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Неизвестно';
  }
}

/**
 * Formats date and time string
 * @param dateString - Date string in ISO format
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return 'Неизвестно';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Неизвестно';
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Неизвестно';
  }
}

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength)}...`;
} 