import { PercentagePipe } from './percentage.pipe';

describe('PercentagePipe', () => {
  let pipe: PercentagePipe;

  beforeEach(() => {
    pipe = new PercentagePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number as percentage with default decimals', () => {
    const result = pipe.transform(85);
    expect(result).toBe('85%');
  });

  it('should format number as percentage with specified decimals', () => {
    const result = pipe.transform(85.456, 2);
    expect(result).toBe('85.46%');
  });

  it('should round number when decimals is 0', () => {
    const result = pipe.transform(85.7);
    expect(result).toBe('86%');
  });

  it('should return "-" for null value', () => {
    const result = pipe.transform(null);
    expect(result).toBe('-');
  });

  it('should return "-" for undefined value', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('-');
  });

  it('should handle zero value', () => {
    const result = pipe.transform(0);
    expect(result).toBe('0%');
  });

  it('should handle negative values', () => {
    const result = pipe.transform(-10);
    expect(result).toBe('-10%');
  });

  it('should handle decimal values with rounding', () => {
    const result = pipe.transform(85.49);
    expect(result).toBe('85%');
  });

  it('should handle large numbers', () => {
    const result = pipe.transform(1000);
    expect(result).toBe('1000%');
  });

  it('should format with 1 decimal place', () => {
    const result = pipe.transform(85.456, 1);
    expect(result).toBe('85.5%');
  });

  it('should format with 3 decimal places', () => {
    const result = pipe.transform(85.456789, 3);
    expect(result).toBe('85.457%');
  });
});

