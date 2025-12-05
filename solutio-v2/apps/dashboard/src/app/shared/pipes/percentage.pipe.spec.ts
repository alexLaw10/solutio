import { PercentagePipe } from './percentage.pipe';

describe('PercentagePipe', () => {
  let pipe: PercentagePipe;

  beforeEach(() => {
    pipe = new PercentagePipe();
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

  it('should return "-" for NaN value', () => {
    expect(pipe.transform(NaN)).toBe('-');
  });

  it('should format percentage with 0 decimals by default', () => {
    expect(pipe.transform(50)).toBe('50%');
  });

  it('should format percentage with specified decimals', () => {
    expect(pipe.transform(50.123, 1)).toBe('50.1%');
    expect(pipe.transform(50.123, 2)).toBe('50.12%');
    expect(pipe.transform(50.123, 3)).toBe('50.123%');
  });

  it('should format zero correctly', () => {
    expect(pipe.transform(0)).toBe('0%');
  });

  it('should format 100 correctly', () => {
    expect(pipe.transform(100)).toBe('100%');
  });

  it('should format negative numbers', () => {
    expect(pipe.transform(-10)).toBe('-10%');
  });

  it('should format large numbers', () => {
    expect(pipe.transform(1234.56, 2)).toBe('1234.56%');
  });
});
