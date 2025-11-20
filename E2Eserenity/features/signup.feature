Feature: Registro de Usuario en Mattermost
  Como nuevo usuario
  Quiero registrarme en la plataforma
  Para poder unirme a equipos y canales

  Scenario: Registro exitoso con credenciales nuevas
    Given que tengo datos de usuario nuevos y válidos
    When intento registrarme en Mattermost
    Then debería recibir una confirmación de registro exitoso
    And el usuario debería existir en el sistema
