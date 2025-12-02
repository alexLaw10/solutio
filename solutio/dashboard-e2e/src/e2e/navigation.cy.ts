import {
  getNavbar,
  getSidebar,
  getSidebarLinks,
  getThemeToggle,
  getMainContent,
} from '../support/app.po';

describe('Navegação', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', { fixture: 'weather-forecast.json' }).as('getForecast');
    cy.visit('/home');
  });

  describe('Navbar', () => {
    it('deve exibir a navbar com título', () => {
      getNavbar().should('be.visible');
      getNavbar().should('contain', 'Dashboard');
    });

    it('deve ter link para página inicial no título', () => {
      getNavbar()
        .find('.navbar__title-link')
        .should('have.attr', 'href', '/')
        .and('have.attr', 'aria-label');
    });

    it('deve ter estrutura semântica correta', () => {
      getNavbar().should('have.attr', 'role', 'navigation');
      getNavbar().should('have.attr', 'aria-label', 'Navegação principal');
    });
  });

  describe('Sidebar', () => {
    it('deve exibir a sidebar com itens de menu', () => {
      getSidebar().should('be.visible');
      getSidebarLinks().should('have.length.at.least', 1);
    });

    it('deve destacar o item de menu ativo', () => {
      getSidebarLinks()
        .contains('Home')
        .should('have.class', 'sidebar__link--active');
    });

    it('deve ter estrutura semântica correta', () => {
      getSidebar().should('have.attr', 'role', 'complementary');
      getSidebar().should('have.attr', 'aria-label');
      getSidebar().should('have.attr', 'id', 'navigation');
    });

    it('deve permitir navegação pelos links', () => {
      getSidebarLinks().each(($link) => {
        cy.wrap($link).should('have.attr', 'href');
        cy.wrap($link).should('have.attr', 'role', 'menuitem');
      });
    });
  });

  describe('Toggle de Tema', () => {
    it('deve exibir o botão de alternar tema', () => {
      getThemeToggle().should('be.visible');
    });

    it('deve ter aria-label no botão', () => {
      getThemeToggle().should('have.attr', 'aria-label', 'Alternar tema');
    });

    it('deve alternar entre tema claro e escuro', () => {
      cy.get('html').should('have.attr', 'data-theme', 'light');
      
      cy.toggleTheme();
      cy.get('html').should('have.attr', 'data-theme', 'dark');
      
      cy.toggleTheme();
      cy.get('html').should('have.attr', 'data-theme', 'light');
    });
  });

  describe('Conteúdo Principal', () => {
    it('deve exibir o conteúdo principal', () => {
      getMainContent().should('be.visible');
      getMainContent().should('have.attr', 'role', 'main');
      getMainContent().should('have.attr', 'id', 'main-content');
    });

    it('deve ser focável para skip links', () => {
      getMainContent().should('have.attr', 'tabindex', '-1');
    });
  });
});

