import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeComponent } from './home.component';
import { WeatherDataService } from '../../core/services/weather-data.service';
import { BehaviorSubject } from 'rxjs';
import { OpenMeteoForecastRoot } from '../../core/interfaces/open-meteo-forecast';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let weatherDataService: jest.Mocked<WeatherDataService>;
  let forecastDataSubject: BehaviorSubject<OpenMeteoForecastRoot | null>;

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
      temperature: 27.5,
      windspeed: 10.5,
      weathercode: 0
    }
  };

  beforeEach(async () => {
    forecastDataSubject = new BehaviorSubject<OpenMeteoForecastRoot | null>(null);

    const weatherDataServiceMock = {
      initialize: jest.fn(),
      getForecastData$: jest.fn(() => forecastDataSubject.asObservable())
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        ChangeDetectorRef,
        { provide: WeatherDataService, useValue: weatherDataServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    weatherDataService = TestBed.inject(WeatherDataService) as jest.Mocked<WeatherDataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize weather data service', () => {
      component.ngOnInit();
      expect(weatherDataService.initialize).toHaveBeenCalled();
    });

    it('should subscribe to forecast data', () => {
      component.ngOnInit();
      forecastDataSubject.next(mockForecastData);
      fixture.detectChanges();

      expect(component.currentTemp).toBe(27.5);
    });

    it('should handle missing current_weather', () => {
      const noCurrentWeather: OpenMeteoForecastRoot = {
        ...mockForecastData,
        current_weather: undefined as any
      };

      component.ngOnInit();
      forecastDataSubject.next(noCurrentWeather);
      fixture.detectChanges();

      expect(component.currentTemp).toBe(0);
    });

    it('should handle missing temperature', () => {
      const noTemp: OpenMeteoForecastRoot = {
        ...mockForecastData,
        current_weather: {
          ...mockForecastData.current_weather,
          temperature: undefined as any
        }
      };

      component.ngOnInit();
      forecastDataSubject.next(noTemp);
      fixture.detectChanges();

      expect(component.currentTemp).toBe(0);
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