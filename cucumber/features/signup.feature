# language: en
Feature: Registro de usuarios en Mattermost
  Como usuario nuevo
  Quiero registrarme en Mattermost
  Para crear una nueva cuenta y acceder a la plataforma

  Background:
    Given que navego a la página de registro
    And espero a que los campos de registro sean visibles

  # ESCENARIO 1: Registro exitoso
  Scenario: Registrar un usuario exitosamente con datos válidos
    When ingreso un email válido único
    And ingreso un nombre de usuario válido único
    And ingreso una contraseña válida "Password123!"
    And hago clic en el botón de registro
    Then debería redireccionar desde registro a una página sin "signup"
    And debería ver confirmación de registro exitoso

  # ESCENARIO 2: Validaciones de campos
  Scenario: Rechazar registro con usuario duplicado
    When ingreso el email de registro "testuser@example.com"
    And ingreso el nombre de usuario de registro "testuser"
    And ingreso la contraseña de registro "Password123!"
    And hago clic en el botón de registro
    Then debería permanecer en la página de registro
    And debería ver un mensaje de usuario ya existente

  Scenario: Rechazar registro con email duplicado
    When ingreso el email de registro "test@example.com"
    And ingreso el nombre de usuario de registro "newuser_123"
    And ingreso la contraseña de registro "Password123!"
    And hago clic en el botón de registro
    Then debería permanecer en la página de registro
    And debería ver un mensaje de email ya en uso

  Scenario: Validar formato de contraseña muy corta
    When ingreso un email válido único
    And ingreso un nombre de usuario válido único
    And ingreso una contraseña muy corta "123"
    And hago foco fuera del campo de contraseña en registro
    Then debería ver un mensaje de error de contraseña inválida

  # ESCENARIO 3: Interacciones de UI
  Scenario: Mostrar y ocultar contraseña durante registro
    When ingreso la contraseña de registro "SecretPass"
    And el campo de contraseña debería estar oculto en registro con type "password"
    And hago clic en el botón de toggle de contraseña en registro
    Then el campo de contraseña debería ser visible en registro con type "text"
    And hago clic en el botón de toggle de contraseña en registro
    Then el campo de contraseña debería estar oculto en registro con type "password"
