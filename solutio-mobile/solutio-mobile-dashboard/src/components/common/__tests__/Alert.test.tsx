import React from 'react';
import { render } from '@testing-library/react-native';
import { Alert } from '../Alert';
import { WeatherProvider, useWeather } from '@/src/context/WeatherContext';
import { renderHook, act } from '@testing-library/react-native';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WeatherProvider>{children}</WeatherProvider>
);

describe('Alert', () => {
  it('should not render when there is no error', () => {
    const { queryByText } = render(<Alert />, { wrapper });
    expect(queryByText('Erro na requisição')).toBeNull();
  });

  it('should render error message when error exists', () => {
    const { result: contextResult } = renderHook(() => useWeather(), { wrapper });

    act(() => {
      contextResult.current.setError('Test error message');
    });

    const { getByText } = render(<Alert />, { wrapper });
    expect(getByText('Erro na requisição')).toBeTruthy();
    expect(getByText('Test error message')).toBeTruthy();
  });
});

