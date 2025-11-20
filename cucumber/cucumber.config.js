// cucumber.config.js
// Configuración avanzada de Cucumber

const baseConfig = {
  require: ['step_definitions/**/*.js'],
  requireModule: ['@babel/register'],
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    'junit:reports/cucumber-report.xml'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  publishQuiet: true,
  dryRun: false,
  failFast: false,
  parallel: 1,
  timeout: 30000,
  strict: true
};

const profiles = {
  default: {
    ...baseConfig
  },
  
  smoke: {
    ...baseConfig,
    tags: '@smoke',
    parallel: 1
  },

  regression: {
    ...baseConfig,
    tags: '@regression',
    parallel: 2
  },

  critical: {
    ...baseConfig,
    tags: '@critical',
    parallel: 1,
    failFast: true
  },

  development: {
    ...baseConfig,
    tags: 'not @skip',
    dryRun: false,
    format: ['progress-bar']
  }
};

module.exports = profiles;
