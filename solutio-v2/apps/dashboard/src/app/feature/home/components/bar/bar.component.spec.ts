import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BarComponent } from './bar.component';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { OpenMeteoForecastRoot } from '../../../../core/interfaces/open-meteo-forecast';

describe('BarComponent', () => {
  let component: BarComponent;
  let fixture: ComponentFixture<BarComponent>;
  let forecastSubject: BehaviorSubject<OpenMeteoForecastRoot | null>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;

  // Mock ResizeObserver for ApexCharts
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  const mockForecastData: OpenMeteoForecastRoot = {
    latitude: -7.1153,
    longitude: -34.8641,
    generationtime_ms: 0,
    utc_offset_seconds: 0,
    timezone: 'UTC',
    hourly: {
      time: [
        '2025-08-28T00:00:00',
        '2025-08-28T01:00:00',
        '2025-08-28T02:00:00',
        '2025-08-29T00:00:00',
        '2025-08-29T01:00:00',
      ],
      temperature_2m: [20, 22, 24, 25, 26],
      precipitation_probability: [50],
    },
    daily: { time: [], weathercode: [] },
    current_weather: {
      temperature: 25,
      windspeed: 10,
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
      imports: [BarComponent],
      providers: [
        { provide: WeatherDataService, useValue: weatherDataServiceMock },
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading false and error false', () => {
    expect(component.loading).toBe(false);
    expect(component.error).toBe(false);
  });

  it('should process chart data correctly', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    // Don't call detectChanges to avoid rendering ApexCharts in tests
    // fixture.detectChanges();

    expect(component.chartOptions).toBeDefined();
    expect(component.chartOptions.chart.type).toBe('bar');
    expect(component.chartOptions.series[0].data.length).toBe(2); // 2 days
    expect(component.chartOptions.xaxis.categories.length).toBe(2);
    expect(component.error).toBe(false);
  }));

  it('should set error when hourly data is missing', fakeAsync(() => {
    const dataWithoutHourly = {
      ...mockForecastData,
      hourly: undefined,
    } as unknown as OpenMeteoForecastRoot;

    component.ngOnInit();
    tick();

    forecastSubject.next(dataWithoutHourly);
    tick();
    // Don't call detectChanges to avoid rendering ApexCharts in tests
    // fixture.detectChanges();

    expect(component.error).toBe(true);
  }));

  it('should set error when time array is missing', fakeAsync(() => {
    const dataWithoutTime = {
      ...mockForecastData,
      hourly: {
        ...mockForecastData.hourly,
        time: undefined,
      },
    } as unknown as OpenMeteoForecastRoot;

    component.ngOnInit();
    tick();

    forecastSubject.next(dataWithoutTime);
    tick();
    // Don't call detectChanges to avoid rendering ApexCharts in tests
    // fixture.detectChanges();

    expect(component.error).toBe(true);
  }));

  it('should calculate average temperature per day correctly', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    // Don't call detectChanges to avoid rendering ApexCharts in tests
    // fixture.detectChanges();

    // Day 1: (20 + 22 + 24) / 3 = 22
    // Day 2: (25 + 26) / 2 = 25.5
    const seriesData = component.chartOptions.series[0].data;
    expect(seriesData[0]).toBe(22);
    expect(seriesData[1]).toBe(25.5);
  }));

  it('should update loading state', fakeAsync(() => {
    component.ngOnInit();
    tick();

    loadingSubject.next(true);
    tick();
    fixture.detectChanges();

    expect(component.loading).toBe(true);
  }));

  it('should update error state from error observable', fakeAsync(() => {
    component.ngOnInit();
    tick();

    errorSubject.next('Network error');
    tick();
    fixture.detectChanges();

    expect(component.error).toBe(true);
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
