import { ForecastData, KpiData, TableRow, City } from '@/src/types';
import { round } from '@/src/utils';
import { APP_CONFIG } from '@/src/config';

export class WeatherService {
  private cities: City[] = [
    { name: 'João Pessoa', lat: -7.1153, lng: -34.8641 },
    { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
    { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
    { name: 'Brasília', lat: -15.7942, lng: -47.8822 },
  ];

  getCities(): City[] {
    return this.cities;
  }

  processKpiData(data: ForecastData): KpiData {
    const temps = data.hourly?.temperature_2m ?? [];

    if (!temps.length) {
      return {
        avgTemp: 0,
        maxTemp: 0,
        minTemp: 0,
        percentChange: 0,
      };
    }

    const avgTemp = round(
      temps.reduce((a: number, b: number) => a + b, 0) / temps.length
    );
    const maxTemp = round(Math.max(...temps));
    const minTemp = round(Math.min(...temps));

    const first = temps[0];
    const last = temps[temps.length - 1];
    const percentChange =
      first !== 0 ? round(((last - first) / first) * 100) : 0;

    return { avgTemp, maxTemp, minTemp, percentChange };
  }

  processTableData(
    data: ForecastData,
    startDate?: string,
    endDate?: string
  ): TableRow[] {
    const hourly = data.hourly;
    if (!hourly || !hourly.time || !hourly.temperature_2m) {
      return [];
    }

    // Processar todos os dados retornados pela API (igual ao desktop)
    // A API de forecast já retorna dados futuros, não precisa filtrar por data
    const tableRows: TableRow[] = hourly.time.map((timeStr, i) => ({
      id: timeStr + i,
      time: timeStr,
      temp: round(hourly.temperature_2m[i]),
      prec: round(hourly.precipitation_probability[i]),
      hum: hourly.relative_humidity_2m
        ? round(hourly.relative_humidity_2m[i])
        : null,
      wind: hourly.windspeed_10m ? round(hourly.windspeed_10m[i]) : null,
      weathercode: hourly.weathercode ? hourly.weathercode[i] : null,
    }));

    return tableRows;
  }

  processAreaChartData(data: ForecastData): { labels: string[]; datasets: { data: number[] } } {
    const hourly = data.hourly;
    if (!hourly || !hourly.time || !hourly.temperature_2m) {
      return { labels: [], datasets: { data: [] } };
    }

    if (!Array.isArray(hourly.time) || !Array.isArray(hourly.temperature_2m)) {
      return { labels: [], datasets: { data: [] } };
    }

    const labels = hourly.time.map((t: string) => {
      try {
        const date = new Date(t);
        if (isNaN(date.getTime())) {
          return '';
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month} ${hours}:${minutes}`;
      } catch {
        return '';
      }
    }).filter(label => label !== '');

    const temperatures = hourly.temperature_2m
      .map((temp: number) => {
        if (typeof temp !== 'number' || isNaN(temp)) {
          return null;
        }
        return round(temp);
      })
      .filter((temp): temp is number => temp !== null);

    if (labels.length !== temperatures.length) {
      const minLength = Math.min(labels.length, temperatures.length);
      return {
        labels: labels.slice(0, minLength),
        datasets: {
          data: temperatures.slice(0, minLength),
        },
      };
    }

    return {
      labels,
      datasets: {
        data: temperatures,
      },
    };
  }

  processBarChartData(data: ForecastData): { labels: string[]; datasets: { data: number[] } } {
    const hourly = data.hourly;
    if (!hourly || !hourly.time || !hourly.temperature_2m) {
      return { labels: [], datasets: { data: [] } };
    }

    if (!Array.isArray(hourly.time) || !Array.isArray(hourly.temperature_2m)) {
      return { labels: [], datasets: { data: [] } };
    }

    const tempByDay: Record<string, number[]> = {};

    hourly.time.forEach((timestamp: string, i: number) => {
      if (i >= hourly.temperature_2m.length) {
        return;
      }
      const date = timestamp.split('T')[0];
      if (!tempByDay[date]) {
        tempByDay[date] = [];
      }
      const temp = hourly.temperature_2m[i];
      if (typeof temp === 'number' && !isNaN(temp)) {
        tempByDay[date].push(temp);
      }
    });

    const categories = Object.keys(tempByDay).sort();
    
    if (categories.length === 0) {
      return { labels: [], datasets: { data: [] } };
    }

    const seriesData = categories.map((date) => {
      const temps = tempByDay[date];
      if (temps.length === 0) {
        return 0;
      }
      const avg = temps.reduce((a: number, b: number) => a + b, 0) / temps.length;
      return round(avg);
    });

    const labels = categories.map((date) => {
      const [year, month, day] = date.split('-');
      if (!day || !month) {
        return '';
      }
      return `${day}/${month}`;
    }).filter(label => label !== '');

    if (labels.length !== seriesData.length) {
      const minLength = Math.min(labels.length, seriesData.length);
      return {
        labels: labels.slice(0, minLength),
        datasets: {
          data: seriesData.slice(0, minLength),
        },
      };
    }

    return {
      labels,
      datasets: {
        data: seriesData,
      },
    };
  }

  processDonutChartData(data: ForecastData): { current: number; remaining: number; label: string } | null {
    const currentTemp = data.current_weather?.temperature;

    if (currentTemp === undefined || currentTemp === null) {
      return null;
    }

    const tempAtual = round(currentTemp);
    const restante = Math.max(0, APP_CONFIG.donutMaxTemp - tempAtual);

    return {
      current: tempAtual,
      remaining: restante,
      label: `${tempAtual}°C`,
    };
  }
}

export const weatherService = new WeatherService();

