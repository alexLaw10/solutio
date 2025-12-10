import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KpiComponent } from './kpi.component';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { OpenMeteoForecastRoot } from '../../../../core/interfaces/open-meteo-forecast';

describe('KpiComponent', () => {
  let component: KpiComponent;
  let fixture: ComponentFixture<KpiComponent>;
  let forecastSubject: BehaviorSubject<OpenMeteoForecastRoot | null>;
  let loadingSubject: BehaviorSubject<boolean>;

  const mockForecastData: OpenMeteoForecastRoot = {
    latitude: -7.1153,
    longitude: -34.8641,
    generationtime_ms: 0,
    utc_offset_seconds: 0,
    timezone: 'UTC',
    hourly: {
      time: ['2025-08-28T10:00:00', '2025-08-28T11:00:00', '2025-08-28T12:00:00'],
      temperature_2m: [20, 25, 30],
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

    const weatherDataServiceMock = {
      getForecastData$: jest.fn(() => forecastSubject.asObservable()),
      getLoading$: jest.fn(() => loadingSubject.asObservable()),
    };

    await TestBed.configureTestingModule({
      imports: [KpiComponent],
      providers: [
        { provide: WeatherDataService, useValue: weatherDataServiceMock },
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading false', () => {
    expect(component.loading).toBe(false);
  });

  it('should process KPI data correctly', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();

    expect(component.avgTemp).toBe(25); // (20 + 25 + 30) / 3 = 25
    expect(component.maxTemp).toBe(30);
    expect(component.minTemp).toBe(20);
    expect(component.percentChange).toBe(50); // ((30 - 20) / 20) * 100 = 50
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

  it('should not process data if temperature array is empty', fakeAsync(() => {
    const emptyData = {
      ...mockForecastData,
      hourly: {
        ...mockForecastData.hourly,
        temperature_2m: [],
      },
    };

    component.ngOnInit();
    tick();

    forecastSubject.next(emptyData);
    tick();
    fixture.detectChanges();

    expect(component.avgTemp).toBeUndefined();
  }));

  it('should round values correctly', () => {
    // Test private method through public behavior
    const dataWithDecimals = {
      ...mockForecastData,
      hourly: {
        ...mockForecastData.hourly,
        temperature_2m: [20.33, 25.67, 30.99],
      },
    };

    component.ngOnInit();
    forecastSubject.next(dataWithDecimals);
    fixture.detectChanges();

    expect(component.avgTemp).toBe(25.7); // Rounded to 1 decimal
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnInit();
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
