import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { KpiComponent } from './kpi.component';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { BehaviorSubject } from 'rxjs';
import { OpenMeteoForecastRoot } from '../../../../core/interfaces/open-meteo-forecast';

describe('KpiComponent', () => {
  let component: KpiComponent;
  let fixture: ComponentFixture<KpiComponent>;
  let _weatherDataService: jest.Mocked<WeatherDataService>;
  let forecastDataSubject: BehaviorSubject<OpenMeteoForecastRoot | null>;
  let loadingSubject: BehaviorSubject<boolean>;

  const mockForecastData: OpenMeteoForecastRoot = {
    latitude: -7.1153,
    longitude: -34.8641,
    generationtime_ms: 0.1,
    utc_offset_seconds: -10800,
    timezone: 'America/Fortaleza',
    hourly: {
      time: ['2025-08-28T00:00', '2025-08-28T01:00', '2025-08-28T02:00'],
      temperature_2m: [25.0, 26.0, 27.0],
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

    const weatherDataServiceMock = {
      getForecastData$: jest.fn(() => forecastDataSubject.asObservable()),
      getLoading$: jest.fn(() => loadingSubject.asObservable())
    };

    await TestBed.configureTestingModule({
      declarations: [KpiComponent],
      providers: [
        ChangeDetectorRef,
        { provide: WeatherDataService, useValue: weatherDataServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KpiComponent);
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
      fixture.detectChanges();

      expect(component.avgTemp).toBeDefined();
      expect(component.maxTemp).toBeDefined();
      expect(component.minTemp).toBeDefined();
      expect(component.percentChange).toBeDefined();
    });

    it('should subscribe to loading state', () => {
      component.ngOnInit();
      loadingSubject.next(true);
      fixture.detectChanges();

      expect(component.loading).toBe(true);
    });
  });

  describe('processKpiData', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should calculate average temperature correctly', () => {
      forecastDataSubject.next(mockForecastData);
      fixture.detectChanges();

      const expectedAvg = (25.0 + 26.0 + 27.0) / 3;
      expect(component.avgTemp).toBe(Math.round(expectedAvg * 10) / 10);
    });

    it('should calculate max temperature correctly', () => {
      forecastDataSubject.next(mockForecastData);
      fixture.detectChanges();

      expect(component.maxTemp).toBe(27.0);
    });

    it('should calculate min temperature correctly', () => {
      forecastDataSubject.next(mockForecastData);
      fixture.detectChanges();

      expect(component.minTemp).toBe(25.0);
    });

    it('should calculate percent change correctly', () => {
      forecastDataSubject.next(mockForecastData);
      fixture.detectChanges();

      const first = 25.0;
      const last = 27.0;
      const expectedChange = Math.round(((last - first) / first) * 100 * 10) / 10;
      expect(component.percentChange).toBe(expectedChange);
    });

    it('should handle empty temperature array', () => {
      const emptyData: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: {
          ...mockForecastData.hourly,
          temperature_2m: []
        }
      };

      forecastDataSubject.next(emptyData);
      fixture.detectChanges();

      expect(component.avgTemp).toBeUndefined();
    });

    it('should handle missing hourly data', () => {
      const noHourlyData: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: undefined as any
      };

      forecastDataSubject.next(noHourlyData);
      fixture.detectChanges();

      expect(component.avgTemp).toBeUndefined();
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
