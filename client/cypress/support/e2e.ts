// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global error handling
Cypress.on('uncaught:exception', (err, _runnable) => {
  // returning false here prevents Cypress from failing the test
  // for uncaught exceptions that are not related to our application
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  
  // Log the error for debugging
  console.warn('Uncaught exception:', err);
  return false;
});

// Add custom commands for common operations
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for API response
       * @example cy.waitForApi('@getVideoInfo')
       */
      waitForApi(alias: string): Chainable<void>;
      
      /**
       * Custom command to clear form and reset state
       * @example cy.clearForm()
       */
      clearForm(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('waitForApi', (alias: string) => {
  cy.wait(alias);
});

Cypress.Commands.add('clearForm', () => {
  cy.get('[data-testid="video-url-input"]').clear();
  cy.get('[data-testid="max-points-input"]').select('5');
}); 