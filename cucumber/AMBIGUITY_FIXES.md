# Resolución de Ambigüedad en Pasos de Cucumber

## Problema Identificado
Se encontraron **29 pasos ambiguos** donde múltiples definiciones coincidían con el mismo texto de paso en Gherkin, causando que Cucumber no supiera cuál definición ejecutar.

## Causa Raíz
- `channels.js` contenía definiciones de pasos de login/signup que debería solo tener canales
- `login.js` y `signup.js` definían pasos con nombres idénticos para acciones similares
- No había diferenciación entre pasos de diferentes features

## Solución Implementada

### 1. Limpieza de `channels.js`
**Cambio**: Eliminadas TODAS las definiciones de pasos de autenticación (login)

**Líneas eliminadas (47-70)**:
- `Given('que navego a la página de login')`
- `Given('espero a que los campos de login sean visibles')`
- `Given('ingreso el email {string}')`
- `Given('ingreso la contraseña {string}')`
- `Given('hago clic en el botón de envío')`
- `Given('espero a que se redirija a {string}')`

**Selectores eliminados**:
- `loginId: '#input_loginId'`
- `loginPass: '#input_password-input'`
- `loginBtn: '#saveSetting'`

**Resultado**: `channels.js` ahora contiene SOLO pasos específicos de canales.

---

### 2. Renombrado de Pasos en `signup.js`
**Cambio**: Todos los pasos genéricos fueron renombrados con el sufijo "de registro"

**Pasos renombrados**:
| Anterior | Nuevo |
|----------|-------|
| `ingreso el email {string}` | `ingreso el email de registro {string}` |
| `ingreso el nombre {string}` | `ingreso el nombre de usuario de registro {string}` |
| `ingreso la contraseña {string}` | `ingreso la contraseña de registro {string}` |
| `hago foco fuera del campo de contraseña` | `hago foco fuera del campo de contraseña en registro` |
| `hago foco fuera del campo de nombre` | `hago foco fuera del campo de nombre en registro` |
| `el campo de contraseña debería estar oculto con type {string}` | `el campo de contraseña debería estar oculto en registro con type {string}` |
| `hago clic en el botón de toggle de contraseña` | `hago clic en el botón de toggle de contraseña en registro` |
| `el campo de contraseña debería ser visible con type {string}` | `el campo de contraseña debería ser visible en registro con type {string}` |
| `debería redireccionar a una página que no incluya {string}` | `debería redireccionar desde registro a una página sin {string}` |

**Duplicadas eliminadas**:
- Línea 152: Segunda definición de `ingreso la contraseña {string}` ✓ ELIMINADA

---

### 3. Renombrado de Pasos en `login.js`
**Cambio**: Pasos específicos del flujo de login fueron diferenciados

**Pasos renombrados**:
| Anterior | Nuevo |
|----------|-------|
| `ingreso la contraseña {string}` | `ingreso la contraseña en login {string}` |
| `ingreso el email {string}` (para reset) | `ingreso el email de reset {string}` |
| `el campo de contraseña debería estar oculto con type {string}` | `el campo de contraseña debería estar oculto en login con type {string}` |
| `hago clic en el botón de toggle de contraseña` | `hago clic en el botón de toggle de contraseña en login` |
| `el campo de contraseña debería ser visible con type {string}` | `el campo de contraseña debería ser visible en login con type {string}` |

**Duplicadas eliminadas**:
- Línea 165: Segunda definición de `debería permanecer en la página de login` ✓ ELIMINADA

---

### 4. Actualización de Feature Files

#### `login.feature`
- Reemplazo de `ingreso la contraseña` → `ingreso la contraseña en login`
- Reemplazo de `ingreso el email` → `ingreso el email de reset` (en escenario de password reset)
- Reemplazo de `el campo de contraseña debería estar oculto con type` → `el campo de contraseña debería estar oculto en login con type`
- Reemplazo de `hago clic en el botón de toggle de contraseña` → `hago clic en el botón de toggle de contraseña en login`
- Reemplazo de `el campo de contraseña debería ser visible con type` → `el campo de contraseña debería ser visible en login con type`

#### `signup.feature`
- Reemplazo de `ingreso el email` → `ingreso el email de registro`
- Reemplazo de `ingreso el nombre` → `ingreso el nombre de usuario de registro`
- Reemplazo de `ingreso la contraseña` → `ingreso la contraseña de registro`
- Reemplazo de `hago foco fuera del campo de contraseña` → `hago foco fuera del campo de contraseña en registro`
- Reemplazo de `debería redireccionar a una página que no incluya` → `debería redireccionar desde registro a una página sin`
- Reemplazo de `el campo de contraseña debería estar oculto con type` → `el campo de contraseña debería estar oculto en registro con type`
- Reemplazo de `hago clic en el botón de toggle de contraseña` → `hago clic en el botón de toggle de contraseña en registro`
- Reemplazo de `el campo de contraseña debería ser visible con type` → `el campo de contraseña debería ser visible en registro con type`
- Última línea: Corrección de `debería estar oculto con type "password"` → `debería estar oculto en registro con type "password"`

---

### 5. Pasos Nuevos Agregados

#### En `login.js`
```javascript
Then('debería ver validación de campo requerido', async function() {
  const isDisabled = await page.evaluate(() => {
    const btn = document.querySelector('#saveSetting');
    return btn ? btn.disabled : false;
  });
  expect(isDisabled).to.be.true;
});
```

---

### 6. Mejora de Timeouts en Navegación

**Cambios realizados**:

#### `login.js` - Línea 36
```javascript
// ANTES:
await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });

// DESPUÉS:
await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);
```

#### `signup.js` - Línea 46
```javascript
// ANTES:
await page.goto(`${BASE_URL}/signup_user_complete/?id=${inviteId}`, { waitUntil: 'networkidle2' });

// DESPUÉS:
await page.goto(`${BASE_URL}/signup_user_complete/?id=${inviteId}`, 
  { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);
```

**Razón**: 
- `networkidle2` era muy estricto (5 segundos de timeout)
- `domcontentloaded` es más rápido y suficiente para que se cargue el contenido
- Timeout aumentado de 5s a 30s para dar más tiempo al servidor
- Wait adicional de 2 segundos para asegurar que Mattermost se inicializa completamente

---

## Resumen de Cambios

| Archivo | Cambios | Estado |
|---------|---------|--------|
| `channels.js` | Eliminadas 24 líneas de pasos de login | ✓ Limpio |
| `login.js` | Renombrados 5 pasos, eliminada 1 línea duplicada, agregado 1 paso | ✓ Limpio |
| `signup.js` | Renombrados 9 pasos, eliminada 1 línea duplicada | ✓ Limpio |
| `login.feature` | Actualizados todos los pasos conflictivos | ✓ Actualizado |
| `signup.feature` | Actualizados todos los pasos conflictivos | ✓ Actualizado |
| `channels.feature` | Sin cambios necesarios | ✓ OK |

---

## Resultado Esperado

**Antes**: 29 pasos ambiguos, 17 scenarios fallados
**Después**: 0 pasos ambiguos, tests ejecutándose correctamente

### Estado de Tests

Ahora los tests deberían ejecutarse sin errores de ambigüedad. Los únicos fallos serían:
- Timeouts por conectividad (requiere que Mattermost esté completamente inicializado)
- Problemas de selectores (requiere inspección del DOM actual)
- Falta de datos de prueba correctos

---

## Notas Importantes

1. **Antes de ejecutar los tests**: Asegúrate de que Mattermost esté completamente iniciado en `http://localhost:8065`
2. **Si ves "View in Browser"**: Haz clic en ese botón para inicializar completamente Mattermost
3. **Los timeouts de 30 segundos**: Permiten que el servidor tenga tiempo suficiente para responder

---

## Testing

Para ejecutar los tests con los cambios aplicados:

```bash
cd c:\Users\dagud\Uni\mattermost\cucumber
npm test
```

O para ver el reporte HTML:

```bash
npm run test:report
```
