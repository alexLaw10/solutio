import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TableComponent } from './table.component';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { OpenMeteoForecastRoot } from '../../../../core/interfaces/open-meteo-forecast';
import { TableRow } from '../../../../core/interfaces/table.interfaces';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
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
      time: [
        '2025-08-28T00:00:00',
        '2025-08-28T01:00:00',
        '2025-08-28T02:00:00',
        '2025-08-28T03:00:00',
        '2025-08-28T04:00:00',
        '2025-08-28T05:00:00',
        '2025-08-28T06:00:00',
      ],
      temperature_2m: [20, 22, 24, 25, 26, 27, 28],
      precipitation_probability: [10, 20, 30, 40, 50, 60, 70],
      relative_humidity_2m: [60, 65, 70, 75, 80, 85, 90],
      windspeed_10m: [5, 6, 7, 8, 9, 10, 11],
      weathercode: [0, 1, 2, 3, 4, 5, 6],
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
      updateLocation: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TableComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: WeatherDataService, useValue: weatherDataServiceMock },
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    weatherDataService = TestBed.inject(WeatherDataService) as jest.Mocked<WeatherDataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    component.ngOnInit();
    expect(component.form).toBeDefined();
    expect(component.form.get('start')?.value).toBe('2025-08-28');
    expect(component.form.get('end')?.value).toBe('2025-08-29');
    expect(component.form.get('city')?.value).toBe('João Pessoa');
  });

  it('should have cities defined', () => {
    expect(component.cities.length).toBeGreaterThan(0);
    expect(component.cities[0]).toEqual({ name: 'João Pessoa', lat: -7.1153, lng: -34.8641 });
  });

  it('should process forecast data and create table rows', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();

    expect(component.tableData.length).toBe(7);
    expect(component.displayedData.length).toBe(5); // itemsPerPage = 5
    expect(component.tableData[0].temp).toBe(20);
    expect(component.tableData[0].prec).toBe(10);
  }));

  it('should display only first page of data', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();

    expect(component.displayedData.length).toBe(5);
    expect(component.hasMoreData()).toBe(true);
  }));

  it('should load more data when loadMore is called', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();

    expect(component.displayedData.length).toBe(5);

    component.loadMore();
    tick(300);
    fixture.detectChanges();

    expect(component.displayedData.length).toBe(7);
    expect(component.hasMoreData()).toBe(false);
  }));

  it('should not load more if already loading', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();

    component.loadingMore = true;
    const initialLength = component.displayedData.length;

    component.loadMore();
    tick(300);
    fixture.detectChanges();

    expect(component.displayedData.length).toBe(initialLength);
  }));

  it('should update form city on change and update location only on applyFilter', () => {
    component.ngOnInit();
    weatherDataService.updateLocation.mockClear();
    const event = {
      target: { value: 'São Paulo' },
    } as unknown as Event;

    component.onCityChange(event);
    expect(component.form.get('city')?.value).toBe('São Paulo');

    // Ainda não chama updateLocation até aplicar o filtro
    expect(weatherDataService.updateLocation).not.toHaveBeenCalled();

    component.applyFilter();
    expect(weatherDataService.updateLocation).toHaveBeenCalledWith(-23.5505, -46.6333);
  });

  it('should validate dates and show warnings', () => {
    component.ngOnInit();
    component.form.patchValue({ start: '2025-08-27', end: '2025-12-15' });

    component.applyFilter();

    expect(component.warningMessage).toContain('ajustada');
  });

  it('should show warning when city is not found', () => {
    component.ngOnInit();
    component.form.patchValue({ city: 'Invalid City' });

    component.applyFilter();

    expect(component.warningMessage).toBe('Cidade não encontrada.');
  });

  it('should update loading state', fakeAsync(() => {
    component.ngOnInit();
    tick();

    loadingSubject.next(true);
    tick();
    fixture.detectChanges();

    expect(component.loading).toBe(true);
  }));

  it('should handle errors and clear table data', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();
    expect(component.tableData.length).toBeGreaterThan(0);

    errorSubject.next('Network error');
    tick();
    fixture.detectChanges();

    expect(component.warningMessage).toBe('Network error');
    expect(component.tableData.length).toBe(0);
    expect(component.displayedData.length).toBe(0);
  }));

  it('should track by row id', () => {
    const row: TableRow = { 
      id: 'test-id', 
      time: '2025-08-28T00:00:00', 
      temp: 20, 
      prec: 10,
      hum: 75,
      wind: 10,
      weathercode: 0
    };
    const result = component.trackByRow(0, row);
    expect(result).toBe('test-id');
  });

  it('should track by city name', () => {
    const city = { name: 'São Paulo', lat: -23.5505, lng: -46.6333 };
    const result = component.trackByCity(0, city);
    expect(result).toBe('São Paulo');
  });

  it('should show load more button when conditions are met', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();

    expect(component.showLoadMoreButton).toBe(true);
  }));

  it('should show all loaded message when no more data', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();

    component.loadMore();
    tick(300);
    fixture.detectChanges();

    expect(component.showAllLoadedMessage).toBe(true);
  }));

  it('should generate correct aria labels', () => {
    expect(component.getTemperatureAriaLabel(25)).toBe('Temperatura: 25 graus Celsius');
    expect(component.getPrecipitationAriaLabel(50)).toBe('Probabilidade de precipitação: 50 por cento');
    expect(component.getHumidityAriaLabel(75)).toBe('Umidade: 75 por cento');
    expect(component.getHumidityAriaLabel(null)).toBe('Umidade não disponível');
    expect(component.getWindSpeedAriaLabel(10)).toBe('Velocidade do vento: 10 quilômetros por hora');
    expect(component.getWindSpeedAriaLabel(null)).toBe('Velocidade do vento não disponível');
  });

  it('should handle null values in forecast data', fakeAsync(() => {
    const dataWithNulls = {
      ...mockForecastData,
      hourly: {
        ...mockForecastData.hourly,
        relative_humidity_2m: undefined,
        windspeed_10m: undefined,
      },
    };

    component.ngOnInit();
    tick();

    forecastSubject.next(dataWithNulls);
    tick();
    fixture.detectChanges();

    expect(component.tableData[0].hum).toBeNull();
    expect(component.tableData[0].wind).toBeNull();
  }));

  it('should unsubscribe on destroy', () => {
    component.ngOnInit();
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should handle onStartDateChange event', () => {
    component.ngOnInit();
    weatherDataService.updateLocation.mockClear();
    const event = {
      target: { value: '2025-09-01' },
    } as unknown as Event;

    component.onStartDateChange(event);
    expect(component.form.get('start')?.value).toBe('2025-09-01');
    expect(weatherDataService.updateLocation).not.toHaveBeenCalled();
  });

  it('should handle onEndDateChange event', () => {
    component.ngOnInit();
    weatherDataService.updateLocation.mockClear();
    const event = {
      target: { value: '2025-09-05' },
    } as unknown as Event;

    component.onEndDateChange(event);
    expect(component.form.get('end')?.value).toBe('2025-09-05');
    expect(weatherDataService.updateLocation).not.toHaveBeenCalled();
  });

  it('should not update when event target value is null', () => {
    component.ngOnInit();
    weatherDataService.updateLocation.mockClear();
    const initialStart = component.form.get('start')?.value;
    const event = {
      target: { value: null },
    } as unknown as Event;

    component.onStartDateChange(event);
    expect(component.form.get('start')?.value).toBe(initialStart);
    expect(weatherDataService.updateLocation).not.toHaveBeenCalled();
  });

  it('should validate and adjust start date when before min date', () => {
    component.ngOnInit();
    component.form.patchValue({ start: '2025-08-01', end: '2025-08-29' });

    component.applyFilter();

    expect(component.warningMessage).toContain('A data inicial foi ajustada');
  });

  it('should validate and adjust end date when after max date', () => {
    component.ngOnInit();
    component.form.patchValue({ start: '2025-08-28', end: '2025-12-20' });

    component.applyFilter();

    expect(component.warningMessage).toContain('A data final foi ajustada');
  });

  it('should validate and adjust when start date is after end date', () => {
    component.ngOnInit();
    component.form.patchValue({ start: '2025-09-01', end: '2025-08-29' });

    component.applyFilter();

    expect(component.warningMessage).toContain('Intervalo inválido');
  });

  it('should validate dates without warnings when dates are valid', () => {
    component.ngOnInit();
    component.form.patchValue({ start: '2025-08-28', end: '2025-08-29' });

    component.applyFilter();

    expect(component.warningMessage).toBe('');
  });

  it('should return cityOptions correctly', () => {
    component.ngOnInit();
    const options = component.cityOptions;

    expect(options.length).toBe(4);
    expect(options[0]).toEqual({ label: 'João Pessoa', value: 'João Pessoa' });
    expect(options[1]).toEqual({ label: 'São Paulo', value: 'São Paulo' });
  });

  it('should handle empty forecast data', fakeAsync(() => {
    const emptyData: OpenMeteoForecastRoot = {
      latitude: -7.1153,
      longitude: -34.8641,
      generationtime_ms: 0,
      utc_offset_seconds: 0,
      timezone: 'UTC',
      hourly: {
        time: [],
        temperature_2m: [],
        precipitation_probability: [],
        relative_humidity_2m: [],
        windspeed_10m: [],
        weathercode: [],
      },
      daily: { time: [], weathercode: [] },
      current_weather: {
        temperature: 25,
        windspeed: 10,
        weathercode: 0,
        time: '2025-08-28T12:00',
      },
    };

    component.ngOnInit();
    tick();

    forecastSubject.next(emptyData);
    tick();
    fixture.detectChanges();

    expect(component.tableData.length).toBe(0);
    expect(component.displayedData.length).toBe(0);
  }));

  it('should not load more when hasMoreData returns false', fakeAsync(() => {
    component.ngOnInit();
    tick();

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();

    // Load all data
    component.loadMore();
    tick(300);
    fixture.detectChanges();

    expect(component.displayedData.length).toBe(7);
    expect(component.hasMoreData()).toBe(false);

    // Try to load more when no more data
    const initialLength = component.displayedData.length;
    component.loadMore();
    tick(300);
    fixture.detectChanges();

    expect(component.displayedData.length).toBe(initialLength);
  }));

  it('should handle error being cleared (null)', fakeAsync(() => {
    component.ngOnInit();
    tick();

    // First set some data
    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();
    expect(component.tableData.length).toBeGreaterThan(0);

    // Then set error
    errorSubject.next('Network error');
    tick();
    fixture.detectChanges();

    expect(component.warningMessage).toBe('Network error');
    expect(component.tableData.length).toBe(0);
    expect(component.displayedData.length).toBe(0);

    // When error is cleared (null), the component doesn't clear the message
    // because applyFilter() is not called automatically
    errorSubject.next(null);
    tick();
    fixture.detectChanges();

    // Error message should remain as it was since applyFilter() is not called
    // The component only updates warningMessage when error is truthy or when applyFilter() is called
    expect(component.warningMessage).toBe('Network error');
  }));

  it('should process forecast data with undefined precipitation_probability', fakeAsync(() => {
    // Create data with precipitation_probability as undefined by using delete
    const dataWithUndefinedPrec = JSON.parse(JSON.stringify(mockForecastData));
    delete dataWithUndefinedPrec.hourly.precipitation_probability;

    component.ngOnInit();
    tick();

    forecastSubject.next(dataWithUndefinedPrec as OpenMeteoForecastRoot);
    tick();
    fixture.detectChanges();

    // When precipitation_probability is undefined, it should default to 0
    expect(component.tableData[0].prec).toBe(0);
    expect(component.tableData.length).toBeGreaterThan(0);
  }));

  it('should handle onCityChange with null value', () => {
    component.ngOnInit();
    const initialCity = component.form.get('city')?.value;
    const event = {
      target: { value: null },
    } as unknown as Event;

    component.onCityChange(event);
    expect(component.form.get('city')?.value).toBe(initialCity);
  });

  it('should show load more button only when conditions are met', fakeAsync(() => {
    component.ngOnInit();
    tick();

    // Initially no data, should not show
    expect(component.showLoadMoreButton).toBe(false);

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();

    // Has data and more to load, should show
    expect(component.showLoadMoreButton).toBe(true);

    // Set loading to true, should not show
    component.loading = true;
    expect(component.showLoadMoreButton).toBe(false);
  }));

  it('should show all loaded message only when conditions are met', fakeAsync(() => {
    component.ngOnInit();
    tick();

    // Initially no data, should not show
    expect(component.showAllLoadedMessage).toBe(false);

    forecastSubject.next(mockForecastData);
    tick();
    fixture.detectChanges();

    // Has data but more to load, should not show
    expect(component.showAllLoadedMessage).toBe(false);

    // Load all data
    component.loadMore();
    tick(300);
    fixture.detectChanges();

    // All data loaded, should show
    expect(component.showAllLoadedMessage).toBe(true);

    // Set loading to true, should not show
    component.loading = true;
    expect(component.showAllLoadedMessage).toBe(false);
  }));

  it('should handle all cities in onCityChange and update only after applyFilter', () => {
    component.ngOnInit();

    component.cities.forEach(city => {
      weatherDataService.updateLocation.mockClear();
      const event = {
        target: { value: city.name },
      } as unknown as Event;

      component.onCityChange(event);
      expect(component.form.get('city')?.value).toBe(city.name);
      expect(weatherDataService.updateLocation).not.toHaveBeenCalled();

      component.applyFilter();
      expect(weatherDataService.updateLocation).toHaveBeenCalledWith(city.lat, city.lng);
    });
  });

  it('should handle validateDates with all edge cases', () => {
    component.ngOnInit();

    // Test start date before min
    component.form.patchValue({ start: '2025-08-01', end: '2025-08-29' });
    component.applyFilter();
    expect(component.warningMessage).toContain('A data inicial foi ajustada');

    // Test end date after max
    component.form.patchValue({ start: '2025-08-28', end: '2025-12-20' });
    component.applyFilter();
    expect(component.warningMessage).toContain('A data final foi ajustada');

    // Test start after end
    component.form.patchValue({ start: '2025-09-01', end: '2025-08-29' });
    component.applyFilter();
    expect(component.warningMessage).toContain('Intervalo inválido');
  });
});
