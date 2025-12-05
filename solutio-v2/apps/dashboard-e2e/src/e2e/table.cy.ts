import {
  getTableComponent,
  getTableRows,
  getTableStartDateInput,
  getTableEndDateInput,
  getTableCitySelect,
  getLoadMoreButton,
  getAllLoadedMessage,
} from '../support/app.po';

describe('Table Component E2E Tests', () => {
  beforeEach(() => {
    cy.mockWeatherAPI('weather-forecast.json');
    cy.visit('/home');
    cy.waitForAppLoad();
    cy.waitForDataLoad();
  });

  describe('Table Filters', () => {
    it('should filter by start date', () => {
      getTableStartDateInput().should('be.visible');
      
      const newDate = '2025-09-01';
      getTableStartDateInput().clear().type(newDate);
      
      cy.wait('@getForecast');
      cy.waitForDataLoad();
      
      getTableStartDateInput().should('have.value', newDate);
    });

    it('should filter by end date', () => {
      getTableEndDateInput().should('be.visible');
      
      const newDate = '2025-09-05';
      getTableEndDateInput().clear().type(newDate);
      
      cy.wait('@getForecast');
      cy.waitForDataLoad();
      
      getTableEndDateInput().should('have.value', newDate);
    });

    it('should filter by city', () => {
      getTableCitySelect().should('be.visible');
      
      // Change to São Paulo
      cy.selectCity('São Paulo');
      
      getTableCitySelect().should('have.value', 'São Paulo');
    });

    it('should validate date range and show warnings', () => {
      // Set invalid range (start after end)
      getTableStartDateInput().clear().type('2025-09-05');
      getTableEndDateInput().clear().type('2025-09-01');
      
      cy.wait(1000);
      
      // Should show warning
      cy.get('solutio-v2-table .warning').should('exist');
    });

    it('should validate dates outside allowed range', () => {
      // Try to set date before min date
      getTableStartDateInput().clear().type('2025-08-01');
      cy.wait(500);
      
      // Should show warning or adjust date
      cy.get('solutio-v2-table .warning').should('exist');
    });
  });

  describe('Table Data', () => {
    it('should display table rows with data', () => {
      getTableRows().should('have.length.at.least', 1);
      
      // Check first row has data
      getTableRows().first().within(() => {
        cy.get('td').should('have.length', 5); // Date, Temp, Prec, Hum, Wind
      });
    });

    it('should display temperature data correctly', () => {
      getTableRows().first().within(() => {
        cy.contains('°C').should('exist');
        cy.get('td').eq(1).should('contain', '°C');
      });
    });

    it('should display precipitation data correctly', () => {
      getTableRows().first().within(() => {
        cy.contains('%').should('exist');
        cy.get('td').eq(2).should('contain', '%');
      });
    });

    it('should display humidity data correctly', () => {
      getTableRows().first().within(() => {
        cy.get('td').eq(3).should('exist');
      });
    });

    it('should display wind speed data correctly', () => {
      getTableRows().first().within(() => {
        cy.get('td').eq(4).should('exist');
      });
    });

    it('should handle empty data gracefully', () => {
      // Mock empty response
      cy.mockWeatherAPI('weather-forecast-empty.json');
      cy.reload();
      cy.waitForAppLoad();
      
      // Should show empty state or no rows
      getTableRows().should('have.length', 0);
    });
  });

  describe('Pagination', () => {
    it('should load more data when clicking load more button', () => {
      getLoadMoreButton().then(($btn) => {
        if ($btn.length > 0) {
          const initialRowCount = getTableRows().its('length');
          
          getLoadMoreButton().click();
          cy.wait(500);
          
          getTableRows().its('length').should('be.greaterThan', initialRowCount);
        }
      });
    });

    it('should show all loaded message when all data is displayed', () => {
      // Try to load all data
      getLoadMoreButton().then(($btn) => {
        if ($btn.length > 0) {
          // Click multiple times to load all
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

    it('should disable load more button while loading', () => {
      getLoadMoreButton().then(($btn) => {
        if ($btn.length > 0) {
          getLoadMoreButton().click();
          
          // Button should be disabled while loading
          cy.get('button:contains("Carregando...")').should('exist');
        }
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper table structure', () => {
      cy.get('solutio-v2-table table').should('exist');
      cy.get('solutio-v2-table thead').should('exist');
      cy.get('solutio-v2-table tbody').should('exist');
      cy.get('solutio-v2-table caption').should('exist');
    });

    it('should have proper ARIA labels', () => {
      getTableStartDateInput().should('have.attr', 'id');
      getTableEndDateInput().should('have.attr', 'id');
      getTableCitySelect().should('have.attr', 'id');
      
      // Check for labels
      cy.get('label[for="start"]').should('exist');
      cy.get('label[for="end"]').should('exist');
      cy.get('label[for="city"]').should('exist');
    });

    it('should be keyboard navigable', () => {
      getTableStartDateInput().focus().should('be.focused');
      cy.focused().tab();
      getTableEndDateInput().should('be.focused');
      cy.focused().tab();
      getTableCitySelect().should('be.focused');
    });

    it('should have proper table headers', () => {
      cy.get('solutio-v2-table thead th').should('have.length.at.least', 1);
      cy.get('solutio-v2-table thead th').each(($th) => {
        cy.wrap($th).should('have.attr', 'scope', 'col');
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      getTableStartDateInput().should('have.attr', 'required');
      getTableEndDateInput().should('have.attr', 'required');
      getTableCitySelect().should('have.attr', 'required');
    });

    it('should enforce date constraints', () => {
      getTableStartDateInput().should('have.attr', 'min');
      getTableStartDateInput().should('have.attr', 'max');
      getTableEndDateInput().should('have.attr', 'min');
      getTableEndDateInput().should('have.attr', 'max');
    });
  });
});
