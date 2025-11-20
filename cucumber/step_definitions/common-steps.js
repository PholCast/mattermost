// step_definitions/common-steps.js

const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');
// AGREGADO: Importaciones necesarias para guardar capturas de pantalla
const fs = require('fs');
const path = require('path');

// AUMENTA EL TIMEOUT GLOBAL DE CUCUMBER A 60 SEGUNDOS
setDefaultTimeout(60 * 1000);

const BASE_URL = 'http://localhost:8065';

let browser;
let page;

// ===== HOOKS =====
Before(async function() {
  browser = await puppeteer.launch({
    headless: false, // Déjalo en false para ver qué pasa
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ],
    defaultViewport: {
      width: 1280,
      height: 800
    }
  });

  page = await browser.newPage();
  
  // Configurar timeouts POR DEFECTO DE PUPPETEER A 60 SEGUNDOS
  // Esto ayuda a que waitForSelector no falle a los 30s
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);

  // Logging
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  
  // Guardar referencia en el context para compartir entre pasos si es necesario
  this.browser = browser;
  this.page = page;
});

After(async function(scenario) {
  if (scenario.result.status === 'FAILED') {
    // Tomar captura de pantalla en caso de fallo
    // Usamos path.resolve para evitar problemas de rutas relativas
    const screenshotDir = path.resolve(__dirname, '../screenshots');
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Limpiar nombre del archivo para evitar caracteres inválidos
    const safeName = scenario.pickle.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${safeName}_${Date.now()}.png`;
    
    await page.screenshot({ path: path.join(screenshotDir, filename) });
    console.log(`📸 Captura guardada en: ${path.join(screenshotDir, filename)}`);
  }

  if (page) await page.close();
  if (browser) await browser.close();
});

// ===== GIVEN STEPS COMUNES =====
Given('que navego a {string}', async function(url) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  await page.goto(fullUrl, { waitUntil: 'networkidle2' });
});

Given('espero {int} segundos', async function(seconds) {
  await new Promise(r => setTimeout(r, seconds * 1000));
});

// ===== WHEN STEPS COMUNES =====
When('ingreso {string} en el campo {string}', async function(value, fieldSelector) {
  await page.type(fieldSelector, value);
});

When('hago clic en {string}', async function(selector) {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);
});

// ===== THEN STEPS COMUNES =====
Then('debería ver el texto {string}', async function(text) {
  // Esperar un poco a que el cuerpo cargue
  await page.waitForSelector('body');
  const bodyText = await page.evaluate(() => document.body.innerText);
  expect(bodyText).to.include(text);
});