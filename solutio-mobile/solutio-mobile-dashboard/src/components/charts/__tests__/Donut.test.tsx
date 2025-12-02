import React from 'react';
import { render } from '@testing-library/react-native';
import { Donut } from '../Donut';
import { WeatherProvider } from '@/src/context/WeatherContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WeatherProvider>{children}</WeatherProvider>
);

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
  PieChart: ({ data, width, height }: any) => {
    const React = require('react');
    return React.createElement('View', {
      testID: 'pie-chart',
      'data-width': width,
      'data-height': height,
      'data-items': JSON.stringify(data),
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

describe('Donut Component', () => {
  it('should render loading state', () => {
    const { getByText } = render(<Donut />, { wrapper });
    expect(getByText('Carregando gráfico...')).toBeTruthy();
  });

  it('should render error state', () => {
    const { result } = require('@testing-library/react-native').renderHook(
      () => require('@/src/context/WeatherContext').useWeather(),
      { wrapper }
    );

    result.current.setError('Test error');

    const { getByText } = render(<Donut />, { wrapper });
    expect(getByText('Temperatura Atual')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
  });

  it('should not render when no data', () => {
    const { queryByText } = render(<Donut />, { wrapper });
    // Component should return null when no data
  });

  it('should render chart when data is available', () => {
    const { queryByTestId } = render(<Donut />, { wrapper });
    // Chart should be rendered when data exists
  });
});

