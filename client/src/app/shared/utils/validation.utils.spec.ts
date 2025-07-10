import { isValidYouTubeUrl, validateSummaryForm, sanitizeYouTubeUrl } from './validation.utils';

describe('Validation Utils', () => {
  describe('isValidYouTubeUrl', () => {
    it('should return true for valid YouTube URLs', () => {
      const validUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'https://www.youtube.com/v/dQw4w9WgXcQ',
        'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtube.com/watch?v=dQw4w9WgXcQ'
      ];

      validUrls.forEach(url => {
        expect(isValidYouTubeUrl(url)).toBe(true);
      });
    });

    it('should return false for invalid URLs', () => {
      const invalidUrls = [
        '',
        'not-a-url',
        'https://www.google.com',
        'https://www.youtube.com',
        'https://www.youtube.com/watch',
        'https://www.youtube.com/watch?',
        null as any,
        undefined as any
      ];

      invalidUrls.forEach(url => {
        expect(isValidYouTubeUrl(url)).toBe(false);
      });
    });

    it('should handle URLs with whitespace', () => {
      expect(isValidYouTubeUrl('  https://www.youtube.com/watch?v=dQw4w9WgXcQ  ')).toBe(true);
    });
  });

  describe('validateSummaryForm', () => {
    it('should return valid for correct form data', () => {
      const formData = {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        maxPoints: 5
      };

      const result = validateSummaryForm(formData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return invalid for missing video URL', () => {
      const formData = {
        videoUrl: '',
        maxPoints: 5
      };

      const result = validateSummaryForm(formData);

      expect(result.isValid).toBe(false);
      expect(result.errors['videoUrl']).toBe('URL видео обязателен');
    });

    it('should return invalid for invalid video URL', () => {
      const formData = {
        videoUrl: 'https://www.google.com',
        maxPoints: 5
      };

      const result = validateSummaryForm(formData);

      expect(result.isValid).toBe(false);
      expect(result.errors['videoUrl']).toBe('Пожалуйста, введите корректный URL YouTube видео');
    });

    it('should return invalid for invalid maxPoints', () => {
      const formData = {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        maxPoints: 0
      };

      const result = validateSummaryForm(formData);

      expect(result.isValid).toBe(false);
      expect(result.errors['maxPoints']).toBe('Количество пунктов должно быть от 1 до 20');
    });

    it('should return invalid for maxPoints > 20', () => {
      const formData = {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        maxPoints: 25
      };

      const result = validateSummaryForm(formData);

      expect(result.isValid).toBe(false);
      expect(result.errors['maxPoints']).toBe('Количество пунктов должно быть от 1 до 20');
    });

    it('should handle multiple validation errors', () => {
      const formData = {
        videoUrl: 'invalid-url',
        maxPoints: 0
      };

      const result = validateSummaryForm(formData);

      expect(result.isValid).toBe(false);
      expect(result.errors['videoUrl']).toBe('Пожалуйста, введите корректный URL YouTube видео');
      expect(result.errors['maxPoints']).toBe('Количество пунктов должно быть от 1 до 20');
    });
  });

  describe('sanitizeYouTubeUrl', () => {
    it('should trim whitespace', () => {
      expect(sanitizeYouTubeUrl('  https://www.youtube.com/watch?v=dQw4w9WgXcQ  '))
        .toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    it('should remove extra parameters', () => {
      expect(sanitizeYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s&feature=share'))
        .toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    it('should handle empty string', () => {
      expect(sanitizeYouTubeUrl('')).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(sanitizeYouTubeUrl(null as any)).toBe('');
      expect(sanitizeYouTubeUrl(undefined as any)).toBe('');
    });

    it('should preserve URL without extra parameters', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(sanitizeYouTubeUrl(url)).toBe(url);
    });
  });
}); 