# login_page_mm.py
# Página de Login para Mattermost usando Screenplay Pattern (Screenpy + Selenium)

import time
from screenpy import See, Actor
from screenpy.pacing import beat
from screenpy_selenium.actions import Click, Enter, Wait
from screenpy_selenium.questions import Attribute, Text
from screenpy_selenium.target import Target
from screenpy_selenium.abilities import BrowseTheWeb
from screenpy.resolutions import ContainsTheText, IsEqualTo
from selenium.webdriver.common.keys import Keys


class MattermostLoginPage:
    """Screenplay PageObject para la página de Login de Mattermost."""

    URL = "http://localhost:8065/login"

    # -------------------------
    # ELEMENTOS
    # -------------------------

    # --- Landing Page ---
    VIEW_IN_BROWSER_BUTTON = Target.the("View in Browser button").located_by(
        "a.btn.btn-tertiary.btn-lg"
    )

    # --- Login Form ---
    USERNAME_FIELD = Target.the("username/email input").located_by("input[data-testid='login-id-input']")

    PASSWORD_FIELD = Target.the("password input").located_by(
        "input#input_password-input"
    )

    FORGOT_PASSWORD_LINK = Target.the("forgot password link").located_by("a[href='/reset_password']")

    LOGIN_BUTTON = Target.the("login button").located_by("#saveSetting")

    ERROR_BANNER = Target.the("error banner").located_by(
        "[data-testid='login-body-card-banner']"
    )

    PASSWORD_TOGGLE = Target.the("password visibility toggle").located_by("#password_toggle")

    TITLE_TEXT = Target.the("login page title").located_by(
        ".login-body-message-title, .login-body-card-title"
    )
    # -------------------------
    # ACCESO AUTOMÁTICO
    # -------------------------

    @staticmethod
    @beat("Abriendo login y manejando Landing Page si aparece")
    def open_login(user: Actor):
        browser = user.ability_to(BrowseTheWeb).browser

        # Ir al login (redirecciona al landing automáticamente en incógnito)
        browser.get(MattermostLoginPage.URL)
        time.sleep(2) 
        # Detectar si estamos en /landing
        if "/landing" in browser.current_url:
            # Esperar y hacer click en "View in Browser"
            user.attempts_to(
                Wait(10).for_the(MattermostLoginPage.VIEW_IN_BROWSER_BUTTON).to_appear(),
                Click.on(MattermostLoginPage.VIEW_IN_BROWSER_BUTTON),
            )

        # Esperar el form real de login
        user.attempts_to(
            Wait(10).for_the(MattermostLoginPage.USERNAME_FIELD).to_appear()
        )

    # -------------------------
    # ACCIONES
    # -------------------------

    @staticmethod
    @beat("Ingresando usuario/email")
    def enter_username(username: str):
        return Enter.the_text(username).into(MattermostLoginPage.USERNAME_FIELD)

    @staticmethod
    @beat("Ingresando contraseña")
    def enter_password(password: str):
        return Enter.the_text(password).into(MattermostLoginPage.PASSWORD_FIELD)

    @staticmethod
    @beat("Haciendo click en Log in")
    def click_login_button():
        return Click.on(MattermostLoginPage.LOGIN_BUTTON)

    @staticmethod
    @beat("Mostrando/Ocultando contraseña")
    def click_password_toggle():
        return Click.on(MattermostLoginPage.PASSWORD_TOGGLE)

    @staticmethod
    def press_enter_on_password():
        return Enter.the_text(Keys.ENTER).into(MattermostLoginPage.PASSWORD_FIELD)

    @staticmethod
    @beat("Click en forgot password")
    def click_forgot_password():
        return Click.on(MattermostLoginPage.FORGOT_PASSWORD_LINK)

    # -------------------------
    # VALIDACIONES
    # -------------------------



    @staticmethod
    def banner_should_contain(text: str):
        return See(Text.of(MattermostLoginPage.ERROR_BANNER), ContainsTheText(text))

    @staticmethod
    def error_contains_text(text: str):
        return MattermostLoginPage.banner_should_contain(text)

    @staticmethod
    def password_input_type_is(expected_type: str):
        return See.the(
            Attribute("type").of_the(MattermostLoginPage.PASSWORD_FIELD),
            IsEqualTo(expected_type),
        )



    @staticmethod
    @beat("Esperando a que aparezca el mensaje de error")
    def wait_for_error_banner(timeout: int = 5):
        return Wait.up_to(timeout).until_the(MattermostLoginPage.ERROR_BANNER).is_visible()
