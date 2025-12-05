/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Wait for the application to be fully loaded
     * @example cy.waitForAppLoad()
     */
    waitForAppLoad(): Chainable<void>;
    
    /**
     * Wait for API data to load
     * @example cy.waitForDataLoad()
     */
    waitForDataLoad(): Chainable<void>;
    
    /**
     * Mock weather API response
     * @param fixture - Name of the fixture file (default: 'weather-forecast.json')
     * @param statusCode - HTTP status code (default: 200)
     * @example cy.mockWeatherAPI('weather-forecast.json', 200)
     */
    mockWeatherAPI(fixture?: string, statusCode?: number): Chainable<void>;
    
    /**
     * Select city from dropdown
     * @param cityName - Name of the city to select
     * @example cy.selectCity('São Paulo')
     */
    selectCity(cityName: string): Chainable<void>;
    
    /**
     * Select date range
     * @param startDate - Start date in YYYY-MM-DD format
     * @param endDate - End date in YYYY-MM-DD format
     * @example cy.selectDateRange('2025-09-01', '2025-09-05')
     */
    selectDateRange(startDate: string, endDate: string): Chainable<void>;
    
    /**
     * Toggle theme between light and dark
     * @example cy.toggleTheme()
     */
    toggleTheme(): Chainable<void>;
    
    /**
     * Wait for loading indicators to finish
     * @example cy.waitForLoadingToFinish()
     */
    waitForLoadingToFinish(): Chainable<void>;
    
    /**
     * Check basic accessibility requirements
     * @param selector - CSS selector to check (default: 'body')
     * @example cy.checkA11y('solutio-v2-table')
     */
    checkA11y(selector?: string): Chainable<void>;
  }
}
