import { round, formatDate, formatDateShort, formatTemperature, formatPercentage, formatSpeed } from '../index';

describe('Utils', () => {
  describe('round', () => {
    it('should round to 1 decimal by default', () => {
      expect(round(3.14159)).toBe(3.1);
      expect(round(2.999)).toBe(3);
    });

    it('should round to specified decimals', () => {
      expect(round(3.14159, 2)).toBe(3.14);
      expect(round(3.14159, 3)).toBe(3.142);
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const dateStr = '2025-01-15T14:30:00';
      const formatted = formatDate(dateStr);
      expect(formatted).toContain('15/01/2025');
    });
  });

  describe('formatDateShort', () => {
    it('should format date to short format', () => {
      const dateStr = '2025-01-15T14:30:00';
      const formatted = formatDateShort(dateStr);
      expect(formatted).toBe('15/01/2025 14:30');
    });
  });

  describe('formatTemperature', () => {
    it('should format temperature with °C', () => {
      expect(formatTemperature(25.5)).toBe('25.5°C');
      expect(formatTemperature(0)).toBe('0°C');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      expect(formatPercentage(50)).toBe('50%');
      expect(formatPercentage(50.7)).toBe('51%');
    });

    it('should return "-" for null or undefined', () => {
      expect(formatPercentage(null)).toBe('-');
      expect(formatPercentage(undefined)).toBe('-');
    });
  });

  describe('formatSpeed', () => {
    it('should format speed correctly', () => {
      expect(formatSpeed(25.5)).toBe('26 km/h');
      expect(formatSpeed(0)).toBe('0 km/h');
    });

    it('should return "-" for null or undefined', () => {
      expect(formatSpeed(null)).toBe('-');
      expect(formatSpeed(undefined)).toBe('-');
    });
  });
});

