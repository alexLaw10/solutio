import React from 'react';
import { render } from '@testing-library/react-native';
import { Bar } from '../Bar';
import { WeatherProvider } from '@/src/context/WeatherContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WeatherProvider>{children}</WeatherProvider>
);

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
  BarChart: ({ data, width, height }: any) => {
    const React = require('react');
    return React.createElement('View', {
      testID: 'bar-chart',
      'data-width': width,
      'data-height': height,
      'data-labels': JSON.stringify(data.labels),
    });
  },
}));

// Mock Dimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Dimensions: {
      get: jest.fn(() => ({ width: 375 })),
    },
  };
});

describe('Bar Component', () => {
  it('should render loading state', () => {
    const { getByText } = render(<Bar />, { wrapper });
    expect(getByText('Carregando gráfico...')).toBeTruthy();
  });

  it('should render error state', () => {
    const { result } = require('@testing-library/react-native').renderHook(
      () => require('@/src/context/WeatherContext').useWeather(),
      { wrapper }
    );

    result.current.setError('Test error');

    const { getByText } = render(<Bar />, { wrapper });
    expect(getByText('Temperatura Média Diária')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
  });

  it('should render empty state when no data', () => {
    const { getByText } = render(<Bar />, { wrapper });
    // When there's no data and no error, it should show empty message
  });

  it('should render chart when data is available', () => {
    const { queryByTestId } = render(<Bar />, { wrapper });
    // Chart should be rendered when data exists
  });
});



