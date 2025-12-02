import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:4200',
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      apiUrl: 'https://api.open-meteo.com',
    },
    setupNodeEvents(on, config) {
      // Implementar logging melhorado
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
});
