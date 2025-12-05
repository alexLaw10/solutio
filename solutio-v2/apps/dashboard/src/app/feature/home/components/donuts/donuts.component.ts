import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { WeatherDataService } from '../../../../core/services/weather-data.service';
import { Subject, takeUntil, filter } from 'rxjs';
import { DonutOptions } from '../../../../core/interfaces/chart.interfaces';

@Component({
  selector: 'solutio-v2-donut',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './donuts.component.html',
  styleUrls: ['./donuts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('chart') public chart!: ChartComponent;

  public donutOptions!: DonutOptions;
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
          this.processDonutData(data);
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

  private processDonutData(res: any): void {
    const currentTemp = res.current_weather?.temperature;

    if (currentTemp === undefined || currentTemp === null) {
      this.error = true;
      this.cdr.markForCheck();
      return;
    }

    const tempAtual = Math.round(currentTemp * 10) / 10;
    const restante = Math.max(0, 50 - tempAtual);

    this.donutOptions = {
      series: [tempAtual, restante],
      chart: {
        type: 'donut',
        height: 320,
        toolbar: { show: false }
      },
      labels: [
        `Temperatura Atual (${tempAtual}°C)`,
        `Restante até 50°C (${restante}°C)`
      ],
      legend: {
        position: 'bottom'
      },
      responsive: [
            {
              breakpoint: 768,
              options: {
                chart: { height: 280 },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        name: {
                          fontSize: '14px'
                        },
                        value: {
                          fontSize: '18px'
                        }
                      }
                    }
                  }
                }
              }
            },
            {
              breakpoint: 576,
              options: {
                chart: { height: 250 },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        name: {
                          fontSize: '12px'
                        },
                        value: {
                          fontSize: '16px'
                        }
                      }
                    }
                  }
                },
                legend: {
                  fontSize: '12px'
                }
              }
            },
            {
              breakpoint: 400,
              options: {
                chart: { height: 220 }
              }
            }
          ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontWeight: 600
              },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: 700,
                formatter: (val: string) => `${val}°C`
              }
            }
          }
        }
      }
    };

    this.error = false;
    this.cdr.markForCheck();
  }
}
