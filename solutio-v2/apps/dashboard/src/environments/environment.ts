/**
 * Environment configuration for development
 * 
 * Para modificar valores:
 * - Edite os valores diretamente neste arquivo, OU
 * - Use variáveis de ambiente durante o build (requer configuração adicional)
 * - Para produção, os valores são sobrescritos pelo environment.prod.ts via fileReplacements
 */
export const environment = {
  production: false,
  api: {
    openMeteo: {
      baseUrl: 'https://api.open-meteo.com',
    },
  },
  defaultLocation: {
    lat: -7.1153, // João Pessoa, PB
    lng: -34.8641,
  },
};
