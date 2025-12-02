import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { apiService } from '@/src/services/api.service';
import { weatherService } from '@/src/services/weather.service';
import { ForecastData, City } from '@/src/types';

interface WeatherContextType {
  forecastData: ForecastData | null;
  selectedCity: City | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  setSelectedCity: (city: City) => void;
  loadForecast: (city: City, startDate?: string, endDate?: string) => Promise<void>;
  refreshData: (startDate?: string, endDate?: string) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [selectedCity, setSelectedCityState] = useState<City | null>(() => {
    const cities = weatherService.getCities();
    return cities.length > 0 ? cities[0] : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadForecast = useCallback(async (city: City, startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getForecast(city.lat, city.lng, startDate, endDate);
      setForecastData(data);
      setSelectedCityState(city);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados meteorológicos';
      setError(errorMessage);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setSelectedCity = useCallback(
    (city: City) => {
      setSelectedCityState(city);
      loadForecast(city, undefined, undefined);
    },
    [loadForecast]
  );

  const refreshData = useCallback(async (startDate?: string, endDate?: string) => {
    if (selectedCity) {
      await loadForecast(selectedCity, startDate, endDate);
    }
  }, [selectedCity, loadForecast]);

  React.useEffect(() => {
    if (selectedCity && !forecastData && !loading) {
      loadForecast(selectedCity);
    }
  }, [selectedCity, forecastData, loading, loadForecast]);

  const handleSetError = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        forecastData,
        selectedCity,
        loading,
        error,
        setError: handleSetError,
        setSelectedCity,
        loadForecast,
        refreshData,
      }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
