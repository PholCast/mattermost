# language: en
Feature: Creación de canales en Mattermost
  Como usuario autenticado
  Quiero crear canales públicos y privados
  Para organizar conversaciones y colaboración

  Background:
    Given que navego a la página de login
    And espero a que los campos de login sean visibles
    And ingreso el email "usuario.valido@ejemplo.com"
    And ingreso la contraseña "Clave123"
    And hago clic en el botón de envío
    And espero a que se redirija a "town-square"

  # ESCENARIO 1: Crear canal público
  Scenario: Crear un canal público con nombre y descripción
    When abro el modal de crear canal
    And ingreso el nombre del canal "public-test-001"
    And ingreso la descripción "Este es un canal de prueba público"
    And selecciono la opción de canal público
    And hago clic en el botón de crear
    Then debería redireccionar al nuevo canal "public-test-001"
    And debería ver el nombre del canal en la página

  # ESCENARIO 2: Crear canal privado
  Scenario: Crear un canal privado sin descripción
    When abro el modal de crear canal
    And ingreso el nombre del canal "private-test-001"
    And selecciono la opción de canal privado
    And hago clic en el botón de crear
    Then debería redireccionar al nuevo canal "private-test-001"
    And debería ver el nombre del canal privado

  # ESCENARIO 4: Cancelar creación de canal
  Scenario: Cancelar creación de canal
    When abro el modal de crear canal
    And ingreso el nombre del canal "canal-cancelado"
    And hago clic en el botón de cancelar
    Then debería cerrar el modal
    And debería regresar al canal anterior
