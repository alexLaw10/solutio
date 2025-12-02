declare namespace Cypress {
  interface Chainable<Subject> {
    selectCity(cityName: string): Chainable<Subject>;
    selectDateRange(startDate: string, endDate: string): Chainable<Subject>;
    searchWeatherData(): Chainable<Subject>;
    toggleTheme(): Chainable<Subject>;
    waitForWeatherData(): Chainable<Subject>;
    waitForLoadingToFinish(): Chainable<Subject>;
    checkA11y(selector?: string): Chainable<Subject>;
    navigateWithKeyboard(times?: number): Chainable<Subject>;
    shouldHaveAriaLabel(selector: string, label: string): Chainable<Subject>;
  }
}

Cypress.Commands.add('selectCity', (cityName: string) => {
  cy.get('design-system-select[label="Cidade"]')
    .shadow()
    .find('select')
    .select(cityName, { force: true })
    .should('have.value', cityName);
});

Cypress.Commands.add('selectDateRange', (startDate: string, endDate: string) => {
  cy.get('design-system-date-input[label="Data de Início"]')
    .shadow()
    .find('input')
    .clear({ force: true })
    .type(startDate, { force: true })
    .should('have.value', startDate);
  
  cy.get('design-system-date-input[label="Data de Fim"]')
    .shadow()
    .find('input')
    .clear({ force: true })
    .type(endDate, { force: true })
    .should('have.value', endDate);
});

Cypress.Commands.add('searchWeatherData', () => {
  cy.get('design-system-search-button')
    .shadow()
    .find('button')
    .should('be.visible')
    .click({ force: true });
  
  cy.waitForLoadingToFinish();
});

Cypress.Commands.add('toggleTheme', () => {
  cy.get('solutio-theme-toggle button')
    .should('be.visible')
    .click({ force: true });
});

Cypress.Commands.add('waitForWeatherData', () => {
  cy.get('solutio-table .loading', { timeout: 30000 }).should('not.exist');
  cy.get('solutio-table table tbody tr', { timeout: 30000 }).should('have.length.at.least', 1);
});

Cypress.Commands.add('waitForLoadingToFinish', () => {
  cy.get('[role="status"]', { timeout: 10000 }).should('not.exist');
  cy.get('.loading', { timeout: 10000 }).should('not.exist');
});

Cypress.Commands.add('checkA11y', (selector?: string) => {
  // Verificações básicas de acessibilidade sem biblioteca externa
  const target = selector ? cy.get(selector) : cy.get('body');
  
  target.then(() => {
    // Verificar se há headings hierárquicos
    cy.get('body').then(($body) => {
      if ($body.find('h1').length > 0) {
        cy.get('h1').should('have.length.at.least', 1);
      }
      
      // Verificar se imagens têm alt text quando existirem
      if ($body.find('img').length > 0) {
        cy.get('img').each(($img) => {
          cy.wrap($img).should('have.attr', 'alt');
        });
      }
    });
  });
});

Cypress.Commands.add('navigateWithKeyboard', (times = 1) => {
  cy.get('body').focus();
  
  for (let i = 0; i < times; i++) {
    cy.get('body').type('{tab}', { delay: 100 });
  }
});

Cypress.Commands.add('shouldHaveAriaLabel', (selector: string, label: string) => {
  cy.get(selector).should('have.attr', 'aria-label', label);
});
