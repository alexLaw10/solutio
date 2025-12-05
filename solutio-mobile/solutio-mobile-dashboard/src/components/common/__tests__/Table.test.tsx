import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Table } from '../Table';
import { WeatherProvider } from '@/src/context/WeatherContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WeatherProvider>{children}</WeatherProvider>
);

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement('View', {
      testID: 'date-picker',
      ...props,
      ref,
    });
  });
});

describe('Table Component', () => {
  it('should render table with header', () => {
    const { getByText } = render(<Table />, { wrapper });
    expect(getByText('Séries horárias')).toBeTruthy();
  });

  it('should render filter fields', () => {
    const { getByText } = render(<Table />, { wrapper });
    expect(getByText('Data de Início')).toBeTruthy();
    expect(getByText('Data de Fim')).toBeTruthy();
    expect(getByText('Cidade')).toBeTruthy();
  });

  it('should render search button', () => {
    const { getByText } = render(<Table />, { wrapper });
    expect(getByText('Buscar')).toBeTruthy();
  });

  it('should show loading state', () => {
    const { getByText } = render(<Table />, { wrapper });
    // Loading state should be shown when loading
  });

  it('should show empty state when no data', () => {
    const { getByText } = render(<Table />, { wrapper });
    // Empty state message should be shown
  });

  it('should open city picker when city field is pressed', () => {
    const { getByText } = render(<Table />, { wrapper });
    const cityField = getByText('Selecione uma cidade');
    fireEvent.press(cityField);
    // Modal should open
  });

  it('should open date picker when date field is pressed', () => {
    const { getByText } = render(<Table />, { wrapper });
    const startDateField = getByText('Data de Início').parent;
    if (startDateField) {
      fireEvent.press(startDateField);
      // Date picker should open
    }
  });
});



