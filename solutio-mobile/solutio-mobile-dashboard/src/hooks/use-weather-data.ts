import { useMemo } from 'react';
import { useWeather } from '@/src/context/WeatherContext';
import { weatherService } from '@/src/services/weather.service';
import { KpiData, TableRow } from '@/src/types';
import { APP_CONFIG } from '@/src/config';

export function useKpiData() {
  const { forecastData } = useWeather();

  return useMemo(() => {
    if (!forecastData) return null;
    return weatherService.processKpiData(forecastData);
  }, [forecastData]);
}

export function useTableData() {
  const { forecastData } = useWeather();

  return useMemo(() => {
    if (!forecastData) return [];
    return weatherService.processTableData(forecastData);
  }, [forecastData]);
}

export function useAreaChartData() {
  const { forecastData } = useWeather();

  return useMemo(() => {
    if (!forecastData) return { labels: [], datasets: { data: [] } };

    const processed = weatherService.processAreaChartData(forecastData);
    
    if (processed.labels.length > APP_CONFIG.chartMaxPoints) {
      const step = Math.ceil(processed.labels.length / APP_CONFIG.chartMaxPoints);
      return {
        labels: processed.labels.filter((_, index) => index % step === 0),
        datasets: {
          data: processed.datasets.data.filter((_, index) => index % step === 0),
        },
      };
    }

    return processed;
  }, [forecastData]);
}

export function useBarChartData() {
  const { forecastData } = useWeather();

  return useMemo(() => {
    if (!forecastData) return { labels: [], datasets: { data: [] } };
    return weatherService.processBarChartData(forecastData);
  }, [forecastData]);
}

export function useDonutChartData() {
  const { forecastData } = useWeather();

  return useMemo(() => {
    if (!forecastData) return null;
    return weatherService.processDonutChartData(forecastData);
  }, [forecastData]);
}
