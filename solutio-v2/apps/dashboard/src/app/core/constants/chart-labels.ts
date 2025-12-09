/**
 * Labels e títulos para gráficos
 */
export const CHART_LABELS = {
  TEMPERATURE: 'Temperatura (°C)',
  TEMPERATURE_AVERAGE: 'Temperatura Média (°C)',
  TEMPERATURE_CURRENT: 'Temperatura Atual',
  TEMPERATURE_REMAINING: 'Restante até 50°C',
  DATE: 'Data',
  DATE_TIME: 'Data/Hora',
  TEMPERATURE_OVER_TIME: 'Temperatura ao Longo do Tempo',
  TEMPERATURE_DAILY_AVERAGE: 'Temperatura Média Diária',
} as const;

export const CHART_ARIA_LABELS = {
  AREA_CHART: 'Gráfico de área mostrando a série temporal de temperatura',
  BAR_CHART: 'Gráfico de barras mostrando a temperatura média diária',
  DONUT_CHART: (temp: number) => `Gráfico de rosca mostrando temperatura atual de ${temp} graus Celsius de um total de 50 graus`,
};
