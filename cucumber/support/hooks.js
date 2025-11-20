// support/hooks.js
// Hooks globales para Cucumber

const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');

// Ejecutar antes de cada escenario
Before(function() {
  console.log('========== Iniciando escenario ==========');
});

// Ejecutar después de cada escenario
After(async function(scenario) {
  if (scenario.result.status === Status.FAILED) {
    console.log(`❌ Escenario FALLIDO: ${scenario.pickle.name}`);
    // Aquí puedes agregar captura de pantalla en caso de fallo
  } else if (scenario.result.status === Status.PASSED) {
    console.log(`✅ Escenario EXITOSO: ${scenario.pickle.name}`);
  }
});

// Ejecutar antes de todos los escenarios
BeforeAll(async function() {
  console.log('Inicializando suite de pruebas...');
});

// Ejecutar después de todos los escenarios
AfterAll(async function() {
  console.log('Suite de pruebas finalizada.');
});
