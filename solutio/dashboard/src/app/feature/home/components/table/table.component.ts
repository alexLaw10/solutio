import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { Subject, takeUntil, filter } from 'rxjs';
import { TableRow, City } from '../../../../core/interfaces/table.interfaces';

const MIN_DATE = '2025-08-28';
const MAX_DATE = '2025-12-14';

@Component({
  selector: 'solutio-table',
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
  public cities: City[] = [
    { name: 'João Pessoa', lat: -7.1153, lng: -34.8641 },
    { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
    { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
    { name: 'Brasília', lat: -15.7942, lng: -47.8822 }
  ];

  public minDate = MIN_DATE;
  public maxDate = MAX_DATE;

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
      start: ['2025-08-28'],
      end: ['2025-08-29'],
      city: ['João Pessoa']
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

  public onStartDateChange(event: any): void {
    const value = event?.detail || event?.target?.value || event;
    if (typeof value === 'string') {
      this.form.patchValue({ start: value });
      this.applyFilter();
    }
  }

  public onEndDateChange(event: any): void {
    const value = event?.detail || event?.target?.value || event;
    if (typeof value === 'string') {
      this.form.patchValue({ end: value });
      this.applyFilter();
    }
  }

  public onCityChange(event: any): void {
    const value = event?.detail || event?.target?.value || event;
    if (typeof value === 'string') {
      this.form.patchValue({ city: value });
      this.applyFilter();
    }
  }

  public applyFilter(): void {
    const { start, end, city } = this.form.value;

    const validation = this.validateDates(start, end);
    this.warningMessage = validation.warning;

    const selectedCity = this.cities.find(c => c.name === city);
    if (!selectedCity) {
      this.warningMessage = 'Cidade não encontrada.';
      return;
    }

    const { lat, lng } = selectedCity;
    this.weatherDataService.updateLocation(lat, lng);
  }

  private processForecastData(res: any): void {
    const hourly = res.hourly;

    const rows = hourly.time.map((t: string, index: number) => ({
      id: t + index,
      time: t,
      temp: hourly.temperature_2m[index],
      prec: hourly.precipitation_probability[index] ?? 0,
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
    const minDateObj = new Date(MIN_DATE);
    const maxDateObj = new Date(MAX_DATE);
    let warning = '';

    if (startDate < minDateObj) {
      warning += 'A data inicial foi ajustada para 28/08/2025. ';
      startDate = minDateObj;
    }

    if (endDate > maxDateObj) {
      warning += 'A data final foi ajustada para 14/12/2025. ';
      endDate = maxDateObj;
    }

    if (startDate > endDate) {
      warning += 'Intervalo inválido. Intervalo ajustado automaticamente. ';
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
    return `Temperatura: ${temp} graus Celsius`;
  }

  public getPrecipitationAriaLabel(prec: number): string {
    return `Probabilidade de precipitação: ${prec} por cento`;
  }

  public getHumidityAriaLabel(hum: number | null): string {
    if (hum === null || hum === undefined) {
      return 'Umidade não disponível';
    }
    return `Umidade: ${hum} por cento`;
  }

  public getWindSpeedAriaLabel(wind: number | null): string {
    if (wind === null || wind === undefined) {
      return 'Velocidade do vento não disponível';
    }
    return `Velocidade do vento: ${wind} quilômetros por hora`;
  }
}
