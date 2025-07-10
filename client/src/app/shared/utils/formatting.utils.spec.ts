import { formatDuration, formatNumber, formatDate, formatDateTime, truncateText } from './formatting.utils';

describe('formatting.utils', () => {
  describe('formatDuration', () => {
    it('should format duration with hours', () => {
      expect(formatDuration('01:30:45')).toBe('1ч 30м 45с');
    });

    it('should format duration without hours', () => {
      expect(formatDuration('30:45')).toBe('30м 45с');
    });

    it('should handle empty duration', () => {
      expect(formatDuration('')).toBe('Неизвестно');
    });

    it('should handle invalid duration', () => {
      expect(formatDuration('invalid')).toBe('invalid');
    });
  });

  describe('formatNumber', () => {
    it('should format thousands', () => {
      expect(formatNumber(1500)).toBe('1.5K');
    });

    it('should format millions', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
    });

    it('should format billions', () => {
      expect(formatNumber(1500000000)).toBe('1.5B');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(500)).toBe('500');
    });
  });

  describe('formatDate', () => {
    it('should format valid date', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      expect(result).toMatch(/\d{1,2} (\w+|\S+) \d{4} г\.?/);
    });

    it('should handle empty date', () => {
      expect(formatDate('')).toBe('Неизвестно');
    });

    it('should handle invalid date', () => {
      expect(formatDate('invalid-date')).toBe('Неизвестно');
    });
  });

  describe('formatDateTime', () => {
    it('should format valid date and time', () => {
      const result = formatDateTime('2024-01-15T10:30:00Z');
      expect(result).toMatch(/\d{1,2} (\w+|\S+) \d{4} г\.? (в|в\u202F) \d{2}:\d{2}/);
    });

    it('should handle empty date', () => {
      expect(formatDateTime('')).toBe('Неизвестно');
    });

    it('should handle invalid date', () => {
      expect(formatDateTime('invalid-date')).toBe('Неизвестно');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('This is a very long text that needs to be truncated', 20)).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
    });

    it('should handle empty text', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });
}); 