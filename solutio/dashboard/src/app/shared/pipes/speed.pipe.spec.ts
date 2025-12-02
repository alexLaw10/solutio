import { SpeedPipe } from './speed.pipe';

describe('SpeedPipe', () => {
  let pipe: SpeedPipe;

  beforeEach(() => {
    pipe = new SpeedPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number as speed with default unit and decimals', () => {
    const result = pipe.transform(25);
    expect(result).toBe('25 km/h');
  });

  it('should format number as speed with specified decimals', () => {
    const result = pipe.transform(25.456, 'km/h', 2);
    expect(result).toBe('25.46 km/h');
  });

  it('should format number with custom unit', () => {
    const result = pipe.transform(25, 'm/s');
    expect(result).toBe('25 m/s');
  });

  it('should round number when decimals is 0', () => {
    const result = pipe.transform(25.7);
    expect(result).toBe('26 km/h');
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
    expect(result).toBe('0 km/h');
  });

  it('should handle negative values', () => {
    const result = pipe.transform(-10);
    expect(result).toBe('-10 km/h');
  });

  it('should handle decimal values with rounding', () => {
    const result = pipe.transform(25.49);
    expect(result).toBe('25 km/h');
  });

  it('should handle large numbers', () => {
    const result = pipe.transform(1000);
    expect(result).toBe('1000 km/h');
  });

  it('should format with 1 decimal place', () => {
    const result = pipe.transform(25.456, 'km/h', 1);
    expect(result).toBe('25.5 km/h');
  });

  it('should format with 3 decimal places', () => {
    const result = pipe.transform(25.456789, 'km/h', 3);
    expect(result).toBe('25.457 km/h');
  });

  it('should format with mph unit', () => {
    const result = pipe.transform(60, 'mph');
    expect(result).toBe('60 mph');
  });

  it('should format with knots unit', () => {
    const result = pipe.transform(30, 'kn', 1);
    expect(result).toBe('30.0 kn');
  });
});

