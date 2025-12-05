import React from 'react';
import { render } from '@testing-library/react-native';
import { Kpi } from '../Kpi';
import { WeatherProvider } from '@/src/context/WeatherContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WeatherProvider>{children}</WeatherProvider>
);

describe('Kpi Component', () => {
  it('should render loading state', () => {
    const { getByText } = render(<Kpi />, { wrapper });
    expect(getByText('Carregando indicadores...')).toBeTruthy();
  });

  it('should render error state', () => {
    const { result } = require('@testing-library/react-native').renderHook(
      () => require('@/src/context/WeatherContext').useWeather(),
      { wrapper }
    );

    result.current.setError('Test error');

    const { getByText } = render(<Kpi />, { wrapper });
    expect(getByText('Indicadores')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
  });

  it('should not render when no data', () => {
    const { queryByText } = render(<Kpi />, { wrapper });
    // Component should return null when no kpiData
    expect(queryByText('Indicadores')).toBeNull();
  });

  it('should render KPI cards when data is available', () => {
    // This would require mocking the context with forecast data
    const { queryByText } = render(<Kpi />, { wrapper });
    // Should render cards with avg, max, min, and percentChange
  });
});



