import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../use-theme-color';
import { Colors } from '@/src/constants/theme';

// Mock useColorScheme
jest.mock('../use-color-scheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('useThemeColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return light color when light mode and light prop is provided', () => {
    const { result } = renderHook(() =>
      useThemeColor({ light: '#FF0000', dark: '#000000' }, 'background')
    );
    expect(result.current).toBe('#FF0000');
  });

  it('should return dark color when dark mode and dark prop is provided', () => {
    const { useColorScheme } = require('../use-color-scheme');
    useColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#FF0000', dark: '#000000' }, 'background')
    );
    expect(result.current).toBe('#000000');
  });

  it('should return color from theme when props are not provided', () => {
    const { result } = renderHook(() =>
      useThemeColor({}, 'background')
    );
    expect(result.current).toBe(Colors.light.background);
  });

  it('should prioritize prop color over theme color', () => {
    const { result } = renderHook(() =>
      useThemeColor({ light: '#CUSTOM' }, 'text')
    );
    expect(result.current).toBe('#CUSTOM');
  });
});

