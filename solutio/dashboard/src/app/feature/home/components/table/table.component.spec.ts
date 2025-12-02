import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TableComponent } from './table.component';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { BehaviorSubject } from 'rxjs';
import { OpenMeteoForecastRoot } from '../../../../core/interfaces/open-meteo-forecast';
import { TableRow, City } from '../../../../core/interfaces/table.interfaces';
import { SharedModule } from '../../../../shared/shared.module';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let weatherDataService: jest.Mocked<WeatherDataService>;
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
        '2025-08-28T02:00',
        '2025-08-28T03:00',
        '2025-08-28T04:00',
        '2025-08-28T05:00',
        '2025-08-28T06:00'
      ],
      temperature_2m: [25.5, 26.0, 26.5, 27.0, 27.5, 28.0, 28.5],
      precipitation_probability: [10, 20, 15, 25, 30, 20, 10],
      relative_humidity_2m: [65, 66, 67, 68, 69, 70, 71],
      windspeed_10m: [12.3, 13.4, 14.5, 15.6, 16.7, 17.8, 18.9],
      weathercode: [0, 1, 2, 3, 0, 1, 2]
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
      getError$: jest.fn(() => errorSubject.asObservable()),
      updateLocation: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [ReactiveFormsModule, SharedModule],
      providers: [
        FormBuilder,
        ChangeDetectorRef,
        { provide: WeatherDataService, useValue: weatherDataServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    weatherDataService = TestBed.inject(WeatherDataService) as jest.Mocked<WeatherDataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form with default values', () => {
      component.ngOnInit();

      expect(component.form.get('start')?.value).toBe('2025-08-28');
      expect(component.form.get('end')?.value).toBe('2025-08-29');
      expect(component.form.get('city')?.value).toBe('João Pessoa');
    });

    it('should call applyFilter on init', () => {
      jest.spyOn(component, 'applyFilter');
      component.ngOnInit();
      expect(component.applyFilter).toHaveBeenCalled();
    });

    it('should subscribe to forecast data', () => {
      component.ngOnInit();
      forecastDataSubject.next(mockForecastData);
      fixture.detectChanges();

      expect(component.tableData.length).toBeGreaterThan(0);
    });

    it('should subscribe to loading state', () => {
      component.ngOnInit();
      loadingSubject.next(true);
      fixture.detectChanges();

      expect(component.loading).toBe(true);
    });

    it('should subscribe to error state', () => {
      component.ngOnInit();
      fixture.detectChanges();
      jest.clearAllMocks();
      
      const errorMessage = 'Test error';
      errorSubject.next(errorMessage);
      fixture.detectChanges();

      expect(component.warningMessage).toBe(errorMessage);
      expect(component.tableData).toEqual([]);
      expect(component.displayedData).toEqual([]);
    });
  });

  describe('applyFilter', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
      jest.clearAllMocks();
    });

    it('should update location when valid city is selected', () => {
      component.form.patchValue({ city: 'São Paulo' });
      component.applyFilter();

      expect(weatherDataService.updateLocation).toHaveBeenCalledWith(-23.5505, -46.6333);
    });

    it('should set warning message when city is not found', () => {
      component.warningMessage = '';
      component.form.patchValue({ city: 'Invalid City' });
      component.applyFilter();

      expect(component.warningMessage).toBe('Cidade não encontrada.');
      expect(weatherDataService.updateLocation).not.toHaveBeenCalled();
    });

    it('should validate dates and show warnings for start date', () => {
      component.form.patchValue({
        start: '2025-08-27',
        end: '2025-08-29',
        city: 'João Pessoa'
      });
      component.applyFilter();

      expect(component.warningMessage).toContain('A data inicial foi ajustada');
    });

    it('should validate dates and show warnings for end date', () => {
      component.form.patchValue({
        start: '2025-08-28',
        end: '2025-12-15',
        city: 'João Pessoa'
      });
      component.applyFilter();

      expect(component.warningMessage).toContain('A data final foi ajustada');
    });

    it('should validate dates and show warnings for invalid interval', () => {
      component.form.patchValue({
        start: '2025-08-30',
        end: '2025-08-29',
        city: 'João Pessoa'
      });
      component.applyFilter();

      expect(component.warningMessage).toContain('Intervalo inválido');
    });

    it('should validate dates and show multiple warnings', () => {
      component.form.patchValue({
        start: '2025-08-27',
        end: '2025-12-15',
        city: 'João Pessoa'
      });
      component.applyFilter();

      expect(component.warningMessage).toContain('A data inicial foi ajustada');
      expect(component.warningMessage).toContain('A data final foi ajustada');
    });

    it('should not show warnings for valid dates', () => {
      component.form.patchValue({
        start: '2025-08-28',
        end: '2025-08-29',
        city: 'João Pessoa'
      });
      component.warningMessage = '';
      component.applyFilter();

      expect(component.warningMessage).toBe('');
    });

    it('should handle invalid interval with both dates out of range', () => {
      component.form.patchValue({
        start: '2025-08-27',
        end: '2025-08-26',
        city: 'João Pessoa'
      });
      component.applyFilter();

      expect(component.warningMessage).toContain('A data inicial foi ajustada');
      expect(component.warningMessage).toContain('Intervalo inválido');
    });
  });

  describe('processForecastData', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should process forecast data into table rows', () => {
      forecastDataSubject.next(mockForecastData);
      fixture.detectChanges();

      expect(component.tableData.length).toBe(7);
      expect(component.displayedData.length).toBe(5);
      expect(component.tableData[0].time).toBe('2025-08-28T00:00');
      expect(component.tableData[0].temp).toBe(25.5);
      expect(component.tableData[0].prec).toBe(10);
      expect(component.tableData[0].hum).toBe(65);
      expect(component.tableData[0].wind).toBe(12.3);
      expect(component.tableData[0].weathercode).toBe(0);
    });

    it('should set displayedData to first page', () => {
      forecastDataSubject.next(mockForecastData);
      fixture.detectChanges();

      expect(component.displayedData.length).toBe(5);
      expect(component.displayedData).toEqual(component.tableData.slice(0, 5));
    });

    it('should handle undefined precipitation_probability', () => {
      const dataWithUndefinedPrec: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: {
          ...mockForecastData.hourly,
          precipitation_probability: [undefined as any, 20, undefined as any]
        }
      };

      forecastDataSubject.next(dataWithUndefinedPrec);
      fixture.detectChanges();

      expect(component.tableData[0].prec).toBe(0);
      expect(component.tableData[1].prec).toBe(20);
      expect(component.tableData[2].prec).toBe(0);
    });

    it('should handle null precipitation_probability', () => {
      const dataWithNullPrec: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: {
          ...mockForecastData.hourly,
          precipitation_probability: [null as any, 15]
        }
      };

      forecastDataSubject.next(dataWithNullPrec);
      fixture.detectChanges();

      expect(component.tableData[0].prec).toBe(0);
      expect(component.tableData[1].prec).toBe(15);
    });

    it('should handle missing relative_humidity_2m', () => {
      const dataWithoutHumidity: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: {
          ...mockForecastData.hourly,
          relative_humidity_2m: undefined
        }
      };

      forecastDataSubject.next(dataWithoutHumidity);
      fixture.detectChanges();

      expect(component.tableData[0].hum).toBeNull();
    });

    it('should handle missing windspeed_10m', () => {
      const dataWithoutWind: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: {
          ...mockForecastData.hourly,
          windspeed_10m: undefined
        }
      };

      forecastDataSubject.next(dataWithoutWind);
      fixture.detectChanges();

      expect(component.tableData[0].wind).toBeNull();
    });

    it('should handle missing weathercode', () => {
      const dataWithoutWeathercode: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: {
          ...mockForecastData.hourly,
          weathercode: undefined
        }
      };

      forecastDataSubject.next(dataWithoutWeathercode);
      fixture.detectChanges();

      expect(component.tableData[0].weathercode).toBeNull();
    });

    it('should process all new fields correctly', () => {
      const dataWithAllFields: OpenMeteoForecastRoot = {
        ...mockForecastData,
        hourly: {
          time: ['2025-08-28T00:00'],
          temperature_2m: [25.5],
          precipitation_probability: [30],
          relative_humidity_2m: [75],
          windspeed_10m: [15.5],
          weathercode: [1]
        }
      };

      forecastDataSubject.next(dataWithAllFields);
      fixture.detectChanges();

      expect(component.tableData[0].hum).toBe(75);
      expect(component.tableData[0].wind).toBe(15.5);
      expect(component.tableData[0].weathercode).toBe(1);
    });
  });

  describe('loadMore', () => {
    beforeEach(() => {
      component.ngOnInit();
      forecastDataSubject.next(mockForecastData);
      fixture.detectChanges();
    });

    it('should load more items', (done) => {
      expect(component.displayedData.length).toBe(5);
      component.loadingMore = false;

      component.loadMore();

      expect(component.loadingMore).toBe(true);
      setTimeout(() => {
        expect(component.displayedData.length).toBe(7);
        expect(component.loadingMore).toBe(false);
        done();
      }, 350);
    });

    it('should not load more if loadingMore is true', () => {
      component.loadingMore = true;
      const initialLength = component.displayedData.length;

      component.loadMore();

      expect(component.displayedData.length).toBe(initialLength);
    });

    it('should not load more if no more data', () => {
      component.loadingMore = false;
      component.displayedData = [...component.tableData];
      const initialLength = component.displayedData.length;

      component.loadMore();

      expect(component.displayedData.length).toBe(initialLength);
      expect(component.loadingMore).toBe(false);
    });

    it('should not load more if both conditions are false (hasMoreData returns false)', () => {
      component.loadingMore = false;
      component.tableData = Array(3).fill(null).map((_, i) => ({
        id: `id-${i}`,
        time: `2025-08-28T${i}:00`,
        temp: 25,
        prec: 10,
        hum: null,
        wind: null,
        weathercode: null
      }));
      component.displayedData = [...component.tableData];
      const initialLength = component.displayedData.length;

      component.loadMore();

      expect(component.displayedData.length).toBe(initialLength);
    });
  });

  describe('hasMoreData', () => {
    beforeEach(() => {
      component.ngOnInit();
      forecastDataSubject.next(mockForecastData);
      fixture.detectChanges();
    });

    it('should return true when there is more data', () => {
      expect(component.hasMoreData()).toBe(true);
    });

    it('should return false when all data is displayed', () => {
      component.displayedData = [...component.tableData];
      expect(component.hasMoreData()).toBe(false);
    });

    it('should return false when displayedData length equals tableData length', () => {
      component.tableData = Array(3).fill(null).map((_, i) => ({
        id: `id-${i}`,
        time: `2025-08-28T${i}:00`,
        temp: 25,
        prec: 10,
        hum: null,
        wind: null,
        weathercode: null
      }));
      component.displayedData = [...component.tableData];
      expect(component.hasMoreData()).toBe(false);
    });

    it('should return true when displayedData length is less than tableData length', () => {
      component.tableData = Array(10).fill(null).map((_, i) => ({
        id: `id-${i}`,
        time: `2025-08-28T${i}:00`,
        temp: 25,
        prec: 10,
        hum: null,
        wind: null,
        weathercode: null
      }));
      component.displayedData = component.tableData.slice(0, 3);
      expect(component.hasMoreData()).toBe(true);
    });
  });

  describe('trackByRow', () => {
    it('should return row id', () => {
      const row: TableRow = { id: 'test-id', time: '2025-08-28T00:00', temp: 25.5, prec: 10, hum: null, wind: null, weathercode: null };
      expect(component.trackByRow(0, row)).toBe('test-id');
    });
  });

  describe('trackByCity', () => {
    it('should return city name', () => {
      const city: City = { name: 'Test City', lat: 0, lng: 0 };
      expect(component.trackByCity(0, city)).toBe('Test City');
    });
  });

  describe('getters', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    describe('showLoadMoreButton', () => {
      it('should return true when conditions are met', () => {
        component.loading = false;
        component.tableData = Array(10).fill(null).map((_, i) => ({
          id: `id-${i}`,
          time: `2025-08-28T${i}:00`,
          temp: 25,
          prec: 10,
          hum: null,
          wind: null,
          weathercode: null
        }));
        component.displayedData = component.tableData.slice(0, 5);

        expect(component.showLoadMoreButton).toBe(true);
      });

      it('should return false when loading is true', () => {
        component.loading = true;
        component.tableData = Array(10).fill(null).map((_, i) => ({
          id: `id-${i}`,
          time: `2025-08-28T${i}:00`,
          temp: 25,
          prec: 10,
          hum: null,
          wind: null,
          weathercode: null
        }));
        component.displayedData = component.tableData.slice(0, 5);

        expect(component.showLoadMoreButton).toBe(false);
      });

      it('should return false when tableData is empty', () => {
        component.loading = false;
        component.tableData = [];
        component.displayedData = [];

        expect(component.showLoadMoreButton).toBe(false);
      });

      it('should return false when hasMoreData is false', () => {
        component.loading = false;
        component.tableData = Array(5).fill(null).map((_, i) => ({
          id: `id-${i}`,
          time: `2025-08-28T${i}:00`,
          temp: 25,
          prec: 10,
          hum: null,
          wind: null,
          weathercode: null
        }));
        component.displayedData = [...component.tableData];

        expect(component.showLoadMoreButton).toBe(false);
      });
    });

    describe('showAllLoadedMessage', () => {
      it('should return true when conditions are met', () => {
        component.loading = false;
        component.tableData = Array(5).fill(null).map((_, i) => ({
          id: `id-${i}`,
          time: `2025-08-28T${i}:00`,
          temp: 25,
          prec: 10,
          hum: null,
          wind: null,
          weathercode: null
        }));
        component.displayedData = [...component.tableData];

        expect(component.showAllLoadedMessage).toBe(true);
      });

      it('should return false when loading is true', () => {
        component.loading = true;
        component.tableData = Array(5).fill(null).map((_, i) => ({
          id: `id-${i}`,
          time: `2025-08-28T${i}:00`,
          temp: 25,
          prec: 10,
          hum: null,
          wind: null,
          weathercode: null
        }));
        component.displayedData = [...component.tableData];

        expect(component.showAllLoadedMessage).toBe(false);
      });

      it('should return false when hasMoreData is true', () => {
        component.loading = false;
        component.tableData = Array(10).fill(null).map((_, i) => ({
          id: `id-${i}`,
          time: `2025-08-28T${i}:00`,
          temp: 25,
          prec: 10,
          hum: null,
          wind: null,
          weathercode: null
        }));
        component.displayedData = component.tableData.slice(0, 5);

        expect(component.showAllLoadedMessage).toBe(false);
      });

      it('should return false when tableData is empty', () => {
        component.loading = false;
        component.tableData = [];
        component.displayedData = [];

        expect(component.showAllLoadedMessage).toBe(false);
      });
    });

    it('should return correct cityOptions', () => {
      const options = component.cityOptions;
      expect(options.length).toBe(4);
      expect(options[0]).toEqual({ value: 'João Pessoa', label: 'João Pessoa' });
      expect(options[1]).toEqual({ value: 'São Paulo', label: 'São Paulo' });
      expect(options[2]).toEqual({ value: 'Rio de Janeiro', label: 'Rio de Janeiro' });
      expect(options[3]).toEqual({ value: 'Brasília', label: 'Brasília' });
    });
  });

  describe('event handlers', () => {
    beforeEach(() => {
      component.ngOnInit();
      jest.clearAllMocks();
    });

    describe('onStartDateChange', () => {
      it('should handle start date change with detail', () => {
        const event = { detail: '2025-08-30' } as CustomEvent<string>;
        jest.spyOn(component, 'applyFilter');

        component.onStartDateChange(event);

        expect(component.form.get('start')?.value).toBe('2025-08-30');
        expect(component.applyFilter).toHaveBeenCalled();
      });

      it('should handle start date change with target.value', () => {
        const event = { target: { value: '2025-08-30' } } as any;
        jest.spyOn(component, 'applyFilter');

        component.onStartDateChange(event);

        expect(component.form.get('start')?.value).toBe('2025-08-30');
        expect(component.applyFilter).toHaveBeenCalled();
      });

      it('should handle start date change with string value', () => {
        const event = '2025-08-30' as any;
        jest.spyOn(component, 'applyFilter');

        component.onStartDateChange(event);

        expect(component.form.get('start')?.value).toBe('2025-08-30');
        expect(component.applyFilter).toHaveBeenCalled();
      });

      it('should not apply filter when value is not string', () => {
        const event = { detail: 12345 } as any;
        jest.spyOn(component, 'applyFilter');

        component.onStartDateChange(event);

        expect(component.applyFilter).not.toHaveBeenCalled();
      });

      it('should handle undefined event', () => {
        const event = undefined as any;
        jest.spyOn(component, 'applyFilter');

        component.onStartDateChange(event);

        expect(component.applyFilter).not.toHaveBeenCalled();
      });
    });

    describe('onEndDateChange', () => {
      it('should handle end date change with detail', () => {
        const event = { detail: '2025-09-01' } as CustomEvent<string>;
        jest.spyOn(component, 'applyFilter');

        component.onEndDateChange(event);

        expect(component.form.get('end')?.value).toBe('2025-09-01');
        expect(component.applyFilter).toHaveBeenCalled();
      });

      it('should handle end date change with target.value', () => {
        const event = { target: { value: '2025-09-01' } } as any;
        jest.spyOn(component, 'applyFilter');

        component.onEndDateChange(event);

        expect(component.form.get('end')?.value).toBe('2025-09-01');
        expect(component.applyFilter).toHaveBeenCalled();
      });

      it('should handle end date change with string value', () => {
        const event = '2025-09-01' as any;
        jest.spyOn(component, 'applyFilter');

        component.onEndDateChange(event);

        expect(component.form.get('end')?.value).toBe('2025-09-01');
        expect(component.applyFilter).toHaveBeenCalled();
      });

      it('should not apply filter when value is not string', () => {
        const event = { detail: 12345 } as any;
        jest.spyOn(component, 'applyFilter');

        component.onEndDateChange(event);

        expect(component.applyFilter).not.toHaveBeenCalled();
      });
    });

    describe('onCityChange', () => {
      it('should handle city change with detail', () => {
        const event = { detail: 'São Paulo' } as CustomEvent<string>;
        jest.spyOn(component, 'applyFilter');

        component.onCityChange(event);

        expect(component.form.get('city')?.value).toBe('São Paulo');
        expect(component.applyFilter).toHaveBeenCalled();
      });

      it('should handle city change with target.value', () => {
        const event = { target: { value: 'Rio de Janeiro' } } as any;
        jest.spyOn(component, 'applyFilter');

        component.onCityChange(event);

        expect(component.form.get('city')?.value).toBe('Rio de Janeiro');
        expect(component.applyFilter).toHaveBeenCalled();
      });

      it('should handle city change with string value', () => {
        const event = 'Brasília' as any;
        jest.spyOn(component, 'applyFilter');

        component.onCityChange(event);

        expect(component.form.get('city')?.value).toBe('Brasília');
        expect(component.applyFilter).toHaveBeenCalled();
      });

      it('should not apply filter when value is not string', () => {
        const event = { detail: 12345 } as any;
        jest.spyOn(component, 'applyFilter');

        component.onCityChange(event);

        expect(component.applyFilter).not.toHaveBeenCalled();
      });
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
