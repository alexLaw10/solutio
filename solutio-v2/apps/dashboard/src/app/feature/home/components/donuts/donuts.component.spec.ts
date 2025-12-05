import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DonutsComponent } from './donuts.component';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { OpenMeteoForecastRoot } from '../../../../core/interfaces/open-meteo-forecast';

// Mock ResizeObserver for ApexCharts
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('DonutsComponent', () => {
  let component: DonutsComponent;
  let fixture: ComponentFixture<DonutsComponent>;
  let weatherDataService: jest.Mocked<WeatherDataService>;
  let forecastSubject: BehaviorSubject<OpenMeteoForecastRoot | null>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;

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
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);

    const weatherDataServiceMock = {
      getForecastData$: jest.fn(() => forecastSubject.asObservable()),
      getLoading$: jest.fn(() => loadingSubject.asObservable()),
      getError$: jest.fn(() => errorSubject.asObservable()),
    };

    await TestBed.configureTestingModule({
      imports: [DonutsComponent],
      providers: [
        { provide: WeatherDataService, useValue: weatherDataServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DonutsComponent);
    component = fixture.componentInstance;
    weatherDataService = TestBed.inject(WeatherDataService) as jest.Mocked<WeatherDataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading false and error false', () => {
    expect(component.loading).toBe(false);
    expect(component.error).toBe(false);
  });

  it('should process donut data correctly', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    // Don't call detectChanges() to avoid ApexCharts rendering issues in tests

    expect(component.donutOptions).toBeDefined();
    expect(component.donutOptions.series).toEqual([27.5, 22.5]); // 27.5 and 50 - 27.5 = 22.5
    expect(component.donutOptions.chart.type).toBe('donut');
    expect(component.error).toBe(false);
  }));

  it('should set error when current_weather temperature is undefined', fakeAsync(() => {
    const dataWithoutTemp = {
      ...mockForecastData,
      current_weather: undefined as any,
    };

    component.ngOnInit();
    tick();

    forecastSubject.next(dataWithoutTemp);
    tick();
    // Don't call detectChanges() to avoid ApexCharts rendering issues in tests

    expect(component.error).toBe(true);
  }));

  it('should set error when current_weather temperature is null', fakeAsync(() => {
    const dataWithNullTemp = {
      ...mockForecastData,
      current_weather: {
        ...mockForecastData.current_weather,
        temperature: null as any,
      },
    };

    component.ngOnInit();
    tick();

    forecastSubject.next(dataWithNullTemp);
    tick();
    // Don't call detectChanges() to avoid ApexCharts rendering issues in tests

    expect(component.error).toBe(true);
  }));

  it('should update loading state', fakeAsync(() => {
    component.ngOnInit();
    tick();

    loadingSubject.next(true);
    tick();
    fixture.detectChanges();

    expect(component.loading).toBe(true);

    loadingSubject.next(false);
    tick();
    fixture.detectChanges();

    expect(component.loading).toBe(false);
  }));

  it('should update error state from error observable', fakeAsync(() => {
    component.ngOnInit();
    tick();

    errorSubject.next('Network error');
    tick();
    fixture.detectChanges();

    expect(component.error).toBe(true);

    errorSubject.next(null);
    tick();
    fixture.detectChanges();

    expect(component.error).toBe(false);
  }));

  it('should calculate restante correctly when temp is above 50', fakeAsync(() => {
    const highTempData = {
      ...mockForecastData,
      current_weather: {
        ...mockForecastData.current_weather,
        temperature: 55,
      },
    };

    component.ngOnInit();
    tick();

    forecastSubject.next(highTempData);
    tick();
    // Don't call detectChanges() to avoid ApexCharts rendering issues in tests

    expect(component.donutOptions.series[1]).toBe(0); // max(0, 50 - 55) = 0
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
