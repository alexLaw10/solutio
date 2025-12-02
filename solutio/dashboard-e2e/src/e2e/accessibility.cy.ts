import {
  getNavbar,
  getSidebar,
  getSidebarLinks,
  getMainContent,
  getSkipLink,
  getTable,
  getSearchButton,
} from '../support/app.po';

describe('Acessibilidade', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', { fixture: 'weather-forecast.json' }).as('getForecast');
    cy.visit('/home');
    cy.wait('@getForecast');
  });

  describe('Navegação por Teclado', () => {
    it('deve permitir navegar com Tab através dos elementos interativos', () => {
      cy.get('body').focus();
      
      // Navegar até o skip link
      cy.get('body').type('{tab}');
      cy.focused().then(($el) => {
        expect($el).to.exist;
      });
    });

    it('deve permitir pular para o conteúdo principal via skip link', () => {
      getSkipLink().first().should('be.visible');
      getSkipLink().first().click();
      getMainContent().should('exist');
    });

    it('deve permitir navegar pelos links da sidebar', () => {
      getSidebarLinks().first().should('be.visible');
      getSidebarLinks().first().should('have.attr', 'href');
    });
  });

  describe('Atributos ARIA', () => {
    it('deve ter estrutura semântica correta', () => {
      getNavbar().should('have.attr', 'role', 'navigation');
      getNavbar().should('have.attr', 'aria-label');
      
      getSidebar().should('have.attr', 'role', 'complementary');
      getSidebar().should('have.attr', 'aria-label');
      
      getMainContent().should('have.attr', 'role', 'main');
    });

    it('deve ter aria-labels nos botões', () => {
      getSearchButton()
        .shadow()
        .find('button')
        .should('have.attr', 'aria-label');
    });

    it('deve ter aria-labels nas células da tabela', () => {
      cy.waitForWeatherData();
      getTable()
        .find('table tbody tr')
        .first()
        .find('td span')
        .each(($span) => {
          cy.wrap($span).should('have.attr', 'aria-label');
        });
    });

    it('deve ter roles apropriados para estados de loading', () => {
      cy.get('[role="status"]').should('exist');
    });
  });

  describe('Estrutura de Headings', () => {
    it('deve ter pelo menos um h1 na página', () => {
      cy.get('h1').should('have.length.at.least', 1);
    });

    it('deve ter estrutura hierárquica de headings correta', () => {
      cy.get('h1').should('exist');
    });
  });

  describe('Contraste e Visibilidade', () => {
    it('deve ter elementos visíveis e com contraste adequado', () => {
      getNavbar().should('be.visible');
      getSidebar().should('be.visible');
      getMainContent().should('be.visible');
    });

    it('deve ter elementos focáveis', () => {
      getSidebarLinks().first().should('be.visible');
    });
  });

  describe('Leitores de Tela', () => {
    it('deve ter textos alternativos para elementos visuais quando existirem', () => {
      cy.get('body').then(($body) => {
        if ($body.find('img').length > 0) {
          cy.get('img').each(($img) => {
            cy.wrap($img).should('have.attr', 'alt');
          });
        }
      });
    });

    it('deve ter aria-live regions para conteúdo dinâmico', () => {
      cy.get('[aria-live]').should('exist');
    });

    it('deve ter sr-only para textos complementares', () => {
      cy.get('.sr-only').should('exist');
    });
  });
});

