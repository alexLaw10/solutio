import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { WeatherProvider } from '@/src/context/WeatherContext';
import { ErrorBoundary } from '@/src/components/common/ErrorBoundary';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Aqui você pode adicionar logging de erros para um serviço externo
    // Por exemplo: Sentry, LogRocket, etc.
  };

  return (
    <ErrorBoundary onError={handleError}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <WeatherProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </WeatherProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
