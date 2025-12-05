// ***********************************************************
// Cypress support file - loaded before all test files
// ***********************************************************

// Import commands
import './commands';

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore ResizeObserver errors (common in chart libraries)
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  
  // Ignore zone.js errors in tests
  if (err.message.includes('Zone')) {
    return false;
  }
  
  // Return true to fail the test on other errors
  return true;
});

// Log unhandled promise rejections
Cypress.on('window:before:load', (win) => {
  win.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
  });
});
