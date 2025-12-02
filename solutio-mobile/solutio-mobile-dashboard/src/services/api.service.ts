import { API_BASE_URL, APP_CONFIG } from '@/src/config';
import { ForecastData } from '@/src/types';

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getForecast(lat: number, lon: number, startDate?: string, endDate?: string): Promise<ForecastData> {
    let url: string;
    
    if (startDate && endDate) {
      const MIN_API_DATE = '2025-08-31';
      const MAX_API_DATE = '2025-12-17';
      
      const validStart = startDate < MIN_API_DATE ? MIN_API_DATE : (startDate > MAX_API_DATE ? MAX_API_DATE : startDate);
      const validEnd = endDate > MAX_API_DATE ? MAX_API_DATE : (endDate < MIN_API_DATE ? MIN_API_DATE : endDate);
      
      url = `${this.baseUrl}/forecast?latitude=${lat}&longitude=${lon}&start_date=${validStart}&end_date=${validEnd}&hourly=temperature_2m,precipitation_probability,relative_humidity_2m,windspeed_10m,weathercode&daily=weathercode&current_weather=true&timezone=auto`;
    } else {
      url = `${this.baseUrl}/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,relative_humidity_2m,windspeed_10m,weathercode&daily=weathercode&current_weather=true&timezone=auto`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.reason || 'Erro ao buscar dados meteorológicos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('A requisição excedeu o tempo limite.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

export const apiService = new ApiService();

