import { formatBlogDate, getReadingTime, truncateText } from '@/lib/blog';

describe('Blog Utilities', () => {
  describe('formatBlogDate', () => {
    it('should format date in English', () => {
      const date = '2026-01-27T10:00:00Z';
      const formatted = formatBlogDate(date, 'en');
      expect(formatted).toContain('January');
      expect(formatted).toContain('27');
      expect(formatted).toContain('2026');
    });

    it('should format date in French', () => {
      const date = '2026-01-27T10:00:00Z';
      const formatted = formatBlogDate(date, 'fr');
      expect(formatted).toContain('janvier');
      expect(formatted).toContain('27');
      expect(formatted).toContain('2026');
    });

    it('should handle different date formats', () => {
      const date = '2026-06-15T12:00:00Z';
      const formatted = formatBlogDate(date, 'en');
      expect(formatted).toContain('June');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2026');
    });
  });

  describe('getReadingTime', () => {
    it('should calculate reading time for short content', () => {
      const content = 'This is a short article with about twenty words in total for testing purposes here.';
      const time = getReadingTime(content, 200);
      expect(time).toBe(1); // Should round up to 1 minute
    });

    it('should calculate reading time for long content', () => {
      const words = Array(400).fill('word').join(' ');
      const time = getReadingTime(words, 200);
      expect(time).toBe(2); // 400 words / 200 wpm = 2 minutes
    });

    it('should strip HTML tags before counting', () => {
      const content = '<p>This is <strong>HTML</strong> content with <a href="#">links</a> and tags.</p>';
      const time = getReadingTime(content, 200);
      expect(time).toBe(1); // Only counts actual words, not HTML
    });

    it('should handle empty content', () => {
      const content = '';
      const time = getReadingTime(content, 200);
      expect(time).toBe(1); // Math.ceil(0) returns 1 for empty content
    });

    it('should use custom words per minute', () => {
      const words = Array(300).fill('word').join(' ');
      const time = getReadingTime(words, 100);
      expect(time).toBe(3); // 300 words / 100 wpm = 3 minutes
    });
  });

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      const text = 'Short text';
      const truncated = truncateText(text, 50);
      expect(truncated).toBe('Short text');
    });

    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated to a specific length';
      const truncated = truncateText(text, 30);
      expect(truncated).toBe('This is a very long text that...');
      expect(truncated.length).toBeLessThanOrEqual(33); // 30 + '...'
    });

    it('should use default max length of 150', () => {
      const text = 'a'.repeat(200);
      const truncated = truncateText(text);
      expect(truncated).toBe('a'.repeat(150) + '...');
    });

    it('should trim whitespace before adding ellipsis', () => {
      const text = 'This is a text with spaces at the end     ';
      const truncated = truncateText(text, 20);
      expect(truncated).toBe('This is a text with...');
      expect(truncated).not.toContain('  ...'); // No double spaces
    });

    it('should handle exact length match', () => {
      const text = 'Exactly thirty characters here';
      const truncated = truncateText(text, 30);
      expect(truncated).toBe('Exactly thirty characters here');
    });

    it('should handle empty string', () => {
      const text = '';
      const truncated = truncateText(text, 50);
      expect(truncated).toBe('');
    });
  });
});

