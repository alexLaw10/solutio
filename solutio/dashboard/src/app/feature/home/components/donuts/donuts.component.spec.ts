import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DonutsComponent } from './donuts.component';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { BehaviorSubject } from 'rxjs';
import { OpenMeteoForecastRoot } from '../../../../core/interfaces/open-meteo-forecast';
import { NgApexchartsModule } from 'ng-apexcharts';

describe('DonutsComponent', () => {
  let component: DonutsComponent;
  let fixture: ComponentFixture<DonutsComponent>;
  let _weatherDataService: jest.Mocked<WeatherDataService>;
  let forecastDataSubject: BehaviorSubject<OpenMeteoForecastRoot | null>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;

  const mockForecastData: OpenMeteoForecastRoot = {
    latitude: -7.1153,
    longitude: -34.8641,
    generationtime_ms: 0.1,
    utc_offset_seconds: -10800,
    timezone: 'America/Fortaleza',
    hourly: {
      time: ['2025-08-28T00:00'],
      temperature_2m: [25.5],
      precipitation_probability: [10]
    },
    daily: {
      time: ['2025-08-28'],
      weathercode: [0]
    },
    current_weather: {
      time: '2025-08-28T12:00',
      temperature: 30.5,
      windspeed: 10.5,
      weathercode: 0
    }
  };

  beforeEach(async () => {
    forecastDataSubject = new BehaviorSubject<OpenMeteoForecastRoot | null>(null);
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);

    const weatherDataServiceMock = {
      getForecastData$: jest.fn(() => forecastDataSubject.asObservable()),
      getLoading$: jest.fn(() => loadingSubject.asObservable()),
      getError$: jest.fn(() => errorSubject.asObservable())
    };

    await TestBed.configureTestingModule({
      declarations: [DonutsComponent],
      imports: [NgApexchartsModule],
      providers: [
        ChangeDetectorRef,
        { provide: WeatherDataService, useValue: weatherDataServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DonutsComponent);
    component = fixture.componentInstance;
    _weatherDataService = TestBed.inject(WeatherDataService) as jest.Mocked<WeatherDataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to forecast data', () => {
      component.ngOnInit();
      forecastDataSubject.next(mockForecastData);
      
      expect(component.donutOptions).toBeDefined();
    });

    it('should subscribe to loading state', () => {
      component.ngOnInit();
      loadingSubject.next(true);

      expect(component.loading).toBe(true);
    });

    it('should subscribe to error state', () => {
      component.ngOnInit();
      errorSubject.next('Test error');

      expect(component.error).toBe(true);
    });
  });

  describe('processDonutData', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.error = false;
    });

    it('should process donut data correctly', () => {
      component.error = false;
      forecastDataSubject.next(mockForecastData);

      expect(component.donutOptions).toBeDefined();
      expect(component.donutOptions.series).toEqual([30.5, 19.5]);
      expect(component.error).toBe(false);
    });

    it('should calculate remaining temperature correctly', () => {
      component.error = false;
      forecastDataSubject.next(mockForecastData);

      const tempAtual = 30.5;
      const restante = Math.max(0, 50 - tempAtual);
      expect(component.donutOptions.series).toEqual([tempAtual, restante]);
    });

    it('should handle temperature at 50 or above', () => {
      component.error = false;
      const highTempData: OpenMeteoForecastRoot = {
        ...mockForecastData,
        current_weather: {
          ...mockForecastData.current_weather,
          temperature: 55
        }
      };

      forecastDataSubject.next(highTempData);

      expect(component.donutOptions.series[1]).toBe(0);
    });

    it('should handle missing current_weather', () => {
      component.error = false;
      
      const noCurrentWeather: any = {
        latitude: mockForecastData.latitude,
        longitude: mockForecastData.longitude,
        generationtime_ms: mockForecastData.generationtime_ms,
        utc_offset_seconds: mockForecastData.utc_offset_seconds,
        timezone: mockForecastData.timezone,
        hourly: mockForecastData.hourly,
        daily: mockForecastData.daily
      };

      forecastDataSubject.next(noCurrentWeather);

      expect(component.error).toBe(true);
    });

    it('should handle null temperature', () => {
      component.error = false;
      
      const nullTempData: any = {
        ...mockForecastData,
        current_weather: {
          ...mockForecastData.current_weather,
          temperature: null
        }
      };

      forecastDataSubject.next(nullTempData);

      expect(component.error).toBe(true);
    });

    it('should handle undefined temperature', () => {
      component.error = false;
      
      const undefinedTempData: any = {
        ...mockForecastData,
        current_weather: {}
      };

      forecastDataSubject.next(undefinedTempData);

      expect(component.error).toBe(true);
    });

    it('should round temperatures correctly', () => {
      component.error = false;
      const preciseTempData: OpenMeteoForecastRoot = {
        ...mockForecastData,
        current_weather: {
          ...mockForecastData.current_weather,
          temperature: 30.567
        }
      };

      forecastDataSubject.next(preciseTempData);

      expect(component.donutOptions.series[0]).toBe(30.6);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy subject', () => {
      component.ngOnInit();
      const destroySpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
