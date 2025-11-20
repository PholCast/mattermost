# Guía de Features y Escenarios

## Estructura de un Feature File

```gherkin
# language: es
Característica: [Nombre descriptivo de la funcionalidad]
  Como [tipo de usuario]
  Quiero [acción que quiero hacer]
  Para [beneficio o razón]

  Antecedentes:
    # Pasos que se ejecutan ANTES de cada escenario
    Dado que [precondición 1]
    Y [precondición 2]

  Escenario: [Nombre específico del caso]
    Dado que [condición inicial]
    Cuando [acción del usuario]
    Entonces [resultado esperado]

  @tag1 @tag2
  Escenario: [Otro caso de prueba]
    ...
```

## Elementos de Gherkin

### Característica (Feature)
Define una funcionalidad o conjunto de escenarios relacionados.

```gherkin
# language: es
Característica: Autenticación en Mattermost
  Como usuario
  Quiero poder iniciar sesión
  Para acceder a mi cuenta
```

### Antecedentes (Background)
Pasos comunes que se ejecutan antes de cada escenario en el feature.

```gherkin
Antecedentes:
  Dado que navego a la página de login
  Y espero a que los campos sean visibles
```

### Escenario (Scenario)
Un caso de prueba específico con pasos detallados.

```gherkin
Escenario: Iniciar sesión con credenciales correctas
  Cuando ingreso credenciales válidas
  Y hago clic en enviar
  Entonces debería ver el dashboard
```

### Ejemplos (Examples)
Datos para ejecutar el mismo escenario múltiples veces con diferentes valores.

```gherkin
Esquema del Escenario: Intentos de login con diferentes credenciales
  Cuando ingreso "<email>" y "<password>"
  Entonces debería <resultado>

  Ejemplos:
    | email              | password    | resultado           |
    | test@example.com   | password123 | ver el dashboard    |
    | admin@example.com  | admin123    | ver panel de admin   |
    | test@example.com   | wrong       | ver error           |
```

### Tags (Etiquetas)
Marcas para categorizar escenarios.

```gherkin
@smoke @critical
Escenario: Login exitoso
  ...

@slow @regression
Escenario: Crear canal con descripción larga
  ...

@skip
Escenario: Funcionalidad no implementada
  ...
```

## Keywords de Pasos

### Given (Dado)
Establece el contexto o precondiciones.

```gherkin
Dado que estoy en la página de login
Dado que tengo una cuenta activa
Dado que el servidor está disponible
```

### When (Cuando)
Describe la acción que realiza el usuario.

```gherkin
Cuando hago clic en el botón de login
Cuando escribo mi email
Cuando presiono Enter
```

### Then (Entonces)
Especifica el resultado esperado.

```gherkin
Entonces debería ver el dashboard
Entonces debería ver un mensaje de error
Entonces debería redireccionar a home
```

### And / But (Y / Pero)
Conectan múltiples pasos del mismo tipo.

```gherkin
Dado que estoy autenticado
Y tengo una cuenta de admin
Y he creado 3 canales
Cuando intento borrar un canal
Entonces debería ser exitoso
Y los otros canales deberían existir
```

## Ejemplos de Features

### 1. Login (login.feature)

```gherkin
# language: es
Característica: Autenticación
  Como usuario de Mattermost
  Quiero iniciar sesión
  Para acceder a mi cuenta

  Antecedentes:
    Dado que navego a la página de login
    Y espero a que los campos sean visibles

  @critical @smoke
  Escenario: Login exitoso con email y contraseña
    Cuando ingreso email "test@example.com"
    Y ingreso contraseña "password123"
    Y hago clic en enviar
    Entonces debería redireccionar a "/channels/town-square"

  @critical
  Escenario: Rechazar login con contraseña incorrecta
    Cuando ingreso email "test@example.com"
    Y ingreso contraseña "wrongpass"
    Y hago clic en enviar
    Entonces debería permanecer en login
    Y debería ver mensaje de error

  @slow
  Escenario: Manejar timeout del servidor
    Cuando intento login y el servidor responde lentamente
    Entonces debería esperar a que responda
    Y debería mostrar resultado o timeout

  @recovery
  Escenario: Recuperar contraseña olvidada
    Cuando hago clic en "Olvidé mi contraseña"
    Y ingreso mi email
    Y hago clic en enviar
    Entonces debería ver confirmación de email
```

### 2. Signup (signup.feature)

```gherkin
# language: es
Característica: Registro de Usuarios
  Como usuario nuevo
  Quiero registrarme
  Para crear una cuenta

  Antecedentes:
    Dado que navego a la página de registro
    Y espero a que los campos sean visibles

  @critical
  Escenario: Registro exitoso
    Cuando ingreso email único
    Y ingreso nombre de usuario único
    Y ingreso contraseña válida
    Y hago clic en registrarse
    Entonces debería redireccionar a login

  Escenario Esquema: Validar contraseña
    Cuando ingreso contraseña "<contraseña>"
    Entonces debería <resultado>

    Ejemplos:
      | contraseña      | resultado                |
      | 123             | ver error de muy corta   |
      | Pass123!Pass123 | permitir el registro     |
      | ñoño            | permitir caracteres      |

  @validation
  Escenario: Validar email duplicado
    Cuando ingreso email "existing@example.com"
    Y ingreso nombre único
    Y ingreso contraseña válida
    Y hago clic en registrarse
    Entonces debería ver error "Email ya registrado"
```

### 3. Channels (channels.feature)

```gherkin
# language: es
Característica: Gestión de Canales
  Como usuario autenticado
  Quiero crear y gestionar canales
  Para organizar conversaciones

  Antecedentes:
    Dado que estoy autenticado
    Y estoy en el área de canales

  @critical
  Escenario: Crear canal público
    Cuando hago clic en "Crear canal"
    Y ingreso nombre "mi-canal-publico"
    Y ingreso descripción "Un canal público"
    Y selecciono tipo "Público"
    Y hago clic en crear
    Entonces debería ver canal "mi-canal-publico"

  Escenario Esquema: Crear canales con tipos
    Cuando creo un canal de tipo "<tipo>"
    Entonces debería ver "<icono>" en el listado

    Ejemplos:
      | tipo    | icono |
      | Público | #     |
      | Privado | 🔒    |

  @validation
  Escenario: Validar nombre de canal duplicado
    Dado que existe un canal "mi-canal"
    Cuando intento crear otro canal "mi-canal"
    Entonces debería ver error "Canal ya existe"

  @validation
  Escenario: Validar nombre vacío
    Cuando intento crear canal sin nombre
    Entonces debería ver error requerido
    Y botón crear debería estar deshabilitado
```

## Mejores Prácticas para Features

### 1. **Uno por archivo**
Cada archivo .feature contiene una sola característica.

```
✅ login.feature (una característica)
❌ authentication.feature (login + signup + recovery)
```

### 2. **Nombres descriptivos en español**
Facilita la comprensión y mantenimiento.

```
✅ Escenario: Rechazar login con contraseña incorrecta
❌ Escenario: Login falla
```

### 3. **Usar Antecedentes para evitar repetición**
Mantiene los escenarios enfocados.

```gherkin
# ✅ Con Antecedentes
Antecedentes:
  Dado que estoy autenticado

Escenario: Crear canal
  Cuando creo un canal
  Entonces debería verlo

# ❌ Sin Antecedentes - repetición
Escenario: Crear canal
  Dado que estoy autenticado
  Cuando creo un canal
  Entonces debería verlo
```

### 4. **Usar Esquemas para variaciones**
Reduce duplicación cuando hay múltiples casos similares.

```gherkin
# ✅ Esquema
Esquema del Escenario: Login con diferentes usuarios
  Cuando ingreso "<usuario>" y "<password>"
  Entonces debería <resultado>

  Ejemplos:
    | usuario | password | resultado |
    | user1   | pass1    | exitoso   |
    | user2   | pass2    | exitoso   |

# ❌ Sin esquema - repetición
Escenario: Login user1
  Cuando ingreso "user1" y "pass1"
  Entonces debería ser exitoso

Escenario: Login user2
  Cuando ingreso "user2" y "pass2"
  Entonces debería ser exitoso
```

### 5. **Tags para organizar pruebas**

```gherkin
@smoke           # Pruebas básicas y rápidas
@regression      # Pruebas de regresión completas
@critical        # Pruebas críticas que DEBE pasar siempre
@validation      # Pruebas de validación de inputs
@slow            # Pruebas que tardan más tiempo
@skip            # Pruebas a saltar (WIP)
@flaky           # Pruebas que fallan ocasionalmente
@integration     # Pruebas de integración
@ui              # Pruebas específicas de UI
@api             # Pruebas de API
@security        # Pruebas de seguridad
```

## Testing with Data Tables

### Múltiples inputs

```gherkin
Escenario: Intentos de login fallidos
  Cuando intento iniciar sesión con:
    | email              | password    |
    | invalid@test.com   | wrong       |
    | test@example.com   | wrongpass   |
    | nonexistent@test   | password123 |
  Entonces debería ver error cada vez
```

### Implementación

```javascript
When('intento iniciar sesión con:', async function(dataTable) {
  const attempts = dataTable.hashes(); // Array de objetos
  
  for (const attempt of attempts) {
    await page.type('#email', attempt.email);
    await page.type('#password', attempt.password);
    await page.click('#login');
    
    // Verificar error
    await page.waitForSelector('.error');
    
    // Limpiar para siguiente intento
    await page.goto('/login');
  }
});
```

## Debugging Features

### Ejecutar solo un escenario
```bash
npx cucumber-js features/login.feature -n "Login exitoso"
```

### Ejecutar solo features con tag específico
```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@critical and @smoke"
```

### Dry run (solo validar sintaxis)
```bash
npx cucumber-js --dry-run
```

### Ver pasos disponibles
```bash
npx cucumber-js --publish-quiet
```

---

**Última actualización**: Noviembre 2025
