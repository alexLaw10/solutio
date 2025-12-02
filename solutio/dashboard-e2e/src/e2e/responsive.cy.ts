import {
  getTable,
  getNavbar,
  getSidebar,
  getKpiCards,
  getBarChart,
  getAreaChart,
  getDonutChart,
  getMainContent,
} from '../support/app.po';

describe('Responsividade', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', { fixture: 'weather-forecast.json' }).as('getForecast');
  });

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Large Desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach((viewport) => {
    describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/home');
        cy.wait('@getForecast');
        cy.waitForWeatherData();
      });

      it('deve exibir todos os componentes principais', () => {
        getNavbar().should('be.visible');
        getMainContent().should('be.visible');
        
        if (viewport.width >= 768) {
          getSidebar().should('be.visible');
        }
      });

      it('deve exibir a tabela corretamente', () => {
        getTable().should('be.visible');
        getTable().find('table').should('be.visible');
      });

      it('deve exibir os gráficos corretamente', () => {
        getKpiCards().should('have.length.at.least', 1);
        
        if (viewport.width >= 768) {
          getBarChart().should('be.visible');
          getAreaChart().should('be.visible');
          getDonutChart().should('be.visible');
        }
      });

      it('deve permitir interação com filtros', () => {
        cy.get('design-system-date-input').should('be.visible');
        cy.get('design-system-select').should('be.visible');
        cy.get('design-system-search-button').should('be.visible');
      });
    });
  });
});

