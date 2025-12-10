/**
 * Environment configuration for production
 * 
 * Este arquivo é usado automaticamente durante o build de produção via fileReplacements.
 * Modifique os valores aqui para configurações específicas de produção.
 */
export const environment = {
  production: true,
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
