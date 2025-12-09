/**
 * Mensagens de erro e validação da aplicação
 */
export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: 'Cidade não encontrada.',
  LOAD_WEATHER_DATA: 'Erro ao carregar dados meteorológicos',
  LOAD_CHART_DATA: 'Erro ao carregar os dados do gráfico. Tente novamente.',
} as const;

export const VALIDATION_MESSAGES = {
  START_DATE_ADJUSTED: 'A data inicial foi ajustada para 28/08/2025. ',
  END_DATE_ADJUSTED: 'A data final foi ajustada para 14/12/2025. ',
  INVALID_DATE_RANGE: 'Intervalo inválido. Intervalo ajustado automaticamente. ',
  INVALID_DATE_FORMAT: 'Por favor, preencha as datas corretamente no formato DD/MM/AAAA.',
} as const;

export const INFO_MESSAGES = {
  UNAVAILABLE_HUMIDITY: 'Umidade não disponível',
  UNAVAILABLE_WIND_SPEED: 'Velocidade do vento não disponível',
  NO_DATA_AVAILABLE: 'Nenhum dado disponível para os filtros selecionados.',
  ALL_RECORDS_LOADED: (total: number) => `Todos os ${total} registros estão sendo exibidos`,
  LOADING_MORE: 'Carregando...',
  LOADING_DATA: 'Carregando dados meteorológicos...',
  LOADING_CHART: 'Carregando gráfico...',
  LOADING_INDICATORS: 'Carregando KPIs...',
};
