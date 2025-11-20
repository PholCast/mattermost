// cucumber.js
// Archivo de configuración de Cucumber

const common = `--require-module ts-node/register --require 'step_definitions/**/*.js' --format progress-bar --format html:cucumber-report.html`;

module.exports = {
  default: common,
  // Perfiles específicos
  smoke: `${common} --tags @smoke`,
  regression: `${common} --tags @regression`,
  critical: `${common} --tags @critical`
};
