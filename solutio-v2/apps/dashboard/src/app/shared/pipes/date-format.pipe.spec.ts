import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "-" for null value', () => {
    expect(pipe.transform(null)).toBe('-');
  });

  it('should return "-" for undefined value', () => {
    expect(pipe.transform(undefined)).toBe('-');
  });

  it('should return value for invalid date', () => {
    expect(pipe.transform('invalid-date')).toBe('invalid-date');
  });

  it('should format date in short format by default', () => {
    const date = new Date('2025-08-28T10:30:00');
    const result = pipe.transform(date.toISOString());
    expect(result).toContain('28/08/2025');
    expect(result).toContain('10:30');
  });

  it('should format date in short format', () => {
    const date = new Date('2025-08-28T10:30:00');
    const result = pipe.transform(date.toISOString(), 'short');
    expect(result).toBe('28/08/2025 10:30');
  });

  it('should format date in long format', () => {
    const date = new Date('2025-08-28T10:30:00');
    const result = pipe.transform(date.toISOString(), 'long');
    expect(result).toContain('28');
    expect(result).toContain('agosto');
  });

  it('should format date in time format', () => {
    const date = new Date('2025-08-28T10:30:00');
    const result = pipe.transform(date.toISOString(), 'time');
    expect(result).toBe('10:30');
  });

  it('should format date in date format', () => {
    const date = new Date('2025-08-28T10:30:00');
    const result = pipe.transform(date.toISOString(), 'date');
    expect(result).toBe('28/08/2025');
  });

  it('should handle single digit day and month', () => {
    const date = new Date('2025-01-05T09:05:00');
    const result = pipe.transform(date.toISOString(), 'short');
    expect(result).toBe('05/01/2025 09:05');
  });

  it('should handle unknown format by defaulting to short', () => {
    const date = new Date('2025-08-28T10:30:00');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = pipe.transform(date.toISOString(), 'unknown' as any);
    expect(result).toContain('28/08/2025');
  });
});
