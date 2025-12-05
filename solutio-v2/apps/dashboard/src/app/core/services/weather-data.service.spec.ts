import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WeatherDataService } from './weather-data.service';
import { OpenMeteoService } from './open.service';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { OpenMeteoForecastRoot } from '../interfaces/open-meteo-forecast';

describe('WeatherDataService', () => {
  let service: WeatherDataService;
  let openMeteoService: jest.Mocked<OpenMeteoService>;

  const mockForecastData: OpenMeteoForecastRoot = {
    latitude: -7.1153,
    longitude: -34.8641,
    generationtime_ms: 0,
    utc_offset_seconds: 0,
    timezone: 'UTC',
    hourly: {
      time: ['2025-08-28T10:00:00'],
      temperature_2m: [25],
      precipitation_probability: [50],
      relative_humidity_2m: [80],
      windspeed_10m: [10],
      weathercode: [0],
    },
    daily: { time: [], weathercode: [] },
    current_weather: { temperature: 25, windspeed: 10, weathercode: 0, time: '2025-08-28T10:00' },
  };

  beforeEach(() => {
    const openMeteoServiceMock = {
      getForecast: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeatherDataService,
        { provide: OpenMeteoService, useValue: openMeteoServiceMock },
      ],
    });

    service = TestBed.inject(WeatherDataService);
    openMeteoService = TestBed.inject(OpenMeteoService) as jest.Mocked<OpenMeteoService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get forecast data observable', fakeAsync(() => {
    openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
    
    const receivedData: (OpenMeteoForecastRoot | null)[] = [];
    service.getForecastData$().pipe(take(2)).subscribe((data) => {
      receivedData.push(data);
    });
    
    tick(); // Get initial value (null)
    service.updateLocation(-7.1153, -34.8641);
    tick();
    
    expect(receivedData.length).toBeGreaterThanOrEqual(1);
    expect(receivedData[receivedData.length - 1]).toEqual(mockForecastData);
    expect(openMeteoService.getForecast).toHaveBeenCalledWith(-7.1153, -34.8641);
  }));

  it('should get loading observable and update state correctly', fakeAsync(() => {
    openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
    
    const loadingValues: boolean[] = [];
    service.getLoading$().pipe(take(3)).subscribe((loading) => {
      loadingValues.push(loading);
    });
    
    tick(); // Get initial value (false)
    service.updateLocation(-7.1153, -34.8641);
    tick(); // Process async operations
    
    expect(loadingValues.length).toBeGreaterThanOrEqual(2);
    expect(loadingValues).toContain(true);
    expect(loadingValues).toContain(false);
    expect(loadingValues[loadingValues.length - 1]).toBe(false);
  }));

  it('should get error observable with initial null value', (done) => {
    service.getError$().pipe(take(1)).subscribe((error) => {
      expect(error).toBeNull();
      done();
    });
  });

  it('should clear error', fakeAsync(() => {
    // Set an error first
    service['error$'].next('Test error');
    tick();
    
    // Verify error is set
    let errorValue: string | null = null;
    service.getError$().pipe(take(1)).subscribe((error) => {
      errorValue = error;
    });
    tick();
    expect(errorValue).toBe('Test error');
    
    // Clear error
    service.clearError();
    tick();
    
    // Verify error is cleared
    service.getError$().pipe(take(1)).subscribe((error) => {
      expect(error).toBeNull();
    });
    tick();
  }));

  it('should get current location', () => {
    const location = service.getCurrentLocation();
    expect(location).toHaveProperty('lat');
    expect(location).toHaveProperty('lng');
    expect(location.lat).toBe(-7.1153);
    expect(location.lng).toBe(-34.8641);
  });

  it('should return a copy of current location', () => {
    const location1 = service.getCurrentLocation();
    const location2 = service.getCurrentLocation();
    expect(location1).not.toBe(location2);
    expect(location1).toEqual(location2);
  });

  it('should update location and load forecast', fakeAsync(() => {
    openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
    
    service.updateLocation(-7.1153, -34.8641);
    tick();
    
    expect(openMeteoService.getForecast).toHaveBeenCalledWith(-7.1153, -34.8641);
    expect(service.getCurrentLocation()).toEqual({ lat: -7.1153, lng: -34.8641 });
  }));

  it('should not update location if same coordinates and initialized', fakeAsync(() => {
    openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
    
    // First call - should trigger load
    service.updateLocation(-7.1153, -34.8641);
    tick();
    expect(openMeteoService.getForecast).toHaveBeenCalledTimes(1);
    
    // Initialize the service
    service.initialize();
    tick();
    
    // Second call with same coordinates - should not trigger load
    openMeteoService.getForecast.mockClear();
    service.updateLocation(-7.1153, -34.8641);
    tick();
    expect(openMeteoService.getForecast).not.toHaveBeenCalled();
  }));

  it('should update location if coordinates are different', fakeAsync(() => {
    openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
    
    service.updateLocation(-7.1153, -34.8641);
    tick();
    expect(openMeteoService.getForecast).toHaveBeenCalledTimes(1);
    
    service.updateLocation(-8.1153, -35.8641);
    tick();
    expect(openMeteoService.getForecast).toHaveBeenCalledTimes(2);
    expect(openMeteoService.getForecast).toHaveBeenLastCalledWith(-8.1153, -35.8641);
  }));

  it('should refresh forecast', fakeAsync(() => {
    openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
    
    service.updateLocation(-7.1153, -34.8641);
    tick();
    expect(openMeteoService.getForecast).toHaveBeenCalledTimes(1);
    
    openMeteoService.getForecast.mockClear();
    service.refreshForecast();
    tick();
    
    expect(openMeteoService.getForecast).toHaveBeenCalledTimes(1);
    expect(openMeteoService.getForecast).toHaveBeenCalledWith(-7.1153, -34.8641);
  }));

  it('should initialize and load forecast', fakeAsync(() => {
    openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
    
    service.initialize();
    tick();
    
    expect(openMeteoService.getForecast).toHaveBeenCalledTimes(1);
    expect(openMeteoService.getForecast).toHaveBeenCalledWith(-7.1153, -34.8641);
  }));

  it('should not initialize twice', fakeAsync(() => {
    openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
    
    service.initialize();
    tick();
    expect(openMeteoService.getForecast).toHaveBeenCalledTimes(1);
    
    openMeteoService.getForecast.mockClear();
    service.initialize();
    tick();
    
    expect(openMeteoService.getForecast).not.toHaveBeenCalled();
  }));

  // it('should handle error when loading forecast', fakeAsync(() => {
  //   const error = new Error('Network error');
  //   openMeteoService.getForecast.mockReturnValue(throwError(() => error));
    
  //   const errorValues: (string | null)[] = [];
  //   service.getError$().pipe(take(2)).subscribe((err) => {
  //     errorValues.push(err);
  //   });
    
  //   tick(); // Get initial value (null)
  //   service.updateLocation(-7.1153, -34.8641);
  //   tick();
    
  //   expect(errorValues.length).toBeGreaterThanOrEqual(1);
  //   expect(errorValues[errorValues.length - 1]).toBe('Network error');
  //   expect(openMeteoService.getForecast).toHaveBeenCalledWith(-7.1153, -34.8641);
  // }));

  it('should set loading to false after error', fakeAsync(() => {
    const error = new Error('Network error');
    openMeteoService.getForecast.mockReturnValue(throwError(() => error));
    
    const loadingValues: boolean[] = [];
    service.getLoading$().pipe(take(3)).subscribe((loading) => {
      loadingValues.push(loading);
    });
    
    tick(); // Get initial value (false)
    service.updateLocation(-7.1153, -34.8641);
    tick(); // Process async operations
    
    expect(loadingValues.length).toBeGreaterThanOrEqual(2);
    expect(loadingValues).toContain(true);
    expect(loadingValues[loadingValues.length - 1]).toBe(false);
  }));

  // it('should handle error with default message when error has no message', fakeAsync(() => {
  //   const error = new Error();
  //   error.message = '';
  //   openMeteoService.getForecast.mockReturnValue(throwError(() => error));
    
  //   const errorValues: (string | null)[] = [];
  //   service.getError$().pipe(take(2)).subscribe((err) => {
  //     errorValues.push(err);
  //   });
    
  //   tick(); // Get initial value (null)
  //   service.updateLocation(-7.1153, -34.8641);
  //   tick();
    
  //   expect(errorValues.length).toBeGreaterThanOrEqual(1);
  //   expect(errorValues[errorValues.length - 1]).toBe('Erro ao carregar dados meteorológicos');
  // }));

  it('should clear error before loading new forecast', fakeAsync(() => {
    const error = new Error('First error');
    openMeteoService.getForecast.mockReturnValue(throwError(() => error));
    
    service.updateLocation(-7.1153, -34.8641);
    tick();
    
    // Verify error is set
    let errorValue: string | null = 'not null';
    service.getError$().pipe(take(1)).subscribe((err) => {
      errorValue = err;
    });
    tick();
    expect(errorValue).toBe('First error');
    
    // Load successful forecast
    openMeteoService.getForecast.mockReturnValue(of(mockForecastData));
    service.refreshForecast();
    tick();
    
    // Error should be cleared
    service.getError$().pipe(take(1)).subscribe((err) => {
      expect(err).toBeNull();
    });
    tick();
  }));
});
