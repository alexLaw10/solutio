import {
  getTable,
  getKpiCards,
  getBarChart,
  getAreaChart,
  getDonutChart,
  getThemeToggle,
  getNavbar,
  getSidebar,
  getStartDateInput,
  getEndDateInput,
  getCitySelect,
  getSearchButton,
} from '../support/app.po';

describe('Dashboard - Página Principal', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', { fixture: 'weather-forecast.json' }).as('getForecast');
    cy.visit('/home');
    cy.wait('@getForecast');
  });

  it('deve exibir todos os componentes principais', () => {
    getNavbar().should('be.visible');
    getSidebar().should('be.visible');
    getThemeToggle().should('be.visible');
  });

  it('deve exibir estrutura completa da página', () => {
    cy.get('#main-content').should('be.visible');
    getNavbar().should('have.attr', 'role', 'navigation');
    getSidebar().should('have.attr', 'role', 'complementary');
  });

  it('deve alternar entre tema claro e escuro', () => {
    cy.get('html').should('have.attr', 'data-theme', 'light');
    cy.toggleTheme();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    cy.toggleTheme();
    cy.get('html').should('have.attr', 'data-theme', 'light');
  });
});

describe('Dashboard - Componentes de Dados Meteorológicos', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', { fixture: 'weather-forecast.json' }).as('getForecast');
    cy.visit('/home');
    cy.wait('@getForecast');
    cy.waitForWeatherData();
  });

  it('deve exibir todos os componentes após carregamento', () => {
    getTable().should('be.visible');
    getKpiCards().should('have.length.at.least', 1);
    getBarChart().should('be.visible');
    getAreaChart().should('be.visible');
    getDonutChart().should('be.visible');
  });

  it('deve exibir estrutura semântica correta nos gráficos', () => {
    getBarChart().should('have.attr', 'role', 'img');
    getAreaChart().should('have.attr', 'role', 'img');
    getDonutChart().should('have.attr', 'role', 'img');
  });
});

describe('Dashboard - Filtros e Busca', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', { fixture: 'weather-forecast.json' }).as('getForecast');
    cy.visit('/home');
  });

  it('deve exibir todos os filtros', () => {
    getStartDateInput().should('be.visible');
    getEndDateInput().should('be.visible');
    getCitySelect().should('be.visible');
    getSearchButton().should('be.visible');
  });

  it('deve permitir selecionar uma cidade', () => {
    cy.selectCity('São Paulo');
  });

  it('deve permitir alterar as datas', () => {
    cy.selectDateRange('2025-08-28', '2025-08-30');
  });

  it('deve buscar dados ao clicar no botão de busca', () => {
    cy.selectCity('Rio de Janeiro');
    cy.searchWeatherData();
    cy.wait('@getForecast');
  });

  it('deve validar campos obrigatórios', () => {
    getStartDateInput()
      .shadow()
      .find('input')
      .should('have.attr', 'required');
    
    getEndDateInput()
      .shadow()
      .find('input')
      .should('have.attr', 'required');
    
    getCitySelect()
      .shadow()
      .find('select')
      .should('have.attr', 'required');
  });
});
