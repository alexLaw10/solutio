import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OpenMeteoService } from './open.service';
import { OpenMeteoForecastRoot } from '../interfaces/open-meteo-forecast';

describe('OpenMeteoService', () => {
  let service: OpenMeteoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpenMeteoService],
    });
    service = TestBed.inject(OpenMeteoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get forecast', () => {
    const mockData: OpenMeteoForecastRoot = {
      latitude: -7.1153,
      longitude: -34.8641,
      generationtime_ms: 0,
      utc_offset_seconds: 0,
      timezone: 'UTC',
      hourly: {
        time: [],
        temperature_2m: [],
        precipitation_probability: [],
        relative_humidity_2m: [],
        windspeed_10m: [],
        weathercode: [],
      },
      daily: { time: [], weathercode: [] },
      current_weather: { temperature: 25, windspeed: 10, weathercode: 0, time: '2025-08-28T10:00' },
    };

    service.getForecast(-7.1153, -34.8641).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/v1/forecast') &&
      request.url.includes('latitude=-7.1153') &&
      request.url.includes('longitude=-34.8641')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get GFS forecast', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockData = {} as any;
    service.getGfs(-7.1153, -34.8641).subscribe();
    const req = httpMock.expectOne((request) => request.url.includes('/v1/gfs'));
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get GEM forecast', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockData = {} as any;
    service.getGem(-7.1153, -34.8641).subscribe();
    const req = httpMock.expectOne((request) => request.url.includes('/v1/gem'));
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get ECMWF forecast', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockData = {} as any;
    service.getEcmwf(-7.1153, -34.8641).subscribe();
    const req = httpMock.expectOne((request) => request.url.includes('/v1/ecmwf'));
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get climate data', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockData = {} as any;
    service.getClimate(-7.1153, -34.8641, '2025-01-01', '2025-12-31').subscribe();
    const req = httpMock.expectOne((request) => request.url.includes('/v1/climate'));
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get historical weather', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockData = {} as any;
    service.getHistoricalWeather(-7.1153, -34.8641, '2025-01-01', '2025-12-31').subscribe();
    const req = httpMock.expectOne((request) => request.url.includes('/v1/forecast'));
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
