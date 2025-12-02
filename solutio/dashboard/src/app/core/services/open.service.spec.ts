import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OpenMeteoService } from './open.service';
import {
  OpenMeteoForecastRoot,
  OpenMeteoGfsRoot,
  OpenMeteoGemRoot,
  OpenMeteoEcmwfRoot,
  OpenMeteoClimateRoot,
  OpenMeteoHistoricalRoot
} from '../interfaces/open-meteo-forecast';

describe('OpenMeteoService', () => {
  let service: OpenMeteoService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://api.open-meteo.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpenMeteoService]
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

  describe('getForecast', () => {
    it('should return forecast data', (done) => {
      const mockData: OpenMeteoForecastRoot = {
        latitude: -7.1153,
        longitude: -34.8641,
        generationtime_ms: 0.1,
        utc_offset_seconds: -10800,
        timezone: 'America/Fortaleza',
        hourly: {
          time: ['2025-08-28T00:00'],
          temperature_2m: [25.5],
          precipitation_probability: [10],
          relative_humidity_2m: [65],
          windspeed_10m: [12.3],
          weathercode: [0]
        },
        daily: {
          time: ['2025-08-28'],
          weathercode: [0]
        },
        current_weather: {
          time: '2025-08-28T12:00',
          temperature: 27.5,
          windspeed: 10.5,
          weathercode: 0
        }
      };

      const lat = -7.1153;
      const lon = -34.8641;

      service.getForecast(lat, lon).subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

      const req = httpMock.expectOne(
        `${baseUrl}/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,relative_humidity_2m,windspeed_10m,weathercode&daily=weathercode&current_weather=true&timezone=auto`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('getGfs', () => {
    it('should return GFS data', (done) => {
      const mockData: OpenMeteoGfsRoot = {
        latitude: -7.1153,
        longitude: -34.8641,
        generationtime_ms: 0.1,
        hourly: {
          time: ['2025-08-28T00:00'],
          temperature_2m: [25.5],
          precipitation_probability: [10],
          weathercode: [0]
        }
      };

      const lat = -7.1153;
      const lon = -34.8641;

      service.getGfs(lat, lon).subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

      const req = httpMock.expectOne(
        `${baseUrl}/v1/gfs?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weathercode&forecast_days=7&timezone=auto`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('getGem', () => {
    it('should return GEM data', (done) => {
      const mockData: OpenMeteoGemRoot = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-08-28T00:00'],
          temperature_2m: [25.5],
          weathercode: [0]
        }
      };

      const lat = -7.1153;
      const lon = -34.8641;

      service.getGem(lat, lon).subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

      const req = httpMock.expectOne(
        `${baseUrl}/v1/gem?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&forecast_days=7&timezone=auto`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('getEcmwf', () => {
    it('should return ECMWF data', (done) => {
      const mockData: OpenMeteoEcmwfRoot = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-08-28T00:00'],
          temperature_2m: [25.5],
          relative_humidity_2m: [60],
          weathercode: [0]
        }
      };

      const lat = -7.1153;
      const lon = -34.8641;

      service.getEcmwf(lat, lon).subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

      const req = httpMock.expectOne(
        `${baseUrl}/v1/ecmwf?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,weathercode&timezone=auto`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('getClimate', () => {
    it('should return climate data', (done) => {
      const mockData: OpenMeteoClimateRoot = {
        latitude: -7.1153,
        longitude: -34.8641,
        models: ['EC_Earth3P_HR'],
        data: [
          {
            model: 'EC_Earth3P_HR',
            time: ['2025-08-28'],
            temperature_2m: [25.5],
            precipitation: [10]
          }
        ]
      };

      const lat = -7.1153;
      const lon = -34.8641;
      const start = '2025-08-28';
      const end = '2025-08-29';

      service.getClimate(lat, lon, start, end).subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

      const req = httpMock.expectOne(
        `${baseUrl}/v1/climate?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&models=EC_Earth3P_HR,MPI_ESM1_2_XR`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('getHistoricalWeather', () => {
    it('should return historical weather data', (done) => {
      const mockData: OpenMeteoHistoricalRoot = {
        latitude: -7.1153,
        longitude: -34.8641,
        generationtime_ms: 0.1,
        utc_offset_seconds: -10800,
        timezone: 'America/Fortaleza',
        timezone_abbreviation: 'BRT',
        elevation: 45,
        hourly_units: {
          time: 'iso8601',
          temperature_2m: '°C',
          precipitation: 'mm',
          relativehumidity_2m: '%',
          windspeed_10m: 'km/h'
        },
        hourly: {
          time: ['2025-08-28T00:00'],
          temperature_2m: [25.5],
          precipitation: [0],
          relativehumidity_2m: [60],
          windspeed_10m: [10.5]
        }
      };

      const lat = -7.1153;
      const lon = -34.8641;
      const start = '2025-08-28';
      const end = '2025-08-29';

      service.getHistoricalWeather(lat, lon, start, end).subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

      const req = httpMock.expectOne(
        `${baseUrl}/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=temperature_2m,precipitation,relativehumidity_2m,windspeed_10m&timezone=auto`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });
});
