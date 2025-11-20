// support/puppeteer-utils.js
// Utilidades comunes para Puppeteer

/**
 * Abre una página y navega a una URL
 */
async function openPage(url, page) {
  await page.goto(url, { waitUntil: 'networkidle2' });
}

/**
 * Espera a que un elemento sea visible
 */
async function waitForElement(page, selector, timeout = 5000) {
  await page.waitForSelector(selector, { timeout });
}

/**
 * Obtiene el valor de un input
 */
async function getInputValue(page, selector) {
  return await page.evaluate((sel) => {
    const input = document.querySelector(sel);
    return input ? input.value : null;
  }, selector);
}

/**
 * Limpia un campo de entrada
 */
async function clearInput(page, selector) {
  await page.focus(selector);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
}

/**
 * Obtiene el texto de un elemento
 */
async function getText(page, selector) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    return element ? element.innerText : null;
  }, selector);
}

/**
 * Verifica si un elemento existe
 */
async function elementExists(page, selector) {
  return await page.evaluate((sel) => {
    return document.querySelector(sel) !== null;
  }, selector);
}

/**
 * Verifica si un elemento es visible
 */
async function isElementVisible(page, selector) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }, selector);
}

/**
 * Obtiene el atributo de un elemento
 */
async function getAttribute(page, selector, attribute) {
  return await page.evaluate((sel, attr) => {
    const element = document.querySelector(sel);
    return element ? element.getAttribute(attr) : null;
  }, selector, attribute);
}

/**
 * Espera a que la URL cambie
 */
async function waitForUrlChange(page, initialUrl, timeout = 10000) {
  await page.waitForFunction(
    (url) => window.location.href !== url,
    { timeout },
    initialUrl
  );
}

/**
 * Toma una captura de pantalla
 */
async function takeScreenshot(page, filename) {
  await page.screenshot({ path: `screenshots/${filename}.png` });
}

/**
 * Recarga la página
 */
async function reloadPage(page) {
  await page.reload({ waitUntil: 'networkidle2' });
}

/**
 * Simula hacer clic con tecla Control
 */
async function controlClick(page, selector) {
  await page.keyboard.down('Control');
  await page.click(selector);
  await page.keyboard.up('Control');
}

/**
 * Espera a que un elemento tenga un texto específico
 */
async function waitForText(page, selector, text, timeout = 5000) {
  await page.waitForFunction(
    (sel, t) => {
      const element = document.querySelector(sel);
      return element && element.innerText.includes(t);
    },
    { timeout },
    selector,
    text
  );
}

/**
 * Obtiene todos los textos de elementos que coincidan con el selector
 */
async function getAllTexts(page, selector) {
  return await page.evaluate((sel) => {
    return Array.from(document.querySelectorAll(sel))
      .map(el => el.innerText);
  }, selector);
}

module.exports = {
  openPage,
  waitForElement,
  getInputValue,
  clearInput,
  getText,
  elementExists,
  isElementVisible,
  getAttribute,
  waitForUrlChange,
  takeScreenshot,
  reloadPage,
  controlClick,
  waitForText,
  getAllTexts
};
