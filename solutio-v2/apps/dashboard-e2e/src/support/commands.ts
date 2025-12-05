// ***********************************************
// Custom Cypress commands for dashboard E2E tests
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Wait for the application to be fully loaded
     */
    waitForAppLoad(): Chainable<Subject>;
    
    /**
     * Wait for API data to load
     */
    waitForDataLoad(): Chainable<Subject>;
    
    /**
     * Mock weather API response
     */
    mockWeatherAPI(fixture?: string, statusCode?: number): Chainable<Subject>;
    
    /**
     * Select city from dropdown
     */
    selectCity(cityName: string): Chainable<Subject>;
    
    /**
     * Select date range
     */
    selectDateRange(startDate: string, endDate: string): Chainable<Subject>;
    
    /**
     * Toggle theme
     */
    toggleTheme(): Chainable<Subject>;
    
    /**
     * Wait for loading to finish
     */
    waitForLoadingToFinish(): Chainable<Subject>;
    
    /**
     * Check accessibility basics
     */
    checkA11y(selector?: string): Chainable<Subject>;
  }
}

// Wait for app to be fully loaded
Cypress.Commands.add('waitForAppLoad', () => {
  cy.get('solutio-v2-home', { timeout: 10000 }).should('be.visible');
  cy.get('solutio-v2-sidebar', { timeout: 10000 }).should('be.visible');
  cy.get('solutio-v2-navbar', { timeout: 10000 }).should('be.visible');
});

// Wait for data to load
Cypress.Commands.add('waitForDataLoad', () => {
  // Wait for loading indicators to disappear
  cy.get('body').then(($body) => {
    if ($body.find('.loading').length > 0) {
      cy.get('.loading', { timeout: 15000 }).should('not.exist');
    }
  });
  
  // Wait for charts to render
  cy.wait(1000);
});

// Mock weather API
Cypress.Commands.add('mockWeatherAPI', (fixture = 'weather-forecast.json', statusCode = 200) => {
  cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', {
    statusCode,
    fixture: fixture,
  }).as('getForecast');
  
  return cy.wait('@getForecast');
});

// Select city
Cypress.Commands.add('selectCity', (cityName: string) => {
  cy.get('solutio-v2-table select[formControlName="city"]').select(cityName);
  cy.waitForDataLoad();
});

// Select date range
Cypress.Commands.add('selectDateRange', (startDate: string, endDate: string) => {
  cy.get('solutio-v2-table input[formControlName="start"]').clear().type(startDate);
  cy.get('solutio-v2-table input[formControlName="end"]').clear().type(endDate);
  cy.waitForDataLoad();
});

// Toggle theme
Cypress.Commands.add('toggleTheme', () => {
  cy.get('solutio-v2-theme-toggle button').click();
  cy.wait(300); // Wait for theme transition
});

// Wait for loading to finish
Cypress.Commands.add('waitForLoadingToFinish', () => {
  cy.get('.loading', { timeout: 15000 }).should('not.exist');
  cy.get('[aria-label*="Carregando"]', { timeout: 15000 }).should('not.exist');
});

// Basic accessibility check
Cypress.Commands.add('checkA11y', (selector = 'body') => {
  cy.get(selector).within(() => {
    // Check for images without alt text
    cy.get('img:not([alt])').should('not.exist');
    
    // Check for buttons without aria-label or text
    cy.get('button').each(($btn) => {
      const hasAriaLabel = $btn.attr('aria-label');
      const hasText = $btn.text().trim().length > 0;
      expect(hasAriaLabel || hasText).to.be.true;
    });
    
    // Check for form inputs with labels
    cy.get('input[type="text"], input[type="date"], select').each(($input) => {
      const id = $input.attr('id');
      if (id) {
        cy.get(`label[for="${id}"]`).should('exist');
      }
    });
  });
});
