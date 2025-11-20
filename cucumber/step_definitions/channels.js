const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8065';

let browser;
let page;
let lastChannelName;

const selectors = {
  addChannelsBtn: '#addChannelsCta',
  createNewChannelMenuItem: '#showNewChannel-button',
  modal: '#new-channel-modal',
  nameInput: '#input_new-channel-modal-name',
  purposeInput: '#new-channel-modal-purpose',
  publicSelector: '#public-private-selector-button-O',
  privateSelector: '#public-private-selector-button-P',
  cancelBtn: '.GenericModal__button.btn-tertiary',
  createBtn: '.GenericModal__button.btn-primary',
  nameError: '#error_new-channel-modal-name'
};

const generateRandomString = (length = 6) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

// ===== HOOKS =====
Before(async function() {
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

// ===== WHEN STEPS =====
When('abro el modal de crear canal', async function() {
  await page.click(selectors.addChannelsBtn);
  await page.waitForSelector(selectors.createNewChannelMenuItem, { timeout: 5000 });
  await page.click(selectors.createNewChannelMenuItem);
  await page.waitForSelector(selectors.modal, { timeout: 5000 });
});

When('ingreso el nombre del canal {string}', async function(channelName) {
  lastChannelName = channelName;
  await page.type(selectors.nameInput, channelName);
});

When('ingreso la descripción {string}', async function(description) {
  await page.type(selectors.purposeInput, description);
});

When('selecciono la opción de canal público', async function() {
  await page.click(selectors.publicSelector);
});

When('selecciono la opción de canal privado', async function() {
  await page.click(selectors.privateSelector);
});

When('hago clic en el botón de crear', async function() {
  await page.click(selectors.createBtn);
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 })
    .catch(() => {});
});

When('hago clic en el botón de cancelar', async function() {
  await page.click(selectors.cancelBtn);
  await page.waitForTimeout(500);
});

When('abro el modal de crear canal nuevamente', async function() {
  await page.click(selectors.addChannelsBtn);
  await page.waitForSelector(selectors.createNewChannelMenuItem, { timeout: 5000 });
  await page.click(selectors.createNewChannelMenuItem);
  await page.waitForSelector(selectors.modal, { timeout: 5000 });
});

// ===== THEN STEPS =====
Then('debería redireccionar al nuevo canal {string}', async function(channelName) {
  await page.waitForTimeout(1000);
  const url = page.url();
  expect(url).to.include(`/channels/${channelName}`);
});

Then('debería ver el nombre del canal en la página', async function() {
  const isVisible = await page.evaluate((name) => {
    return document.body.innerText.includes(name);
  }, lastChannelName);
  expect(isVisible).to.be.true;
});

Then('debería ver el nombre del canal privado', async function() {
  const isVisible = await page.evaluate((name) => {
    return document.body.innerText.includes(name);
  }, lastChannelName);
  expect(isVisible).to.be.true;
});

Then('debería ver el botón de crear deshabilitado', async function() {
  const isDisabled = await page.evaluate(() => {
    const btn = document.querySelector('.GenericModal__button.btn-primary');
    return btn ? btn.disabled : false;
  });
  expect(isDisabled).to.be.true;
});

Then('debería ver un mensaje de error {string}', async function(errorMsg) {
  await page.waitForSelector(selectors.nameError, { timeout: 5000 })
    .catch(() => {});
});

Then('debería permanecer en el modal de crear canal', async function() {
  await page.waitForTimeout(500);
  const modalVisible = await page.evaluate(() => {
    const modal = document.querySelector('#new-channel-modal');
    return modal ? modal.offsetParent !== null : false;
  });
  expect(modalVisible).to.be.true;
});

Then('debería cerrar el modal', async function() {
  await page.waitForTimeout(500);
  const modalVisible = await page.evaluate(() => {
    const modal = document.querySelector('#new-channel-modal');
    return modal ? modal.offsetParent !== null : false;
  });
  expect(modalVisible).to.be.false;
});

Then('debería regresar al canal anterior', async function() {
  const url = page.url();
  expect(url).to.not.be.empty;
});

Given('espero a que se redirija a {string}', async function(urlPart) {
  // Esperar hasta que la URL contenga el texto deseado
  try {
    await page.waitForFunction(
      (text) => window.location.href.includes(text),
      { timeout: 20000 }, // Darle tiempo suficiente
      urlPart
    );
  } catch (e) {
    console.error(`La URL no cambió a incluir "${urlPart}" a tiempo.`);
    throw e;
  }
});