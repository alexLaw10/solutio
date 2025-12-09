import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { OpenMeteoService } from './open.service';
import { OpenMeteoForecastRoot } from '../interfaces/open-meteo-forecast';
import { ERROR_MESSAGES } from '../constants/messages';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  private forecastData$ = new BehaviorSubject<OpenMeteoForecastRoot | null>(null);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);
  
  private currentLocation = { lat: -7.1153, lng: -34.8641 };
  private initialized = false;

  constructor(private openMeteo: OpenMeteoService) {}

  public getForecastData$(): Observable<OpenMeteoForecastRoot | null> {
    return this.forecastData$.asObservable();
  }

  public getLoading$(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  public getError$(): Observable<string | null> {
    return this.error$.asObservable();
  }

  public clearError(): void {
    this.error$.next(null);
  }

  public getCurrentLocation(): { lat: number; lng: number } {
    return { ...this.currentLocation };
  }

  public updateLocation(lat: number, lng: number): void {
    if (this.currentLocation.lat === lat && this.currentLocation.lng === lng && this.initialized) {
      return;
    }

    this.currentLocation = { lat, lng };
    this.loadForecast(lat, lng);
  }

  public refreshForecast(): void {
    this.loadForecast(this.currentLocation.lat, this.currentLocation.lng);
  }

  public initialize(): void {
    if (!this.initialized) {
      this.loadForecast(this.currentLocation.lat, this.currentLocation.lng);
      this.initialized = true;
    }
  }

  private loadForecast(lat: number, lng: number): void {
    this.loading$.next(true);
    this.error$.next(null);

    this.openMeteo.getForecast(lat, lng)
      .pipe(
        tap((data) => {
          this.forecastData$.next(data);
          this.loading$.next(false);
        }),
        catchError((error) => {
          this.error$.next(error.message || ERROR_MESSAGES.LOAD_WEATHER_DATA);
          this.loading$.next(false);
          return throwError(() => error);
        })
      )
      .subscribe({
        error: () => {
          // Error already handled in catchError
        }
      });
  }
}
