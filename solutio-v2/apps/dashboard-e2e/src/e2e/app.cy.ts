import {
  getNavbar,
  getSidebar,
  getHomeComponent,
  getTableComponent,
  getSidebarHomeLink,
  getThemeToggle,
  getTableRows,
  getTableStartDateInput,
  getTableEndDateInput,
  getTableCitySelect,
  getLoadMoreButton,
  getAllLoadedMessage,
  getKpiComponent,
  getAreaChart,
  getBarChart,
  getDonutChart,
  getAlertComponent,
} from '../support/app.po';

describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    // Mock API before visiting
    cy.mockWeatherAPI('weather-forecast.json');
    cy.visit('/');
    cy.waitForAppLoad();
  });

  describe('Navigation', () => {
    it('should navigate to home page by default', () => {
      cy.url().should('include', '/home');
      getHomeComponent().should('be.visible');
    });

    it('should have sidebar visible', () => {
      getSidebar().should('be.visible');
    });

    it('should have navbar visible', () => {
      getNavbar().should('be.visible');
    });

    it('should navigate when clicking sidebar home link', () => {
      getSidebarHomeLink().should('be.visible').click();
      cy.url().should('include', '/home');
      getHomeComponent().should('be.visible');
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle theme when clicking theme toggle button', () => {
      getThemeToggle().should('be.visible');
      
      // Get initial theme
      cy.get('html').then(($html) => {
        const initialTheme = $html.attr('data-theme') || 'light';
        
        // Click toggle
        cy.toggleTheme();
        
        // Wait for theme change
        cy.get('html').should('have.attr', 'data-theme').and('not.eq', initialTheme);
      });
    });

    it('should persist theme preference', () => {
      cy.toggleTheme();
      cy.get('html').then(($html) => {
        const theme = $html.attr('data-theme');
        
        // Reload page
        cy.reload();
        cy.waitForAppLoad();
        
        // Theme should persist
        cy.get('html').should('have.attr', 'data-theme', theme);
      });
    });

    it('should have accessible theme toggle', () => {
      getThemeToggle().should('have.attr', 'aria-label');
      getThemeToggle().should('be.visible');
      getThemeToggle().should('not.be.disabled');
    });
  });

  describe('Home Page', () => {
    it('should display home component', () => {
      getHomeComponent().should('be.visible');
    });

    it('should display table component', () => {
      getTableComponent().should('be.visible');
    });

    it('should display KPI component', () => {
      getKpiComponent().should('be.visible');
    });

    it('should display charts after data loads', () => {
      cy.waitForDataLoad();
      
      // Charts might take time to render
      cy.wait(1000);
      
      // Check if charts are present
      getAreaChart().should('exist');
      getBarChart().should('exist');
      getDonutChart().should('exist');
    });
  });

  describe('Table Component', () => {
    it('should display table with data', () => {
      getTableComponent().should('be.visible');
      cy.waitForDataLoad();
      
      // Check if table has rows
      getTableRows().should('have.length.at.least', 1);
    });

    it('should have date inputs', () => {
      getTableStartDateInput().should('be.visible');
      getTableEndDateInput().should('be.visible');
    });

    it('should have city select with all cities', () => {
      getTableCitySelect().should('be.visible');
      getTableCitySelect().should('contain', 'João Pessoa');
      getTableCitySelect().should('contain', 'São Paulo');
      getTableCitySelect().should('contain', 'Rio de Janeiro');
      getTableCitySelect().should('contain', 'Brasília');
    });

    it('should change city when selecting from dropdown', () => {
      cy.selectCity('São Paulo');
      
      // Verify city was changed
      getTableCitySelect().should('have.value', 'São Paulo');
    });

    it('should change start date', () => {
      const newDate = '2025-09-01';
      getTableStartDateInput().clear().type(newDate);
      cy.wait(500);
      
      getTableStartDateInput().should('have.value', newDate);
    });

    it('should change end date', () => {
      const newDate = '2025-09-05';
      getTableEndDateInput().clear().type(newDate);
      cy.wait(500);
      
      getTableEndDateInput().should('have.value', newDate);
    });

    it('should filter data when date range changes', () => {
      cy.selectDateRange('2025-09-01', '2025-09-05');
      
      // Wait for API call
      cy.wait('@getForecast');
      cy.waitForDataLoad();
      
      // Verify dates were set
      getTableStartDateInput().should('have.value', '2025-09-01');
      getTableEndDateInput().should('have.value', '2025-09-05');
    });

    it('should show load more button when there is more data', () => {
      cy.waitForDataLoad();
      
      getLoadMoreButton().then(($btn) => {
        if ($btn.length > 0) {
          getLoadMoreButton().should('be.visible');
          const initialRowCount = getTableRows().its('length');
          
          getLoadMoreButton().click();
          cy.wait(500);
          
          getTableRows().its('length').should('be.greaterThan', initialRowCount);
        }
      });
    });

    it('should show all loaded message when all data is displayed', () => {
      cy.waitForDataLoad();
      
      // Try to load all data
      getLoadMoreButton().then(($btn) => {
        if ($btn.length > 0) {
          // Click load more multiple times
          for (let i = 0; i < 5; i++) {
            cy.get('body').then(($body) => {
              if ($body.find('button:contains("Carregar mais")').length > 0) {
                getLoadMoreButton().click();
                cy.wait(500);
              }
            });
          }
        }
        
        // Check for all loaded message
        getAllLoadedMessage().should('exist');
      });
    });
  });

  describe('Responsive Design', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];

    viewports.forEach(({ name, width, height }) => {
      it(`should be responsive on ${name} viewport`, () => {
        cy.viewport(width, height);
        
        getSidebar().should('be.visible');
        getNavbar().should('be.visible');
        getHomeComponent().should('be.visible');
        getTableComponent().should('be.visible');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      getThemeToggle().should('have.attr', 'aria-label');
      cy.get('solutio-v2-table table').should('have.attr', 'aria-label');
    });

    it('should have proper heading structure', () => {
      cy.get('h1, h2, h3').should('exist');
    });

    it('should be keyboard navigable', () => {
      // Tab through interactive elements
      cy.get('body').tab();
      
      // Theme toggle should be focusable
      getThemeToggle().focus().should('be.focused');
      
      // Tab to next element
      cy.focused().tab();
    });

    it('should pass basic accessibility checks', () => {
      cy.checkA11y();
    });
  });

  describe('Error Handling', () => {
    it('should display error alert when API fails', () => {
      // Mock API failure
      cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('getForecastError');
      
      cy.visit('/');
      cy.wait('@getForecastError');
      
      // Check if alert component exists and shows error
      getAlertComponent().should('exist');
      cy.get('solutio-v2-alert').should('be.visible');
    });

    it('should handle network errors gracefully', () => {
      // Mock network error
      cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', {
        forceNetworkError: true,
      }).as('getForecastNetworkError');
      
      cy.visit('/');
      cy.wait('@getForecastNetworkError');
      
      // Should show error message
      cy.get('solutio-v2-alert', { timeout: 10000 }).should('be.visible');
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching data', () => {
      // Mock slow API response
      cy.intercept('GET', '**/api.open-meteo.com/v1/forecast*', {
        delay: 2000,
        fixture: 'weather-forecast.json',
      }).as('getForecastSlow');
      
      cy.visit('/');
      
      // Should show loading indicator
      cy.get('.loading', { timeout: 5000 }).should('be.visible');
      
      cy.wait('@getForecastSlow');
      cy.waitForLoadingToFinish();
      
      // Content should be loaded
      getHomeComponent().should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should load page within acceptable time', () => {
      const startTime = Date.now();
      
      cy.visit('/');
      cy.waitForAppLoad();
      
      cy.then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(5000); // 5 seconds max
      });
    });

    it('should render charts within acceptable time', () => {
      cy.visit('/');
      cy.waitForAppLoad();
      
      const startTime = Date.now();
      cy.waitForDataLoad();
      
      cy.then(() => {
        const renderTime = Date.now() - startTime;
        expect(renderTime).to.be.lessThan(10000); // 10 seconds max for charts
      });
    });
  });
});
