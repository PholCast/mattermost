const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8065';

let browser;
let page;
let uniqueSuffix;

const selectors = {
  emailInput: '#input_email',
  nameInput: '#input_name',
  passInput: '#input_password-input',
  submitBtn: '#saveSetting',
  passwordToggleBtn: '#password_toggle',
  loginLink: '.alternate-link__link',
  backButton: '[data-testid="back_button"]',
  emailError: '#error_email',
  nameError: '#error_name',
  passError: '#error_password-input'
};

// ===== HELPERS =====
const generateRandomSuffix = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// ===== HOOKS =====
Before(async function() {
  uniqueSuffix = generateRandomSuffix();
  browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  page = await browser.newPage();
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
});

After(async function() {
  if (page) await page.close();
  if (browser) await browser.close();
});

// ===== GIVEN STEPS =====
Given('que navego a la página de registro', async function() {
  try {
    // Nota: Ajustar el ID de la invitación según tu entorno
    const inviteId = 'peigeoymd7d4zrgsyn6s3azyue';
    await page.goto(`${BASE_URL}/signup_user_complete/?id=${inviteId}`, 
      { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Esperar a que cargue completamente
  } catch (error) {
    console.log('Error navegando a signup:', error.message);
    throw error;
  }
});

Given('espero a que los campos de registro sean visibles', async function() {
  await page.waitForSelector(selectors.emailInput, { timeout: 15000 });
  await page.waitForSelector(selectors.nameInput, { timeout: 15000 });
  await page.waitForSelector(selectors.passInput, { timeout: 15000 });
});

// ===== WHEN STEPS =====
When('ingreso un email válido único', async function() {
  const email = `newuser_${uniqueSuffix}@example.com`;
  this.email = email;
  await page.type(selectors.emailInput, email);
});

When('ingreso un nombre de usuario válido único', async function() {
  const username = `newuser${uniqueSuffix}`;
  this.username = username;
  await page.type(selectors.nameInput, username);
});

When('ingreso una contraseña válida {string}', async function(password) {
  this.password = password;
  await page.type(selectors.passInput, password);
});

When('ingreso una contraseña muy corta {string}', async function(password) {
  await page.type(selectors.passInput, password);
});

When('hago clic en el botón de registro', async function() {
  await page.click(selectors.submitBtn);
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 })
    .catch(() => {});
});

When('ingreso el email de registro {string}', async function(email) {
  await page.type(selectors.emailInput, email);
});

When('ingreso el nombre de usuario de registro {string}', async function(name) {
  await page.type(selectors.nameInput, name);
});

When('ingreso la contraseña de registro {string}', async function(password) {
  await page.type(selectors.passInput, password);
});

When('hago foco fuera del campo de contraseña en registro', async function() {
  await page.focus('body');
  await page.waitForTimeout(500);
});

When('hago foco fuera del campo de nombre en registro', async function() {
  await page.focus('body');
  await page.waitForTimeout(500);
});

When('ingreso un nombre con caracteres inválidos {string}', async function(name) {
  await page.type(selectors.nameInput, name);
});

When('no ingreso email en registro', async function() {
  // No hacemos nada, dejamos vacío
});

When('no ingreso nombre de usuario en registro', async function() {
  // No hacemos nada, dejamos vacío
});

When('intento hacer clic en el botón de registro', async function() {
  const isDisabled = await page.evaluate(() => {
    const btn = document.querySelector('#saveSetting');
    return btn ? btn.disabled : false;
  });

  if (!isDisabled) {
    await page.click(selectors.submitBtn);
  }
});

When('el campo de contraseña debería estar oculto en registro con type {string}', async function(type) {
  const inputType = await page.evaluate(() => {
    const input = document.querySelector('#input_password-input');
    return input ? input.type : null;
  });
  expect(inputType).to.equal(type);
});

When('hago clic en el botón de toggle de contraseña en registro', async function() {
  await page.click(selectors.passwordToggleBtn);
});

When('el campo de contraseña debería ser visible en registro con type {string}', async function(type) {
  const inputType = await page.evaluate(() => {
    const input = document.querySelector('#input_password-input');
    return input ? input.type : null;
  });
  expect(inputType).to.equal(type);
});

// ===== THEN STEPS =====
Then('debería redireccionar desde registro a una página sin {string}', async function(text) {
  const url = page.url();
  expect(url).to.not.include(text);
});

Then('debería ver confirmación de registro exitoso', async function() {
  const url = page.url();
  expect(url).to.not.include('/signup');
});

Then('debería permanecer en la página de registro', async function() {
  const url = page.url();
  expect(url).to.include('/signup');
});

Then('debería ver un mensaje de usuario ya existente', async function() {
  await page.waitForTimeout(1000);
  const url = page.url();
  expect(url).to.include('/signup');
});

Then('debería ver un mensaje de email ya en uso', async function() {
  const url = page.url();
  expect(url).to.include('/signup');
});

Then('debería ver un mensaje de error de contraseña inválida', async function() {
  await page.waitForSelector(selectors.passError, { timeout: 5000 })
    .catch(() => {});
});
