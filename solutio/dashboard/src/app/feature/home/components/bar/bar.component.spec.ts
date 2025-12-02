import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BarComponent } from './bar.component';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { BehaviorSubject } from 'rxjs';
import { OpenMeteoForecastRoot } from '../../../../core/interfaces/open-meteo-forecast';
import { BarChartOptions } from '../../../../core/interfaces/chart.interfaces';
import { NgApexchartsModule } from 'ng-apexcharts';

describe('BarComponent', () => {
  let component: BarComponent;
  let fixture: ComponentFixture<BarComponent>;
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
      time: [
        '2025-08-28T00:00',
        '2025-08-28T12:00',
        '2025-08-29T00:00',
        '2025-08-29T12:00',
        '2025-08-30T00:00',
        '2025-08-30T12:00'
      ],
      temperature_2m: [25.0, 28.0, 24.0, 27.0, 26.0, 29.0],
      precipitation_probability: [10, 20, 15, 25, 20, 30]
    },
    daily: {
      time: ['2025-08-28', '2025-08-29', '2025-08-30'],
      weathercode: [0, 0, 0]
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
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);

    const weatherDataServiceMock = {
      getForecastData$: jest.fn(() => forecastDataSubject.asObservable()),
      getLoading$: jest.fn(() => loadingSubject.asObservable()),
      getError$: jest.fn(() => errorSubject.asObservable())
    };

    await TestBed.configureTestingModule({
      declarations: [BarComponent],
      imports: [NgApexchartsModule],
      providers: [
        ChangeDetectorRef,
        { provide: WeatherDataService, useValue: weatherDataServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BarComponent);
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

      expect(component.chartOptions).toBeDefined();
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

  describe('processChartData', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.error = false;
    });

    it('should process chart data correctly', () => {
      component.error = false;
      forecastDataSubject.next(mockForecastData);

      expect(component.chartOptions).toBeDefined();
      expect(component.chartOptions.series).toBeDefined();
      expect(component.chartOptions.series[0].data).toHaveLength(3);
      expect(component.chartOptions.xaxis?.categories).toHaveLength(3);
      expect(component.error).toBe(false);
    });

    it('should calculate daily averages correctly', () => {
      component.error = false;
      forecastDataSubject.next(mockForecastData);

      const chartOptions = component.chartOptions as BarChartOptions;
      const day1Avg = (25.0 + 28.0) / 2;
      expect(chartOptions.series[0].data[0]).toBe(Math.round(day1Avg * 10) / 10);
    });

    it('should handle missing hourly data', () => {
      component.error = false;
      const noHourlyData: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: undefined as any
      };

      forecastDataSubject.next(noHourlyData);

      expect(component.error).toBe(true);
    });

    it('should handle missing time array', () => {
      component.error = false;
      const noTimeData: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: {
          ...mockForecastData.hourly,
          time: undefined as any
        }
      };

      forecastDataSubject.next(noTimeData);

      expect(component.error).toBe(true);
    });

    it('should handle missing temperature array', () => {
      component.error = false;
      const noTempData: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: {
          ...mockForecastData.hourly,
          temperature_2m: undefined as any
        }
      };

      forecastDataSubject.next(noTempData);

      expect(component.error).toBe(true);
    });

    it('should sort dates correctly', () => {
      component.error = false;
      forecastDataSubject.next(mockForecastData);

      const chartOptions = component.chartOptions as BarChartOptions;
      const categories = chartOptions.xaxis?.categories || [];
      expect(categories[0]).toBe('2025-08-28');
      expect(categories[1]).toBe('2025-08-29');
      expect(categories[2]).toBe('2025-08-30');
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
