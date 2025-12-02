import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { WeatherProvider, useWeather } from '../WeatherContext';
import { apiService } from '@/src/services/api.service';
import { ForecastData } from '@/src/types';

jest.mock('@/src/services/api.service');

const mockForecastData: ForecastData = {
  latitude: -7.1153,
  longitude: -34.8641,
  hourly: {
    time: ['2025-01-01T00:00'],
    temperature_2m: [20],
    precipitation_probability: [0],
  },
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WeatherProvider>{children}</WeatherProvider>
);

describe('WeatherContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide default values', () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    expect(result.current.forecastData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should load forecast data successfully', async () => {
    (apiService.getForecast as jest.Mock).mockResolvedValueOnce(mockForecastData);

    const { result } = renderHook(() => useWeather(), { wrapper });

    await act(async () => {
      await result.current.loadForecast({ name: 'João Pessoa', lat: -7.1153, lng: -34.8641 });
    });

    await waitFor(() => {
      expect(result.current.forecastData).toEqual(mockForecastData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Erro ao buscar dados meteorológicos';
    (apiService.getForecast as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useWeather(), { wrapper });

    await act(async () => {
      await result.current.loadForecast({ name: 'João Pessoa', lat: -7.1153, lng: -34.8641 });
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.forecastData).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should set selected city', async () => {
    (apiService.getForecast as jest.Mock).mockResolvedValueOnce(mockForecastData);

    const { result } = renderHook(() => useWeather(), { wrapper });

    const city = { name: 'São Paulo', lat: -23.5505, lng: -46.6333 };

    await act(async () => {
      result.current.setSelectedCity(city);
    });

    await waitFor(() => {
      expect(result.current.selectedCity).toEqual(city);
    });
  });

  it('should refresh data', async () => {
    (apiService.getForecast as jest.Mock).mockResolvedValueOnce(mockForecastData);

    const { result } = renderHook(() => useWeather(), { wrapper });

    await act(async () => {
      await result.current.loadForecast({ name: 'João Pessoa', lat: -7.1153, lng: -34.8641 });
    });

    const refreshMock = jest.fn().mockResolvedValueOnce(mockForecastData);
    (apiService.getForecast as jest.Mock).mockImplementation(refreshMock);

    await act(async () => {
      await result.current.refreshData();
    });

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  it('should set error manually', () => {
    const { result } = renderHook(() => useWeather(), { wrapper });

    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.error).toBe('Test error');
  });

  it('should clear error when loading forecast', async () => {
    const { result } = renderHook(() => useWeather(), { wrapper });

    act(() => {
      result.current.setError('Previous error');
    });

    expect(result.current.error).toBe('Previous error');

    (apiService.getForecast as jest.Mock).mockResolvedValueOnce(mockForecastData);

    await act(async () => {
      await result.current.loadForecast({ name: 'João Pessoa', lat: -7.1153, lng: -34.8641 });
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});

