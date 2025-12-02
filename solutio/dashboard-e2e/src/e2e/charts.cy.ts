import {
  getKpiCards,
  getBarChart,
  getAreaChart,
  getDonutChart,
} from '../support/app.po';

describe('Gráficos e Visualizações', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', { fixture: 'weather-forecast.json' }).as('getForecast');
    cy.visit('/home');
    cy.wait('@getForecast');
    cy.waitForWeatherData();
  });

  describe('Cards de KPI', () => {
    it('deve exibir todos os cards de KPI', () => {
      getKpiCards().should('have.length', 4);
    });

    it('deve exibir estrutura semântica correta', () => {
      cy.get('solutio-kpi').should('have.attr', 'role', 'region');
      cy.get('solutio-kpi').should('have.attr', 'aria-label', 'Indicadores de temperatura');
      
      getKpiCards().each(($card) => {
        cy.wrap($card).should('have.attr', 'role', 'group');
      });
    });

    it('deve exibir valores formatados corretamente', () => {
      getKpiCards().each(($card) => {
        cy.wrap($card).should('contain', '°C');
      });
    });

    it('deve ter aria-labels descritivos', () => {
      cy.get('#kpi-avg').should('exist');
      cy.get('#kpi-max').should('exist');
      cy.get('#kpi-min').should('exist');
      cy.get('#kpi-change').should('exist');
    });
  });

  describe('Gráfico de Barras', () => {
    it('deve exibir o gráfico de barras', () => {
      getBarChart().should('be.visible');
    });

    it('deve ter estrutura semântica correta', () => {
      getBarChart().should('have.attr', 'role', 'img');
      getBarChart().should('have.attr', 'aria-label');
    });

    it('deve exibir estados de loading e erro corretamente', () => {
      cy.get('solutio-bar').within(() => {
        cy.get('[role="status"]').should('not.exist');
        cy.get('[role="alert"]').should('not.exist');
      });
    });
  });

  describe('Gráfico de Área', () => {
    it('deve exibir o gráfico de área', () => {
      getAreaChart().should('be.visible');
    });

    it('deve ter estrutura semântica correta', () => {
      getAreaChart().should('have.attr', 'role', 'img');
      getAreaChart().should('have.attr', 'aria-label');
    });

    it('deve exibir estados de loading e erro corretamente', () => {
      cy.get('solutio-area').within(() => {
        cy.get('[role="status"]').should('not.exist');
        cy.get('[role="alert"]').should('not.exist');
      });
    });
  });

  describe('Gráfico de Donut', () => {
    it('deve exibir o gráfico de donut', () => {
      getDonutChart().should('be.visible');
    });

    it('deve ter estrutura semântica correta', () => {
      getDonutChart().should('have.attr', 'role', 'img');
      getDonutChart().should('have.attr', 'aria-label');
    });

    it('deve exibir estados de loading e erro corretamente', () => {
      cy.get('solutio-donut').within(() => {
        cy.get('[role="status"]').should('not.exist');
        cy.get('[role="alert"]').should('not.exist');
      });
    });
  });
});

