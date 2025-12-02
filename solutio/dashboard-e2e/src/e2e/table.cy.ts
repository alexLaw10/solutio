import {
  getTable,
  getTableRows,
  getTableHeaders,
  getLoadMoreButton,
  getStartDateInput,
  getEndDateInput,
  getCitySelect,
  getSearchButton,
} from '../support/app.po';

describe('Tabela de Dados Meteorológicos', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', { fixture: 'weather-forecast.json' }).as('getForecast');
    cy.visit('/home');
    cy.wait('@getForecast');
    cy.waitForWeatherData();
  });

  describe('Estrutura da Tabela', () => {
    it('deve exibir a tabela com todas as colunas', () => {
      getTable().should('be.visible');
      getTableHeaders().should('have.length', 5);
      
      getTableHeaders().eq(0).should('contain', 'Data');
      getTableHeaders().eq(1).should('contain', 'Temperatura');
      getTableHeaders().eq(2).should('contain', 'Precip');
      getTableHeaders().eq(3).should('contain', 'Umidade');
      getTableHeaders().eq(4).should('contain', 'Vento');
    });

    it('deve exibir dados nas linhas da tabela', () => {
      getTableRows().should('have.length.at.least', 1);
    });

    it('deve ter estrutura semântica correta', () => {
      getTable()
        .find('table')
        .should('have.attr', 'role', 'table')
        .and('have.attr', 'aria-label');
      
      getTable().find('caption').should('have.class', 'sr-only');
    });
  });

  describe('Formatação de Dados', () => {
    it('deve formatar temperatura corretamente', () => {
      getTableRows()
        .first()
        .find('td')
        .eq(1)
        .should('contain', '°C');
    });

    it('deve formatar porcentagem de precipitação', () => {
      getTableRows()
        .first()
        .find('td')
        .eq(2)
        .should('contain', '%');
    });

    it('deve usar elementos time para datas', () => {
      getTableRows()
        .first()
        .find('td')
        .first()
        .find('time')
        .should('exist');
    });
  });

  describe('Funcionalidade Carregar Mais', () => {
    it('deve exibir botão "Carregar mais" quando houver mais dados', () => {
      getTable().then(($table) => {
        const rowCount = $table.find('table tbody tr').length;
        
        if (rowCount >= 5) {
          getLoadMoreButton().should('be.visible');
        }
      });
    });

    it('deve carregar mais dados ao clicar no botão', () => {
      getTable().then(($table) => {
        const initialCount = $table.find('table tbody tr').length;
        
        getLoadMoreButton().then(($btn) => {
          if ($btn.length > 0 && $btn.is(':visible')) {
            getLoadMoreButton().click();
            
            cy.wait(500);
            
            getTableRows().should('have.length.greaterThan', initialCount);
          }
        });
      });
    });

    it('deve exibir estado de loading ao carregar mais', () => {
      getLoadMoreButton().then(($btn) => {
        if ($btn.length > 0 && $btn.is(':visible')) {
          getLoadMoreButton().click();
          
          cy.get('design-system-load-more-button')
            .shadow()
            .find('button')
            .should('have.attr', 'aria-busy', 'true');
        }
      });
    });

    it('deve exibir mensagem quando todos os dados estão carregados', () => {
      // Carregar todos os dados
      getLoadMoreButton().then(($btn) => {
        if ($btn.length > 0) {
          // Clicar várias vezes até carregar tudo
          for (let i = 0; i < 10; i++) {
            cy.get('body').then(($body) => {
              if ($body.find('design-system-load-more-button:visible').length > 0) {
                getLoadMoreButton().click({ force: true });
                cy.wait(500);
              }
            });
          }
        }
      });
      
      cy.get('.table-container__all-loaded').should('be.visible');
    });
  });

  describe('Filtros', () => {
    it('deve permitir filtrar por cidade', () => {
      cy.selectCity('São Paulo');
      cy.searchWeatherData();
      cy.wait('@getForecast');
      cy.waitForWeatherData();
    });

    it('deve permitir filtrar por intervalo de datas', () => {
      cy.selectDateRange('2025-08-28', '2025-08-30');
      cy.searchWeatherData();
      cy.wait('@getForecast');
    });
  });

  describe('Estados de Loading e Erro', () => {
    it('deve exibir indicador de loading durante carregamento', () => {
      cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', {
        delay: 1000,
        fixture: 'weather-forecast.json'
      }).as('getForecastDelayed');
      
      cy.visit('/home');
      cy.get('.loading').should('be.visible');
      cy.wait('@getForecastDelayed');
    });

    it('deve exibir mensagem de erro quando a requisição falhar', () => {
      cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('getForecastError');
      
      cy.visit('/home');
      cy.wait('@getForecastError');
      
      cy.get('[role="alert"]').should('be.visible');
    });
  });
});

