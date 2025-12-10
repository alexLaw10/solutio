import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { Subject, takeUntil, filter } from 'rxjs';
import { TableRow, City } from '../../../../core/interfaces/table.interfaces';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { PercentagePipe } from '../../../../shared/pipes/percentage.pipe';
import { SpeedPipe } from '../../../../shared/pipes/speed.pipe';
import { FilterComponent } from '../filter/filter.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ERROR_MESSAGES, VALIDATION_MESSAGES, INFO_MESSAGES } from '../../../../core/constants/messages';
import { CITIES, DEFAULT_CITY } from '../../../../core/constants/cities';
import { DATE_CONSTANTS } from '../../../../core/constants/dates';
import { ARIA_LABEL_TEMPLATES } from '../../../../core/constants/units';

type ForecastHourly = {
  time: string[];
  temperature_2m: number[];
  precipitation_probability?: number[];
  relative_humidity_2m?: number[];
  windspeed_10m?: number[];
  weathercode?: number[];
};

@Component({
  selector: 'solutio-v2-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateFormatPipe,
    PercentagePipe,
    SpeedPipe,
    FilterComponent,
    SpinnerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public form!: FormGroup;
  public tableData: TableRow[] = [];
  public displayedData: TableRow[] = [];
  public warningMessage = '';
  public loading = false;
  public loadingMore = false;
  private readonly itemsPerPage = 5;
  public cities: City[] = CITIES;
  public minDate = DATE_CONSTANTS.MIN_DATE;
  public maxDate = DATE_CONSTANTS.MAX_DATE;

  public get cityOptions(): Array<{ label: string; value: string }> {
    return this.cities.map(city => ({
      label: city.name,
      value: city.name
    }));
  }

  constructor(
    private fb: FormBuilder,
    private weatherDataService: WeatherDataService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.form = this.fb.group({
      start: [DATE_CONSTANTS.DEFAULT_START_DATE],
      end: [DATE_CONSTANTS.DEFAULT_END_DATE],
      city: [DEFAULT_CITY]
    });

    this.weatherDataService.getForecastData$()
      .pipe(
        takeUntil(this.destroy$),
        filter(data => data !== null)
      )
      .subscribe((data) => {
        if (data) {
          this.processForecastData(data);
        }
      });

    this.weatherDataService.getLoading$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
        this.cdr.markForCheck();
      });

    this.weatherDataService.getError$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.warningMessage = error;
          this.tableData = [];
          this.displayedData = [];
          this.cdr.markForCheck();
        }
      });
    
    this.applyFilter();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    if (value) {
      this.form.patchValue({ start: value });
      this.cdr.markForCheck();
    }
  }

  public onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    if (value) {
      this.form.patchValue({ end: value });
      this.cdr.markForCheck();
    }
  }

  public onCityChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    
    if (value && value !== '') {
      this.form.patchValue({ city: value });
      this.cdr.markForCheck();
    }
  }



  public applyFilter(): void {
    const { start, end, city } = this.form.value;

    const validation = this.validateDates(start, end);
    this.warningMessage = validation.warning;

    const selectedCity = this.cities.find(c => c.name === city);
    if (!selectedCity) {
      this.warningMessage = ERROR_MESSAGES.CITY_NOT_FOUND;
      this.cdr.markForCheck();
      return;
    }

    const { lat, lng } = selectedCity;
    this.weatherDataService.updateLocation(lat, lng);
    this.cdr.markForCheck();
  }

  private processForecastData(res: { hourly: ForecastHourly }): void {
    const hourly = res.hourly;

    const rows = hourly.time.map((t: string, index: number) => ({
      id: t + index,
      time: t,
      temp: hourly.temperature_2m[index],
      prec: hourly.precipitation_probability?.[index] ?? 0,
      hum: hourly.relative_humidity_2m?.[index] ?? null,
      wind: hourly.windspeed_10m?.[index] ?? null,
      weathercode: hourly.weathercode?.[index] ?? null,
    }));

    this.tableData = rows;
    this.displayedData = rows.slice(0, this.itemsPerPage);
    this.cdr.markForCheck();
  }

  public loadMore(): void {
    if (this.loadingMore || !this.hasMoreData()) {
      return;
    }

    this.loadingMore = true;
    this.cdr.markForCheck();

    setTimeout(() => {
      const currentLength = this.displayedData.length;
      const nextItems = this.tableData.slice(currentLength, currentLength + this.itemsPerPage);
      this.displayedData = [...this.displayedData, ...nextItems];
      this.loadingMore = false;
      this.cdr.markForCheck();
    }, 300);
  }

  public hasMoreData(): boolean {
    return this.displayedData.length < this.tableData.length;
  }

  private validateDates(start: string, end: string) {
    let startDate = new Date(start);
    let endDate = new Date(end);
    const minDateObj = new Date(DATE_CONSTANTS.MIN_DATE);
    const maxDateObj = new Date(DATE_CONSTANTS.MAX_DATE);
    let warning = '';

    if (startDate < minDateObj) {
      warning += VALIDATION_MESSAGES.START_DATE_ADJUSTED;
      startDate = minDateObj;
    }

    if (endDate > maxDateObj) {
      warning += VALIDATION_MESSAGES.END_DATE_ADJUSTED;
      endDate = maxDateObj;
    }

    if (startDate > endDate) {
      warning += VALIDATION_MESSAGES.INVALID_DATE_RANGE;
      startDate = minDateObj;
      endDate = maxDateObj;
    }

    return {
      validStart: startDate.toISOString().split('T')[0],
      validEnd: endDate.toISOString().split('T')[0],
      warning
    };
  }

  public trackByRow(_: number, item: TableRow): string {
    return item.id;
  }

  public trackByCity(_: number, item: City): string {
    return item.name;
  }

  public get showLoadMoreButton(): boolean {
    return !this.loading && this.tableData.length > 0 && this.hasMoreData();
  }

  public get showAllLoadedMessage(): boolean {
    return !this.loading && !this.hasMoreData() && this.tableData.length > 0;
  }

  public getTemperatureAriaLabel(temp: number): string {
    return ARIA_LABEL_TEMPLATES.TEMPERATURE(temp);
  }

  public getPrecipitationAriaLabel(prec: number): string {
    return ARIA_LABEL_TEMPLATES.PRECIPITATION(prec);
  }

  public getHumidityAriaLabel(hum: number | null): string {
    if (hum === null || hum === undefined) {
      return INFO_MESSAGES.UNAVAILABLE_HUMIDITY;
    }
    return ARIA_LABEL_TEMPLATES.HUMIDITY(hum);
  }

  public getWindSpeedAriaLabel(wind: number | null): string {
    if (wind === null || wind === undefined) {
      return INFO_MESSAGES.UNAVAILABLE_WIND_SPEED;
    }
    return ARIA_LABEL_TEMPLATES.WIND_SPEED(wind);
  }
}
