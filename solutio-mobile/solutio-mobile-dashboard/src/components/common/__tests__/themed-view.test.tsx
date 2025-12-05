import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedView } from '../themed-view';
import { Colors } from '@/src/constants/theme';

// Mock useThemeColor
jest.mock('@/src/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    if (props.light) return props.light;
    if (props.dark) return props.dark;
    return Colors.light[colorName];
  }),
}));

describe('ThemedView Component', () => {
  it('should render with default background color', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view">
        <></>
      </ThemedView>
    );
    const view = getByTestId('themed-view');
    expect(view).toBeTruthy();
  });

  it('should render with custom light color', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view" lightColor="#FF0000">
        <></>
      </ThemedView>
    );
    const view = getByTestId('themed-view');
    expect(view).toBeTruthy();
  });

  it('should render with custom dark color', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view" darkColor="#000000">
        <></>
      </ThemedView>
    );
    const view = getByTestId('themed-view');
    expect(view).toBeTruthy();
  });

  it('should pass through other View props', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view" accessibilityLabel="Test view">
        <></>
      </ThemedView>
    );
    const view = getByTestId('themed-view');
    expect(view).toBeTruthy();
  });
});



