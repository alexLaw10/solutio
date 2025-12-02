import { weatherService } from '../weather.service';
import { ForecastData } from '@/src/types';

describe('WeatherService', () => {
  describe('getCities', () => {
    it('should return array of cities', () => {
      const cities = weatherService.getCities();
      expect(Array.isArray(cities)).toBe(true);
      expect(cities.length).toBeGreaterThan(0);
      expect(cities[0]).toHaveProperty('name');
      expect(cities[0]).toHaveProperty('lat');
      expect(cities[0]).toHaveProperty('lng');
    });
  });

  describe('processKpiData', () => {
    it('should process KPI data correctly', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-01-01T00:00', '2025-01-01T01:00'],
          temperature_2m: [20, 25],
          precipitation_probability: [0, 10],
        },
      };

      const result = weatherService.processKpiData(mockData);
      expect(result).toHaveProperty('avgTemp');
      expect(result).toHaveProperty('maxTemp');
      expect(result).toHaveProperty('minTemp');
      expect(result).toHaveProperty('percentChange');
      expect(result.avgTemp).toBe(22.5);
      expect(result.maxTemp).toBe(25);
      expect(result.minTemp).toBe(20);
    });

    it('should return zeros for empty data', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: [],
          temperature_2m: [],
          precipitation_probability: [],
        },
      };

      const result = weatherService.processKpiData(mockData);
      expect(result.avgTemp).toBe(0);
      expect(result.maxTemp).toBe(0);
      expect(result.minTemp).toBe(0);
      expect(result.percentChange).toBe(0);
    });

    it('should calculate percent change correctly', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-01-01T00:00', '2025-01-01T01:00'],
          temperature_2m: [10, 20],
          precipitation_probability: [0, 10],
        },
      };

      const result = weatherService.processKpiData(mockData);
      expect(result.percentChange).toBe(100);
    });
  });

  describe('processTableData', () => {
    it('should process table data correctly', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-01-01T00:00'],
          temperature_2m: [20],
          precipitation_probability: [50],
          relative_humidity_2m: [60],
          windspeed_10m: [10],
          weathercode: [1],
        },
      };

      const result = weatherService.processTableData(mockData);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('time');
      expect(result[0]).toHaveProperty('temp');
      expect(result[0]).toHaveProperty('prec');
      expect(result[0].temp).toBe(20);
      expect(result[0].prec).toBe(50);
      expect(result[0].hum).toBe(60);
      expect(result[0].wind).toBe(10);
    });

    it('should return empty array for invalid data', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: [],
          temperature_2m: [],
          precipitation_probability: [],
        },
      };

      const result = weatherService.processTableData(mockData);
      expect(result).toEqual([]);
    });

    it('should handle null optional fields', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-01-01T00:00'],
          temperature_2m: [20],
          precipitation_probability: [50],
        },
      };

      const result = weatherService.processTableData(mockData);
      expect(result[0].hum).toBeNull();
      expect(result[0].wind).toBeNull();
    });
  });

  describe('processAreaChartData', () => {
    it('should process area chart data correctly', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-01-01T14:30:00'],
          temperature_2m: [25.5],
          precipitation_probability: [0],
        },
      };

      const result = weatherService.processAreaChartData(mockData);
      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('datasets');
      expect(Array.isArray(result.labels)).toBe(true);
      expect(Array.isArray(result.datasets.data)).toBe(true);
      expect(result.labels[0]).toBe('01/01 14:30');
      expect(result.datasets.data[0]).toBe(25.5);
    });

    it('should return empty arrays for invalid data', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: [],
          temperature_2m: [],
          precipitation_probability: [],
        },
      };

      const result = weatherService.processAreaChartData(mockData);
      expect(result.labels).toEqual([]);
      expect(result.datasets.data).toEqual([]);
    });

    it('should filter invalid dates', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['invalid-date', '2025-01-01T14:30:00'],
          temperature_2m: [20, 25],
          precipitation_probability: [0, 10],
        },
      };

      const result = weatherService.processAreaChartData(mockData);
      expect(result.labels.length).toBe(1);
      expect(result.datasets.data.length).toBe(1);
    });
  });

  describe('processBarChartData', () => {
    it('should process bar chart data correctly', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: [
            '2025-01-01T00:00',
            '2025-01-01T12:00',
            '2025-01-02T00:00',
          ],
          temperature_2m: [20, 25, 22],
          precipitation_probability: [0, 10, 5],
        },
      };

      const result = weatherService.processBarChartData(mockData);
      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('datasets');
      expect(Array.isArray(result.labels)).toBe(true);
      expect(Array.isArray(result.datasets.data)).toBe(true);
      expect(result.labels.length).toBeGreaterThan(0);
    });

    it('should calculate daily averages correctly', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-01-01T00:00', '2025-01-01T12:00'],
          temperature_2m: [20, 30],
          precipitation_probability: [0, 10],
        },
      };

      const result = weatherService.processBarChartData(mockData);
      expect(result.datasets.data[0]).toBe(25);
    });

    it('should return empty arrays for invalid data', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: [],
          temperature_2m: [],
          precipitation_probability: [],
        },
      };

      const result = weatherService.processBarChartData(mockData);
      expect(result.labels).toEqual([]);
      expect(result.datasets.data).toEqual([]);
    });
  });

  describe('processDonutChartData', () => {
    it('should process donut chart data correctly', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-01-01T00:00'],
          temperature_2m: [20],
          precipitation_probability: [0],
        },
        current_weather: {
          temperature: 25.5,
          weathercode: 1,
        },
      };

      const result = weatherService.processDonutChartData(mockData);
      expect(result).not.toBeNull();
      expect(result?.current).toBe(25.5);
      expect(result?.remaining).toBe(24.5);
      expect(result?.label).toBe('25.5°C');
    });

    it('should return null for missing current weather', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-01-01T00:00'],
          temperature_2m: [20],
          precipitation_probability: [0],
        },
      };

      const result = weatherService.processDonutChartData(mockData);
      expect(result).toBeNull();
    });

    it('should handle temperature above max temp', () => {
      const mockData: ForecastData = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-01-01T00:00'],
          temperature_2m: [20],
          precipitation_probability: [0],
        },
        current_weather: {
          temperature: 60,
          weathercode: 1,
        },
      };

      const result = weatherService.processDonutChartData(mockData);
      expect(result?.remaining).toBe(0);
    });
  });
});

