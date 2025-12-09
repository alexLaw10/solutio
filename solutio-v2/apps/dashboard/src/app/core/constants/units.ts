/**
 * Unidades de medida e formatação
 */
export const UNITS = {
  CELSIUS: '°C',
  CELSIUS_FULL: 'graus Celsius',
  PERCENT: '%',
  PERCENT_FULL: 'por cento',
  KILOMETERS_PER_HOUR: 'quilômetros por hora',
} as const;

/**
 * Templates para aria labels com unidades
 */
export const ARIA_LABEL_TEMPLATES = {
  TEMPERATURE: (value: number) => `Temperatura: ${value} ${UNITS.CELSIUS_FULL}`,
  PRECIPITATION: (value: number) => `Probabilidade de precipitação: ${value} ${UNITS.PERCENT_FULL}`,
  HUMIDITY: (value: number) => `Umidade: ${value} ${UNITS.PERCENT_FULL}`,
  WIND_SPEED: (value: number) => `Velocidade do vento: ${value} ${UNITS.KILOMETERS_PER_HOUR}`,
};
