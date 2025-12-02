import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherDataService } from './weather-data.service';
import { OpenMeteoService } from './open.service';
import { OpenMeteoForecastRoot } from '../interfaces/open-meteo-forecast';
import { of, throwError } from 'rxjs';

describe('WeatherDataService', () => {
  let service: WeatherDataService;
  let openMeteoService: jest.Mocked<OpenMeteoService>;
  let httpMock: HttpTestingController;

  const mockForecastData: OpenMeteoForecastRoot = {
    latitude: -7.1153,
    longitude: -34.8641,
    generationtime_ms: 0.1,
    utc_offset_seconds: -10800,
    timezone: 'America/Fortaleza',
    hourly: {
      time: ['2025-08-28T00:00', '2025-08-28T01:00'],
      temperature_2m: [25.5, 26.0],
      precipitation_probability: [10, 20]
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

  beforeEach(() => {
    const openMeteoServiceMock = {
      getForecast: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeatherDataService,
        { provide: OpenMeteoService, useValue: openMeteoServiceMock }
      ]
    });

    service = TestBed.inject(WeatherDataService);
    openMeteoService = TestBed.inject(OpenMeteoService) as jest.Mocked<OpenMeteoService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getForecastData$', () => {
    it('should return null initially', (done) => {
      service.getForecastData$().subscribe((data) => {
        expect(data).toBeNull();
        done();
      });
    });

    it('should emit forecast data after loading', (done) => {
      openMeteoService.getForecast.mockReturnValue(of(mockForecastData));

      service.initialize();

      service.getForecastData$().subscribe((data) => {
        if (data !== null) {
          expect(data).toEqual(mockForecastData);
          done();
        }
      });
    });
  });

  describe('getLoading$', () => {
    it('should return false initially', (done) => {
      service.getLoading$().subscribe((loading) => {
        expect(loading).toBe(false);
        done();
      });
    });

    it('should emit true when loading starts', (done) => {
      openMeteoService.getForecast.mockReturnValue(of(mockForecastData));

      const loadingValues: boolean[] = [];
      service.getLoading$().subscribe((loading) => {
        loadingValues.push(loading);
        if (loadingValues.length >= 2) {
          expect(loadingValues).toEqual([false, true, false]);
          done();
        }
      });

      service.initialize();
    });
  });

  describe('getError$', () => {
    it('should return null initially', (done) => {
      service.getError$().subscribe((error) => {
        expect(error).toBeNull();
        done();
      });
    });

    it('should emit error message on API failure', (done) => {
      const errorMessage = 'Network error';
      openMeteoService.getForecast.mockReturnValue(throwError(() => new Error(errorMessage)));

      service.getError$().subscribe((error) => {
        if (error !== null) {
          expect(error).toBe(errorMessage);
          done();
        }
      });

      service.initialize();
    });
  });

  describe('getCurrentLocation', () => {
    it('should return current location', () => {
      const location = service.getCurrentLocation();
      expect(location).toEqual({ lat: -7.1153, lng: -34.8641 });
    });

    it('should return a copy of the location', () => {
      const location1 = service.getCurrentLocation();
      const location2 = service.getCurrentLocation();
      expect(location1).not.toBe(location2);
      expect(location1).toEqual(location2);
    });
  });

  describe('updateLocation', () => {
    it('should update location and load forecast', () => {
      openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
      const newLat = -23.5505;
      const newLng = -46.6333;

      service.updateLocation(newLat, newLng);

      expect(openMeteoService.getForecast).toHaveBeenCalledWith(newLat, newLng);
      expect(service.getCurrentLocation()).toEqual({ lat: newLat, lng: newLng });
    });

    it('should not reload if location is the same and initialized', () => {
      openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
      service.initialize();
      jest.clearAllMocks();

      service.updateLocation(-7.1153, -34.8641);

      expect(openMeteoService.getForecast).not.toHaveBeenCalled();
    });

    it('should reload if location is different even if initialized', () => {
      openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
      service.initialize();
      jest.clearAllMocks();

      service.updateLocation(-23.5505, -46.6333);

      expect(openMeteoService.getForecast).toHaveBeenCalled();
    });
  });

  describe('refreshForecast', () => {
    it('should reload forecast for current location', () => {
      openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
      service.initialize();
      jest.clearAllMocks();

      service.refreshForecast();

      expect(openMeteoService.getForecast).toHaveBeenCalledWith(-7.1153, -34.8641);
    });
  });

  describe('initialize', () => {
    it('should load forecast on first call', () => {
      openMeteoService.getForecast.mockReturnValue(of(mockForecastData));

      service.initialize();

      expect(openMeteoService.getForecast).toHaveBeenCalledWith(-7.1153, -34.8641);
    });

    it('should not load forecast on subsequent calls', () => {
      openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
      service.initialize();
      jest.clearAllMocks();

      service.initialize();

      expect(openMeteoService.getForecast).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', (done) => {
      const error = new Error('API Error');
      openMeteoService.getForecast.mockReturnValue(throwError(() => error));

      service.getError$().subscribe((errorMessage) => {
        if (errorMessage !== null) {
          expect(errorMessage).toBe('API Error');
          done();
        }
      });

      service.initialize();
    });

    it('should use default error message when error has no message', (done) => {
      const error = { message: '' };
      openMeteoService.getForecast.mockReturnValue(throwError(() => error));

      service.getError$().subscribe((errorMessage) => {
        if (errorMessage !== null) {
          expect(errorMessage).toBe('Erro ao carregar dados meteorológicos');
          done();
        }
      });

      service.initialize();
    });
  });
});
