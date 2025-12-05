import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { Subject, takeUntil, filter } from 'rxjs';
import { AreaChartOptions } from '../../../../core/interfaces/chart.interfaces';

@Component({
  selector: 'solutio-v2-area',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public chartOptions!: AreaChartOptions;
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

    const times = hourly.time.map((t: string) => new Date(t).getTime());
    const temperatures = hourly.temperature_2m.map((temp: number) => Math.round(temp * 10) / 10);

    this.chartOptions = {
      series: [
        {
          name: 'Temperatura (°C)',
          data: temperatures.map((temp: number, index: number) => [times[index], temp])
        }
      ],
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        zoom: { enabled: true }
      },
      xaxis: {
        type: 'datetime',
        title: { text: 'Data/Hora' },
        labels: {
          datetimeUTC: false
        }
      },
      yaxis: {
        title: { text: 'Temperatura (°C)' }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yyyy HH:mm'
        },
        y: {
          formatter: (val: number) => `${val}°C`
        }
      },
      title: {
        text: 'Temperatura ao Longo do Tempo',
        align: 'center',
        style: { fontSize: '16px' }
      },
      markers: {
        size: 4,
        hover: {
          size: 6
        }
      },
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
            xaxis: {
              labels: {
                rotate: -45,
                style: { fontSize: '10px' }
              }
            },
            yaxis: {
              title: {
                style: { fontSize: '12px' }
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
            markers: {
              size: 3
            },
            stroke: {
              width: 1.5
            }
          }
        }
      ]
    };

    this.error = false;
    this.cdr.markForCheck();
  }
}
