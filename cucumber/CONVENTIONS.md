# Guía de Convenciones y Mejores Prácticas

## Estructura de Archivos

```
cucumber/
├── features/               # Escenarios en Gherkin
│   ├── login.feature
│   ├── signup.feature
│   └── channels.feature
├── step_definitions/       # Implementación de pasos
│   ├── common-steps.js     # Pasos reutilizables
│   ├── login.js
│   ├── signup.js
│   └── channels.js
├── support/                # Configuración
│   ├── hooks.js
│   ├── world.js
│   ├── test-data.js
│   └── puppeteer-utils.js
└── reports/                # Reportes generados
```

## Convenciones de Nombres

### Features
- Nombres en español, descriptivos
- Un feature por archivo
- Nombres de archivo en minúsculas con guiones

```
✅ login.feature
✅ user-authentication.feature
❌ LOGIN.feature
❌ login-signup-recovery.feature (múltiples features)
```

### Escenarios
- Descripción clara del comportamiento
- Nomenclatura "Dado-Cuando-Entonces"
- Usar contexto relevante

```gherkin
✅ Escenario: Rechazar login con contraseña incorrecta
❌ Escenario: Login falla
```

### Pasos
- Usar lenguaje natural en español
- Evitar detalles técnicos en Gherkin
- Mantener pasos simples y enfocados

```gherkin
✅ Cuando ingreso el email "test@example.com" en el campo de login
✅ Y hago clic en el botón de envío
❌ Cuando document.querySelector('#input_loginId').value = 'test@example.com'
```

## Estructura de Step Definitions

### Importaciones
```javascript
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');
```

### Orden de Steps
```javascript
// 1. Hooks globales
Before(async function() { ... });
After(async function() { ... });

// 2. Given (Precondiciones)
Given('...', async function() { ... });

// 3. When (Acciones)
When('...', async function() { ... });

// 4. Then (Verificaciones)
Then('...', async function() { ... });
```

### Manejo de Errores
```javascript
// ✅ Buen manejo de errores
Then('debería ver el elemento', async function() {
  await page.waitForSelector('.element', { timeout: 5000 })
    .catch(() => {
      throw new Error('Elemento no encontrado');
    });
});

// ❌ Sin manejo de errores
Then('debería ver el elemento', async function() {
  await page.click('.element'); // Puede fallar silenciosamente
});
```

## Uso del World Context

El context permite compartir datos entre pasos:

```javascript
// Guardar datos
When('guardo el nombre {string}', async function(name) {
  this.savedName = name;
});

// Usar datos guardados
Then('debería ver el nombre guardado', async function() {
  const text = await this.page.evaluate(() => document.body.innerText);
  expect(text).to.include(this.savedName);
});
```

## Reutilización de Pasos

### Crear pasos genéricos y reutilizables

```javascript
// ✅ Genérico - Reutilizable
When('ingreso {string} en el campo {string}', async function(value, selector) {
  await page.type(selector, value);
});

// ❌ Específico - Difícil de reutilizar
When('ingreso el email en el campo de login', async function() {
  await page.type('#input_loginId', 'test@example.com');
});
```

### Usar Data Tables para múltiples datos

```gherkin
# ✅ Data Table
Cuando intento iniciar sesión con:
  | email              | password    |
  | test1@example.com  | password123 |
  | test2@example.com  | password456 |

# ❌ Múltiples pasos
Cuando ingreso test1@example.com
Y ingreso password123
Y hago clic en enviar
Cuando ingreso test2@example.com
Y ingreso password456
Y hago clic en enviar
```

### Implementación con Data Table
```javascript
When('intento iniciar sesión con:', async function(dataTable) {
  const users = dataTable.hashes();
  
  for (const user of users) {
    await page.type('#input_loginId', user.email);
    await page.type('#input_password-input', user.password);
    await page.click('#saveSetting');
    await page.waitForTimeout(1000);
  }
});
```

## Selectores CSS

### Mejores prácticas
- Usar `data-testid` cuando sea posible
- Evitar selectores muy profundos
- Usar IDs para elementos únicos

```javascript
// ✅ Selectores claros
const selectors = {
  loginInput: '#input_loginId',
  loginBtn: '[data-testid="login-button"]',
  errorMessage: '.error-message'
};

// ❌ Selectores problemáticos
const selectors = {
  loginInput: 'div > div > div > form > input:first-child',
  loginBtn: '.container .button:nth-child(3)',
  errorMessage: 'span'
};
```

## Timeouts

### Configurar timeouts apropiados

```javascript
// Elemento rápido (< 1s)
await page.waitForSelector('.quick-element', { timeout: 3000 });

// Elemento normal (navegación, carga)
await page.waitForSelector('.normal-element', { timeout: 10000 });

// Elemento lento (background jobs)
await page.waitForSelector('.slow-element', { timeout: 30000 });
```

## Tags y Organización

### Usar tags para organizar pruebas

```gherkin
@critical @smoke
Escenario: Login exitoso
  ...

@regression @slow
Escenario: Crear canal con descripción larga
  ...

@skip
Escenario: Funcionalidad no implementada
  ...
```

### Ejecutar por tags

```bash
# Solo críticas
npx cucumber-js --tags "@critical"

# Críticas Y smoke
npx cucumber-js --tags "@critical and @smoke"

# Regresión pero NO lentas
npx cucumber-js --tags "@regression and not @slow"

# Skip excluido
npx cucumber-js --tags "not @skip"
```

## Buenas Prácticas

### 1. **Mantén los escenarios independientes**

```gherkin
# ✅ Escenario independiente
Escenario: Crear canal privado
  Dado que estoy autenticado
  Cuando creo un canal privado
  Entonces debería ver el canal

# ❌ Dependencia de otro escenario
Escenario: Crear canal privado
  Cuando creo un canal privado
  # (Requiere que el escenario anterior haya corrido)
```

### 2. **Usa nombres descriptivos para los datos**

```javascript
// ✅ Claro
const email = 'newuser_' + generateRandomSuffix() + '@example.com';

// ❌ Confuso
const email = 'x@y.com';
```

### 3. **Captura pantallas en fallos**

```javascript
After(async function(scenario) {
  if (scenario.result.status === 'FAILED') {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    await page.screenshot({
      path: `screenshots/FAILED_${scenario.pickle.name}_${timestamp}.png`
    });
  }
});
```

### 4. **Usa fixtures para datos complejos**

En lugar de hardcodear datos, usa el archivo `support/test-data.js`:

```javascript
const { testUsers, testChannels } = require('../support/test-data');

When('me autentico como usuario válido', async function() {
  const user = testUsers.validUser;
  await page.type('#input_loginId', user.email);
  await page.type('#input_password-input', user.password);
});
```

### 5. **Documenta pasos complejos**

```javascript
// Simula el flujo de login y autenticación de dos factores
When('me autentico con 2FA', async function() {
  // Paso 1: Credenciales primarias
  await page.type('#input_loginId', this.email);
  await page.type('#input_password-input', this.password);
  await page.click('#saveSetting');

  // Paso 2: Esperar modal de 2FA
  await page.waitForSelector('[data-testid="2fa-modal"]');

  // Paso 3: Ingresar código
  const code = await this.get2FACode(this.email);
  await page.type('#2fa-code-input', code);
  await page.click('[data-testid="2fa-submit"]');
});
```

## Debugging

### Ejecutar en modo no headless para ver qué pasa

```javascript
// En cucumber.config.js
launch: {
  headless: false  // Ver el navegador
}
```

### Usar console.log para debug

```javascript
Then('debería ver el resultado', async function() {
  const content = await page.content();
  console.log('HTML:', content); // Ver el HTML completo
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log('Texto:', text); // Ver el texto
});
```

### Usar debugger

```javascript
await page.evaluate(() => debugger);
// El navegador se pausará en ese punto si tienes DevTools abierto
```

## Problemas Comunes

| Problema | Solución |
|----------|----------|
| Timeouts | Aumenta el timeout o verifica que el elemento existe |
| Elemento no clickeable | Usa `click({ force: true })` o espera a que sea visible |
| Selectores cambian | Usa `data-testid` en lugar de clases que pueden cambiar |
| Tests lentos | Ejecuta en paralelo o reduce el alcance de pruebas |
| Fallos aleatorios | Aumenta timeouts o sincroniza mejor con el servidor |

---

**Última actualización**: Noviembre 2025
