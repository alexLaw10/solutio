import { SpeedPipe } from './speed.pipe';

describe('SpeedPipe', () => {
  let pipe: SpeedPipe;

  beforeEach(() => {
    pipe = new SpeedPipe();
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

  it('should format speed with km/h by default', () => {
    expect(pipe.transform(50)).toBe('50.0 km/h');
  });

  it('should format speed with specified unit', () => {
    expect(pipe.transform(50, 'm/s')).toBe('50.0 m/s');
    expect(pipe.transform(50, 'mph')).toBe('50.0 mph');
  });

  it('should format speed with 1 decimal place', () => {
    expect(pipe.transform(50.123)).toBe('50.1 km/h');
    expect(pipe.transform(50.789)).toBe('50.8 km/h');
  });

  it('should format zero correctly', () => {
    expect(pipe.transform(0)).toBe('0.0 km/h');
  });

  it('should format negative numbers', () => {
    expect(pipe.transform(-10)).toBe('-10.0 km/h');
  });

  it('should format large numbers', () => {
    expect(pipe.transform(1234.56)).toBe('1234.6 km/h');
  });
});
