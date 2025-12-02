import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'solutio-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public avgTemp!: number;
  public maxTemp!: number;
  public minTemp!: number;
  public percentChange!: number;

  public loading = false;

  constructor(
    private weatherDataService: WeatherDataService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.weatherDataService.getForecastData$()
      .pipe(
        takeUntil(this.destroy$),
        filter(data => data !== null)
      )
      .subscribe((data) => {
        if (data) {
          this.processKpiData(data);
        }
      });

    this.weatherDataService.getLoading$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
        this.cdr.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private processKpiData(res: any): void {
    const temps = res.hourly?.temperature_2m ?? [];

    if (!temps.length) {
      return;
    }

    this.avgTemp = this.round(
      temps.reduce((a: number, b: number) => a + b, 0) / temps.length
    );

    this.maxTemp = this.round(Math.max(...temps));

    this.minTemp = this.round(Math.min(...temps));

    const first = temps[0];
    const last = temps[temps.length - 1];
    this.percentChange = this.round(((last - first) / first) * 100);

    this.cdr.markForCheck();
  }

  private round(v: number): number {
    return Math.round(v * 10) / 10;
  }
}
