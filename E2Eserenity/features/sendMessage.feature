Feature: Envío de Mensajes en Mattermost
  Como usuario autenticado
  Quiero enviar mensajes a un canal
  Para comunicarme con mi equipo

  Scenario: Enviar un mensaje de texto a un canal
    Given que estoy autenticado en Mattermost
    And que existe un canal donde puedo publicar
    When envío un mensaje de texto a ese canal
    Then el mensaje debería aparecer en el historial del canal
