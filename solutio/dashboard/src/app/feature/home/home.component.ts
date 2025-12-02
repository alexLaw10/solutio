import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherDataService } from '../../core/services/weather-data.service';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'solutio-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public currentTemp!: number;

  constructor(
    private weatherDataService: WeatherDataService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.weatherDataService.initialize();

    this.weatherDataService.getForecastData$()
      .pipe(
        takeUntil(this.destroy$),
        filter(data => data !== null)
      )
      .subscribe((data) => {
        if (data) {
          this.currentTemp = data.current_weather?.temperature || 0;
          this.cdr.markForCheck();
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

