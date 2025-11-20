const reporter = require('cucumber-html-reporter');

reporter.generate({
  theme: 'bootstrap',
  jsonFile: 'reports/report.json',
  output: 'reports/report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  name: 'Mattermost Test Execution Report',
  brandTitle: 'Mattermost E2E Test Report',
  metadata: {
    "Project": "SerenityJS E2E",
    "Browser": "API Tests",
    "Platform": process.platform,
    "Executed": "Local",
    "Environment": "Development"
  }
});