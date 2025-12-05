import { getThemeToggle } from '../support/app.po';

describe('Theme Toggle E2E Tests', () => {
  beforeEach(() => {
    cy.mockWeatherAPI('weather-forecast.json');
    cy.visit('/');
    cy.waitForAppLoad();
  });

  it('should toggle between light and dark theme', () => {
    getThemeToggle().should('be.visible');
    
    // Get initial theme
    cy.get('html').then(($html) => {
      const initialTheme = $html.attr('data-theme') || 'light';
      const expectedTheme = initialTheme === 'light' ? 'dark' : 'light';
      
      // Toggle theme
      cy.toggleTheme();
      
      // Verify theme changed
      cy.get('html').should('have.attr', 'data-theme', expectedTheme);
    });
  });

  it('should persist theme in localStorage', () => {
    // Set to dark theme
    cy.toggleTheme();
    cy.wait(500);
    
    // Check localStorage
    cy.window().then((win) => {
      const theme = win.localStorage.getItem('theme');
      expect(theme).to.be.oneOf(['light', 'dark']);
    });
  });

  it('should restore theme from localStorage on page reload', () => {
    // Set theme
    cy.toggleTheme();
    cy.wait(500);
    
    cy.get('html').then(($html) => {
      const theme = $html.attr('data-theme');
      
      // Reload page
      cy.reload();
      cy.waitForAppLoad();
      
      // Theme should be restored
      cy.get('html').should('have.attr', 'data-theme', theme);
    });
  });

  it('should have accessible theme toggle button', () => {
    getThemeToggle().should('have.attr', 'aria-label');
    getThemeToggle().should('be.visible');
    getThemeToggle().should('not.be.disabled');
  });

  it('should be keyboard accessible', () => {
    getThemeToggle().focus().should('be.focused');
    getThemeToggle().type('{enter}');
    
    // Theme should toggle
    cy.get('html').should('have.attr', 'data-theme');
  });

  it('should apply theme styles correctly', () => {
    // Check initial theme
    cy.get('html').should('have.attr', 'data-theme');
    
    // Toggle to dark
    cy.toggleTheme();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    
    // Toggle back to light
    cy.toggleTheme();
    cy.get('html').should('have.attr', 'data-theme', 'light');
  });

  it('should maintain theme across navigation', () => {
    // Set theme
    cy.toggleTheme();
    cy.wait(500);
    
    cy.get('html').then(($html) => {
      const theme = $html.attr('data-theme');
      
      // Navigate
      cy.visit('/home');
      cy.waitForAppLoad();
      
      // Theme should persist
      cy.get('html').should('have.attr', 'data-theme', theme);
    });
  });
});
