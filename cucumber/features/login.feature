# language: en
Feature: Autenticación en Mattermost
  Como usuario
  Quiero iniciar sesión en Mattermost
  Para acceder a mi cuenta y funciones disponibles

  Background:
    Given que navego a la página de login
    And espero a que los campos de login sean visibles

  # ESCENARIO 1: Credenciales correctas
  Scenario: Iniciar sesión con credenciales válidas
    When ingreso el email "test@example.com" en el campo de login
    And ingreso la contraseña en login "password123"
    And hago clic en el botón de envío
    Then debería redireccionar a una página que no incluya "login"
    And debería ver que la sesión fue exitosa

  Scenario: Iniciar sesión con username en lugar de email
    When ingreso el username "testuser" en el campo de login
    And ingreso la contraseña en login "password123"
    And hago clic en el botón de envío
    Then debería redireccionar a una página que no incluya "login"

  # ESCENARIO 2: Email falla
  Scenario: Rechazar login con email inexistente
    When ingreso el email "nonexistent@example.com" en el campo de login
    And ingreso la contraseña en login "password123"
    And hago clic en el botón de envío
    Then debería permanecer en la página de login
    And debería ver un mensaje de error de credenciales

  Scenario: Rechazar login con email inactivo
    When ingreso el email "inactive@example.com" en el campo de login
    And ingreso la contraseña en login "password123"
    And hago clic en el botón de envío
    Then debería permanecer en la página de login
    And debería ver un mensaje indicando que el usuario no está activo

  # ESCENARIO 3: Contraseña falla
  Scenario: Rechazar login con contraseña incorrecta
    When ingreso el email "test@example.com" en el campo de login
    And ingreso la contraseña en login "wrongpassword"
    And hago clic en el botón de envío
    Then debería permanecer en la página de login
    And debería ver un mensaje de error de credenciales

  Scenario: Manejar campo de contraseña vacío
    When ingreso el email "test@example.com" en el campo de login
    And no ingreso contraseña
    And intento hacer clic en el botón de envío
    Then debería ver validación de campo requerido

  # ESCENARIO 4: Recuperación de contraseña
  Scenario: Navegar a página de recuperación de contraseña
    When hago clic en el enlace "¿Olvidaste tu contraseña?"
    Then debería redireccionar a la página de reseteo de contraseña

  Scenario: Solicitar reset de contraseña con email válido
    When navego a la página de reseteo de contraseña
    And ingreso el email de reset "test@example.com"
    And hago clic en el botón de envío de reset
    Then debería ver un mensaje confirmando que se envió un email

  # ESCENARIO 5: Funcionalidades de UI
  Scenario: Mostrar y ocultar contraseña
    When ingreso la contraseña en login "password123"
    And el campo de contraseña debería estar oculto en login con type "password"
    And hago clic en el botón de toggle de contraseña en login
    Then el campo de contraseña debería ser visible en login con type "text"
    And hago clic en el botón de toggle de contraseña en login
    Then el campo de contraseña debería estar oculto en login con type "password"
