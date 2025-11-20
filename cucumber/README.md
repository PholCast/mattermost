# Mattermost - Pruebas E2E con Cucumber

## Descripción

Esta carpeta contiene pruebas E2E (End-to-End) para Mattermost usando **Cucumber** con **Puppeteer**. Las pruebas están escritas en español usando Gherkin y cubren los siguientes flujos:

- ✅ **Login**: Inicio de sesión con credenciales válidas/inválidas, recuperación de contraseña
- ✅ **Signup**: Registro de nuevos usuarios, validaciones de campos
- ✅ **Channels**: Creación de canales públicos/privados, validaciones

## Estructura del Proyecto

```
cucumber/
├── features/                # Archivos .feature con escenarios en Gherkin
│   ├── login.feature
│   ├── signup.feature
│   └── channels.feature
├── step_definitions/        # Implementación de los pasos
│   ├── login.js
│   ├── signup.js
│   └── channels.js
├── support/                 # Configuración y utilidades
│   ├── hooks.js
│   └── world.js
├── cucumber.js             # Configuración de Cucumber
├── package.json            # Dependencias del proyecto
├── .env.example            # Variables de entorno
└── README.md               # Este archivo
```

## Requisitos Previos

- **Node.js** >= 14.x
- **npm** >= 6.x
- Servidor Mattermost corriendo en `http://localhost:8065` (o cambiar en `.env`)

## Instalación

### 1. Instalar dependencias

```bash
cd cucumber
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus valores (URLs, credenciales de prueba, etc.)

### 3. Verificar que Mattermost esté corriendo

Asegurate de que tu instancia de Mattermost esté disponible en `http://localhost:8065`

## Ejecución de Pruebas

### Ejecutar todas las pruebas

```bash
npm test
```

### Ejecutar pruebas específicas por perfil

```bash
# Pruebas críticas
npm run test:critical

# Pruebas smoke (básicas)
npm run test:smoke

# Pruebas de regresión completas
npm run test:regression
```

### Ejecutar en modo watch

Útil durante desarrollo para volver a ejecutar las pruebas cuando cambies los archivos:

```bash
npm run test:watch
```

### Ejecutar con reporte

Genera un reporte HTML después de ejecutar las pruebas:

```bash
npm run test:report
```

### Ejecutar un archivo .feature específico

```bash
npx cucumber-js features/login.feature
```

### Ejecutar un escenario específico

```bash
npx cucumber-js features/login.feature -n "Iniciar sesión con credenciales válidas"
```

## Escritura de Nuevas Pruebas

### 1. Crear un archivo .feature

Crear `cucumber/features/micaracteristica.feature`:

```gherkin
# language: es
Característica: Mi nueva característica
  Como usuario
  Quiero hacer algo
  Para lograr un objetivo

  Escenario: Caso de prueba exitoso
    Dado que tengo una precondición
    Cuando realizo una acción
    Entonces debería ver un resultado
```

### 2. Implementar los pasos

Crear `cucumber/step_definitions/micaracteristica.js`:

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

Given('que tengo una precondición', async function() {
  // Tu código aquí
});

When('realizo una acción', async function() {
  // Tu código aquí
});

Then('debería ver un resultado', async function() {
  // Tu código aquí
  expect(resultado).to.be.true;
});
```

### 3. Ejecutar la prueba

```bash
npm test
```

## Uso de Tags (Etiquetas)

Puedes marcar escenarios con tags para ejecutarlos selectivamente:

```gherkin
@smoke @critical
Escenario: Caso crítico para pruebas rápidas
  ...
```

Luego ejecutar con:

```bash
npx cucumber-js --tags "@smoke and @critical"
npx cucumber-js --tags "@regression and not @flaky"
```

## Mejores Prácticas

### 1. **Usar el World para datos compartidos**

```javascript
When('guardo el nombre del canal', async function() {
  this.channelName = 'mi-canal';
});

Then('debería ver el canal guardado', async function() {
  expect(this.channelName).to.equal('mi-canal');
});
```

### 2. **Reutilizar pasos comunes**

```javascript
Given('que estoy autenticado', async function() {
  await page.goto('http://localhost:8065/login');
  await page.type('#input_loginId', 'test@example.com');
  await page.type('#input_password-input', 'password123');
  await page.click('#saveSetting');
  await page.waitForNavigation();
});
```

### 3. **Usar ejemplos para múltiples casos**

```gherkin
Escenario: Intentos de login fallidos
  Cuando intento iniciar sesión con:
    | email                  | password       |
    | invalid@example.com    | wrongpass      |
    | test@example.com       | wrongpass2     |
    | nonexistent@example.com| password123    |
  Entonces debería permanecer en la página de login
```

### 4. **Manejo de timeouts**

```javascript
When('espero a que aparezca el elemento', async function() {
  await page.waitForSelector('.element-class', { timeout: 10000 });
});
```

## Troubleshooting

### Las pruebas se cuelgan o timeout

- Aumenta el timeout en `cucumber.js`
- Verifica que Mattermost esté corriendo
- Revisa la consola para errores específicos

### Elementos no encontrados

- Verifica los selectores CSS en la herramienta de desarrollador
- Asegúrate de que el elemento sea visible antes de interactuar
- Usa `waitForSelector` para esperar a que el elemento cargue

### Problemas con Puppeteer

```bash
# Reinstalar Puppeteer
npm install puppeteer --force

# O con apt (Linux)
sudo apt-get install -y libgconf-2-4 libatk1.0-0 libgdk-pixbuf2.0-0
```

## Generando Reportes

Después de ejecutar las pruebas, se genera automáticamente `cucumber-report.html`:

```bash
npm run test:report
```

Este abrirá el reporte en tu navegador predeterminado.

## Variables de Entorno Disponibles

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `BASE_URL` | URL de Mattermost | `http://localhost:8065` |
| `TEST_EMAIL` | Email para pruebas | `usuario.valido@ejemplo.com` |
| `TEST_PASSWORD` | Contraseña para pruebas | `Clave123` |
| `HEADLESS` | Ejecutar en modo headless | `false` |
| `BROWSER_TIMEOUT` | Timeout del navegador (ms) | `30000` |

## Documentación Adicional

- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Puppeteer Documentation](https://pptr.dev/)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Crea una rama para tu feature: `git checkout -b feature/nueva-prueba`
2. Commit tus cambios: `git commit -am 'Agrega nueva prueba'`
3. Push a la rama: `git push origin feature/nueva-prueba`
4. Abre un Pull Request

## Licencia

Este proyecto está bajo la misma licencia que Mattermost.

---

**Última actualización**: Noviembre 2025
