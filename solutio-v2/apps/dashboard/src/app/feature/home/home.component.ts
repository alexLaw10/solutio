import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherDataService } from '../../core/services/weather-data.service';
import { Subject, takeUntil, filter } from 'rxjs';
import { TableComponent } from './components/table/table.component';
import { KpiComponent } from './components/kpi/kpi.component';
import { DonutsComponent } from './components/donuts/donuts.component';
import { BarComponent } from './components/bar/bar.component';
import { AreaComponent } from './components/area/area.component';

@Component({
  selector: 'solutio-v2-home',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    KpiComponent,
    DonutsComponent,
    BarComponent,
    AreaComponent
  ],
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
