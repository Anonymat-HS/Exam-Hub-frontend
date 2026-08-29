import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1440,
  viewportHeight: 900,
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'e2e-tests/e2e/**/*.cy.js',
    supportFile: 'e2e-tests/support/e2e.js',
    fixturesFolder: 'e2e-tests/fixtures',
    video: false,
    chromeWebSecurity: false,
  },
});
