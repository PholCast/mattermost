const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:8065',
        supportFile: false,
        specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',

        setupNodeEvents(on, config) {
        },
    },
});