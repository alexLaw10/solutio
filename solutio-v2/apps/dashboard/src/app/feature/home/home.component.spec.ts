import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeComponent } from './home.component';
import { WeatherDataService } from '../../core/services/weather-data.service';
import { OpenMeteoForecastRoot } from '../../core/interfaces/open-meteo-forecast';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let weatherDataService: jest.Mocked<WeatherDataService>;
  let forecastSubject: BehaviorSubject<OpenMeteoForecastRoot | null>;

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
    },
    daily: { time: [], weathercode: [] },
    current_weather: {
      temperature: 27.5,
      windspeed: 10.5,
      weathercode: 0,
      time: '2025-08-28T12:00',
    },
  };

  beforeEach(async () => {
    forecastSubject = new BehaviorSubject<OpenMeteoForecastRoot | null>(null);
    const loadingSubject = new BehaviorSubject<boolean>(false);
    const errorSubject = new BehaviorSubject<string | null>(null);

    const weatherDataServiceMock = {
      initialize: jest.fn(),
      getForecastData$: jest.fn(() => forecastSubject.asObservable()),
      getLoading$: jest.fn(() => loadingSubject.asObservable()),
      getError$: jest.fn(() => errorSubject.asObservable()),
      updateLocation: jest.fn(),
      clearError: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: WeatherDataService, useValue: weatherDataServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    weatherDataService = TestBed.inject(WeatherDataService) as jest.Mocked<WeatherDataService>;
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize weather data service on init', () => {
    component.ngOnInit();
    expect(weatherDataService.initialize).toHaveBeenCalled();
  });

  it('should update currentTemp when forecast data is received', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    // Avoid detectChanges() to prevent Zone.js serialization issues with child components

    expect(component.currentTemp).toBe(27.5);
  }));

  it('should set currentTemp to 0 when current_weather is not available', fakeAsync(() => {
    const dataWithoutCurrentWeather: Partial<OpenMeteoForecastRoot> = {
      ...mockForecastData,
      current_weather: undefined,
    };

    component.ngOnInit();
    tick();

    forecastSubject.next(dataWithoutCurrentWeather);
    tick();
    // Avoid detectChanges() to prevent Zone.js serialization issues with child components

    expect(component.currentTemp).toBe(0);
  }));

  it('should unsubscribe on destroy', () => {
    component.ngOnInit();
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
