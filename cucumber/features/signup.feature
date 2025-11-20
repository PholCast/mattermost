# language: es
Característica: Registro de usuarios en Mattermost
  Como usuario nuevo
  Quiero registrarme en Mattermost
  Para crear una nueva cuenta y acceder a la plataforma

  Antecedentes:
    Dado que navego a la página de registro
    Y espero a que los campos de registro sean visibles

  # ESCENARIO 1: Registro exitoso
  Escenario: Registrar un usuario exitosamente con datos válidos
    Cuando ingreso un email válido único
    Y ingreso un nombre de usuario válido único
    Y ingreso una contraseña válida "Password123!"
    Y hago clic en el botón de registro
    Entonces debería redireccionar desde registro a una página sin "signup"
    Y debería ver confirmación de registro exitoso

  # ESCENARIO 2: Validaciones de campos
  Escenario: Rechazar registro con usuario duplicado
    Cuando ingreso el email de registro "testuser@example.com"
    Y ingreso el nombre de usuario de registro "testuser"
    Y ingreso la contraseña de registro "Password123!"
    Y hago clic en el botón de registro
    Entonces debería permanecer en la página de registro
    Y debería ver un mensaje de usuario ya existente

  Escenario: Rechazar registro con email duplicado
    Cuando ingreso el email de registro "test@example.com"
    Y ingreso el nombre de usuario de registro "newuser_123"
    Y ingreso la contraseña de registro "Password123!"
    Y hago clic en el botón de registro
    Entonces debería permanecer en la página de registro
    Y debería ver un mensaje de email ya en uso

  Escenario: Validar formato de contraseña muy corta
    Cuando ingreso un email válido único
    Y ingreso un nombre de usuario válido único
    Y ingreso una contraseña muy corta "123"
    Y hago foco fuera del campo de contraseña en registro
    Entonces debería ver un mensaje de error de contraseña inválida

  # ESCENARIO 3: Interacciones de UI
  Escenario: Mostrar y ocultar contraseña durante registro
    Cuando ingreso la contraseña de registro "SecretPass"
    Y el campo de contraseña debería estar oculto en registro con type "password"
    Y hago clic en el botón de toggle de contraseña en registro
    Entonces el campo de contraseña debería ser visible en registro con type "text"
    Y hago clic en el botón de toggle de contraseña en registro
    Entonces el campo de contraseña debería estar oculto en registro con type "password"
