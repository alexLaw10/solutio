import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { WeatherDataService } from '../../../core/services/weather-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'solutio-alert',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public errorMessage: string | null = null;
  public showAlert = false;

  constructor(
    private weatherDataService: WeatherDataService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.weatherDataService.getError$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorMessage = error;
          this.showAlert = true;
          this.cdr.markForCheck();
        } else {
          this.errorMessage = null;
          this.showAlert = false;
          this.cdr.markForCheck();
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public closeAlert(): void {
    this.showAlert = false;
    this.errorMessage = null;
    this.weatherDataService.clearError();
    this.cdr.markForCheck();
  }
}

