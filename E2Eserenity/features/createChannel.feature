Feature: Creación de Canales en Mattermost
  Como usuario autenticado
  Quiero crear nuevos canales
  Para organizar conversaciones sobre temas específicos

  Scenario: Crear un canal público exitosamente
    Given que estoy autenticado en Mattermost
    And tengo datos válidos para un nuevo canal público
    When intento crear el canal
    Then el canal debería ser creado exitosamente
    And debería poder ver el canal en la lista de canales
