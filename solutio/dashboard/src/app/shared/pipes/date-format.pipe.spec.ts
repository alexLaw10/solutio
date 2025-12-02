import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format date to short format by default', () => {
    const date = '2025-08-28T12:30:00';
    const result = pipe.transform(date);
    expect(result).toBe('28/08/2025 12:30');
  });

  it('should format date to long format', () => {
    const date = '2025-08-28T12:30:00';
    const result = pipe.transform(date, 'long');
    expect(result).toContain('28');
    expect(result).toContain('2025');
  });

  it('should format date to time format', () => {
    const date = '2025-08-28T12:30:00';
    const result = pipe.transform(date, 'time');
    expect(result).toBe('12:30');
  });

  it('should format date to date format', () => {
    const date = '2025-08-28T12:30:00';
    const result = pipe.transform(date, 'date');
    expect(result).toBe('28/08/2025');
  });

  it('should return "-" for null value', () => {
    const result = pipe.transform(null);
    expect(result).toBe('-');
  });

  it('should return "-" for undefined value', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('-');
  });

  it('should return original value for invalid date', () => {
    const invalidDate = 'invalid-date';
    const result = pipe.transform(invalidDate);
    expect(result).toBe(invalidDate);
  });

  it('should handle ISO date strings', () => {
    const date = '2025-08-28T14:45:00Z';
    const result = pipe.transform(date, 'short');
    expect(result).toContain('28/08/2025');
  });
});

