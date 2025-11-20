# language: es
Característica: Autenticación en Mattermost
  Como usuario
  Quiero iniciar sesión en Mattermost
  Para acceder a mi cuenta y funciones disponibles

  Antecedentes:
    Dado que navego a la página de login
    Y espero a que los campos de login sean visibles

  # ESCENARIO 1: Credenciales correctas
  Escenario: Iniciar sesión con credenciales válidas
    Cuando ingreso el email "test@example.com" en el campo de login
    Y ingreso la contraseña en login "password123"
    Y hago clic en el botón de envío
    Entonces debería redireccionar a una página que no incluya "login"
    Y debería ver que la sesión fue exitosa

  Escenario: Iniciar sesión con username en lugar de email
    Cuando ingreso el username "testuser" en el campo de login
    Y ingreso la contraseña en login "password123"
    Y hago clic en el botón de envío
    Entonces debería redireccionar a una página que no incluya "login"

  # ESCENARIO 2: Email falla
  Escenario: Rechazar login con email inexistente
    Cuando ingreso el email "nonexistent@example.com" en el campo de login
    Y ingreso la contraseña en login "password123"
    Y hago clic en el botón de envío
    Entonces debería permanecer en la página de login
    Y debería ver un mensaje de error de credenciales

  Escenario: Rechazar login con email inactivo
    Cuando ingreso el email "inactive@example.com" en el campo de login
    Y ingreso la contraseña en login "password123"
    Y hago clic en el botón de envío
    Entonces debería permanecer en la página de login
    Y debería ver un mensaje indicando que el usuario no está activo

  # ESCENARIO 3: Contraseña falla
  Escenario: Rechazar login con contraseña incorrecta
    Cuando ingreso el email "test@example.com" en el campo de login
    Y ingreso la contraseña en login "wrongpassword"
    Y hago clic en el botón de envío
    Entonces debería permanecer en la página de login
    Y debería ver un mensaje de error de credenciales

  Escenario: Manejar campo de contraseña vacío
    Cuando ingreso el email "test@example.com" en el campo de login
    Y no ingreso contraseña
    Y intento hacer clic en el botón de envío
    Entonces debería ver validación de campo requerido

  # ESCENARIO 4: Recuperación de contraseña
  Escenario: Navegar a página de recuperación de contraseña
    Cuando hago clic en el enlace "¿Olvidaste tu contraseña?"
    Entonces debería redireccionar a la página de reseteo de contraseña

  Escenario: Solicitar reset de contraseña con email válido
    Cuando navego a la página de reseteo de contraseña
    Y ingreso el email de reset "test@example.com"
    Y hago clic en el botón de envío de reset
    Entonces debería ver un mensaje confirmando que se envió un email

  # ESCENARIO 5: Funcionalidades de UI
  Escenario: Mostrar y ocultar contraseña
    Cuando ingreso la contraseña en login "password123"
    Y el campo de contraseña debería estar oculto en login con type "password"
    Y hago clic en el botón de toggle de contraseña en login
    Entonces el campo de contraseña debería ser visible en login con type "text"
    Y hago clic en el botón de toggle de contraseña en login
    Entonces el campo de contraseña debería estar oculto en login con type "password"
