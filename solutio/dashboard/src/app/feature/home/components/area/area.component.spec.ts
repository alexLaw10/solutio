import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AreaComponent } from './area.component';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { BehaviorSubject } from 'rxjs';
import { OpenMeteoForecastRoot } from '../../../../core/interfaces/open-meteo-forecast';
import { NgApexchartsModule } from 'ng-apexcharts';

describe('AreaComponent', () => {
  let component: AreaComponent;
  let fixture: ComponentFixture<AreaComponent>;
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
        '2025-08-28T01:00',
        '2025-08-28T02:00'
      ],
      temperature_2m: [25.0, 26.5, 28.0],
      precipitation_probability: [10, 20, 15]
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
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);

    const weatherDataServiceMock = {
      getForecastData$: jest.fn(() => forecastDataSubject.asObservable()),
      getLoading$: jest.fn(() => loadingSubject.asObservable()),
      getError$: jest.fn(() => errorSubject.asObservable())
    };

    await TestBed.configureTestingModule({
      declarations: [AreaComponent],
      imports: [NgApexchartsModule],
      providers: [
        ChangeDetectorRef,
        { provide: WeatherDataService, useValue: weatherDataServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AreaComponent);
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
      expect(component.error).toBe(false);
    });

    it('should convert timestamps correctly', () => {
      component.error = false;
      forecastDataSubject.next(mockForecastData);

      const chartOptions = component.chartOptions;
      const firstDataPoint = chartOptions.series[0].data[0] as [number, number];
      expect(firstDataPoint[0]).toBe(new Date('2025-08-28T00:00').getTime());
      expect(firstDataPoint[1]).toBe(25.0);
    });

    it('should round temperatures correctly', () => {
      component.error = false;
      forecastDataSubject.next(mockForecastData);

      const chartOptions = component.chartOptions;
      const secondDataPoint = chartOptions.series[0].data[1] as [number, number];
      expect(secondDataPoint[1]).toBe(26.5);
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
