import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  OpenMeteoForecastRoot,
  OpenMeteoGfsRoot,
  OpenMeteoGemRoot,
  OpenMeteoEcmwfRoot,
  OpenMeteoClimateRoot,
  OpenMeteoHistoricalRoot
} from '../interfaces/open-meteo-forecast';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenMeteoService {
  private baseUrl = environment.api.openMeteo.baseUrl;

  constructor(private http: HttpClient) {}

  public getForecast(lat: number, lon: number): Observable<OpenMeteoForecastRoot> {
    const url = `${this.baseUrl}/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,relative_humidity_2m,windspeed_10m,weathercode&daily=weathercode&current_weather=true&timezone=auto`;
    return this.http.get<OpenMeteoForecastRoot>(url);
  }

  public getGfs(lat: number, lon: number): Observable<OpenMeteoGfsRoot> {
    const url = `${this.baseUrl}/v1/gfs?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weathercode&forecast_days=7&timezone=auto`;
    return this.http.get<OpenMeteoGfsRoot>(url);
  }

  public getGem(lat: number, lon: number): Observable<OpenMeteoGemRoot> {
    const url = `${this.baseUrl}/v1/gem?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&forecast_days=7&timezone=auto`;
    return this.http.get<OpenMeteoGemRoot>(url);
  }

  public getEcmwf(lat: number, lon: number): Observable<OpenMeteoEcmwfRoot> {
    const url = `${this.baseUrl}/v1/ecmwf?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,weathercode&timezone=auto`;
    return this.http.get<OpenMeteoEcmwfRoot>(url);
  }

  public getClimate(
    lat: number,
    lon: number,
    start: string,
    end: string
  ): Observable<OpenMeteoClimateRoot> {
    const url = `${this.baseUrl}/v1/climate?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&models=EC_Earth3P_HR,MPI_ESM1_2_XR`;
    return this.http.get<OpenMeteoClimateRoot>(url);
  }

  public getHistoricalWeather(
    lat: number,
    lon: number,
    start: string,
    end: string
  ): Observable<OpenMeteoHistoricalRoot> {
    const url = `${this.baseUrl}/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=temperature_2m,precipitation,relativehumidity_2m,windspeed_10m&timezone=auto`;

    return this.http.get<OpenMeteoHistoricalRoot>(url);
  }
}
