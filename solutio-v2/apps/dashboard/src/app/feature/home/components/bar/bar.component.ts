import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { Subject, takeUntil, filter } from 'rxjs';
import { BarChartOptions } from '../../../../core/interfaces/chart.interfaces';

@Component({
  selector: 'solutio-v2-bar',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public chartOptions!: BarChartOptions;
  public loading = false;
  public error = false;

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
          this.processChartData(data);
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
        this.error = !!error;
        this.cdr.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private processChartData(res: any): void {
    const hourly = res.hourly;

    if (!hourly || !hourly.time || !hourly.temperature_2m) {
      this.error = true;
      this.cdr.markForCheck();
      return;
    }

    const tempByDay: Record<string, number[]> = {};

    hourly.time.forEach((timestamp: string, i: number) => {
      const date = timestamp.split('T')[0];
      if (!tempByDay[date]) {
        tempByDay[date] = [];
      }
      tempByDay[date].push(hourly.temperature_2m[i]);
    });

    const categories = Object.keys(tempByDay).sort();
      const seriesData = categories.map(date => {
        const temps = tempByDay[date];
        const avg = temps.reduce((a: number, b: number) => a + b, 0) / temps.length;
        return Math.round(avg * 10) / 10;
      });

    this.chartOptions = {
      series: [
        { name: 'Temperatura Média (°C)', data: seriesData }
      ],
      chart: { type: 'bar', height: 350, toolbar: { show: false } },
      xaxis: { categories, title: { text: 'Data' } },
      yaxis: { title: { text: 'Temperatura (°C)' } },
      dataLabels: { enabled: true, formatter: (val: number) => `${val}°C` },
      title: { text: 'Temperatura Média Diária', align: 'center', style: { fontSize: '16px' } },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300
            },
            title: {
              style: { fontSize: '14px' }
            },
            dataLabels: {
              style: { fontSize: '10px' }
            },
            xaxis: {
              labels: {
                rotate: -45,
                style: { fontSize: '10px' }
              }
            }
          }
        },
        {
          breakpoint: 576,
          options: {
            chart: {
              height: 250
            },
            title: {
              style: { fontSize: '12px' }
            },
            dataLabels: {
              enabled: false
            }
          }
        }
      ]
    };

    this.error = false;
    this.cdr.markForCheck();
  }
}
