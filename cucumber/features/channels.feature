# language: es
Característica: Creación de canales en Mattermost
  Como usuario autenticado
  Quiero crear canales públicos y privados
  Para organizar conversaciones y colaboración

  Antecedentes:
    Dado que navego a la página de login
    Y espero a que los campos de login sean visibles
    Y ingreso el email "usuario.valido@ejemplo.com"
    Y ingreso la contraseña "Clave123"
    Y hago clic en el botón de envío
    Y espero a que se redirija a "town-square"

  # ESCENARIO 1: Crear canal público
  Escenario: Crear un canal público con nombre y descripción
    Cuando abro el modal de crear canal
    Y ingreso el nombre del canal "public-test-001"
    Y ingreso la descripción "Este es un canal de prueba público"
    Y selecciono la opción de canal público
    Y hago clic en el botón de crear
    Entonces debería redireccionar al nuevo canal "public-test-001"
    Y debería ver el nombre del canal en la página

  # ESCENARIO 2: Crear canal privado
  Escenario: Crear un canal privado sin descripción
    Cuando abro el modal de crear canal
    Y ingreso el nombre del canal "private-test-001"
    Y selecciono la opción de canal privado
    Y hago clic en el botón de crear
    Entonces debería redireccionar al nuevo canal "private-test-001"
    Y debería ver el nombre del canal privado

  # ESCENARIO 4: Cancelar creación de canal
  Escenario: Cancelar creación de canal
    Cuando abro el modal de crear canal
    Y ingreso el nombre del canal "canal-cancelado"
    Y hago clic en el botón de cancelar
    Entonces debería cerrar el modal
    Y debería regresar al canal anterior
