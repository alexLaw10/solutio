export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.open-meteo.com/v1';

export const APP_CONFIG = {
  name: 'Solutio Dashboard',
  version: '1.0.0',
  timeout: 10000,
  chartMaxPoints: 50,
  donutMaxTemp: 50,
} as const;