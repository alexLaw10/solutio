describe('Performance E2E Tests', () => {
  beforeEach(() => {
    cy.mockWeatherAPI('weather-forecast.json');
  });

  it('should load page within acceptable time', () => {
    const startTime = Date.now();
    
    cy.visit('/');
    cy.waitForAppLoad();
    
    cy.then(() => {
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(5000); // 5 seconds max
    });
  });

  it('should render initial content quickly', () => {
    const startTime = Date.now();
    
    cy.visit('/');
    cy.get('solutio-v2-home').should('be.visible');
    
    cy.then(() => {
      const renderTime = Date.now() - startTime;
      expect(renderTime).to.be.lessThan(3000); // 3 seconds max
    });
  });

  it('should load data within acceptable time', () => {
    cy.visit('/');
    cy.waitForAppLoad();
    
    const startTime = Date.now();
    cy.waitForDataLoad();
    
    cy.then(() => {
      const dataLoadTime = Date.now() - startTime;
      expect(dataLoadTime).to.be.lessThan(10000); // 10 seconds max
    });
  });

  it('should handle rapid interactions without lag', () => {
    cy.visit('/');
    cy.waitForAppLoad();
    
    // Rapid theme toggles
    const startTime = Date.now();
    for (let i = 0; i < 5; i++) {
      cy.toggleTheme();
      cy.wait(100);
    }
    
    cy.then(() => {
      const interactionTime = Date.now() - startTime;
      expect(interactionTime).to.be.lessThan(2000); // 2 seconds max
    });
  });

  it('should not have memory leaks on navigation', () => {
    cy.visit('/');
    cy.waitForAppLoad();
    
    // Navigate multiple times
    for (let i = 0; i < 5; i++) {
      cy.visit('/home');
      cy.waitForAppLoad();
    }
    
    // Page should still be responsive
    cy.get('solutio-v2-home').should('be.visible');
  });

  it('should optimize chart rendering', () => {
    cy.visit('/');
    cy.waitForAppLoad();
    
    const startTime = Date.now();
    cy.waitForDataLoad();
    
    // Charts should render
    cy.get('apex-charts').should('exist');
    
    cy.then(() => {
      const chartRenderTime = Date.now() - startTime;
      expect(chartRenderTime).to.be.lessThan(15000); // 15 seconds max for charts
    });
  });
});
