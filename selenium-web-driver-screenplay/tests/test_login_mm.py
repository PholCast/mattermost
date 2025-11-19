from screenpy import See
from screenpy_selenium.actions import Open, Wait
from screenpy_selenium.questions import Text
from screenpy.resolutions import ContainsTheText, IsEqualTo
from pages.login_page import LoginPage
from pages.home_page import HomePage
from questions.element_is_visible import ElementIsVisible
from questions.browser_url import BrowserURL
from pages.login_page_mm import MattermostLoginPage

from screenpy_selenium.actions import Click, Enter, Wait
import pytest



MM_LOGIN_URL = "http://localhost:8065/login"   # cámbialo si es necesario
TEAM_URL = "http://localhost:8065/teamname"    # redirección esperada tras login exitoso

@pytest.fixture
def user(actor):
    return actor

# -------------------------------------------------------------------
# 🔹1. LOGIN EXITOSO
# -------------------------------------------------------------------
def test_login_success(user):

    MattermostLoginPage.open_login(user)
    user.attempts_to(

        MattermostLoginPage.enter_username("usuariovalido"),
        MattermostLoginPage.enter_password("Clave123"),

        MattermostLoginPage.click_login_button(),
        Wait(10).for_the(MattermostLoginPage.TITLE_TEXT).to_disappear(),
    )

    user.should(

        See.the(BrowserURL(), ContainsTheText("/organizacionprueba/channels/town-square")) # luego redirige a un team
    )


# -------------------------------------------------------------------
# 🔹2. LOGIN – CONTRASEÑA INCORRECTA
# -------------------------------------------------------------------
def test_login_wrong_password(user):
    MattermostLoginPage.open_login(user)
    user.attempts_to(
        MattermostLoginPage.enter_username("usuario@ejemplo.com"),
        MattermostLoginPage.enter_password("password_incorrecta"),
        MattermostLoginPage.click_login_button(),
        Wait(5).for_the(MattermostLoginPage.ERROR_BANNER).to_appear(),
    )

    user.should(
        MattermostLoginPage.error_contains_text("The email/username or password is invalid.")
    )


# -------------------------------------------------------------------
# 🔹3. LOGIN – EMAIL CON FORMATO INVÁLIDO
# -------------------------------------------------------------------
def test_login_invalid_email_format(user):
    MattermostLoginPage.open_login(user)
    user.attempts_to(
        MattermostLoginPage.enter_username("esto_no_es_un_correo"),
        MattermostLoginPage.enter_password("cualquierpass"),
        MattermostLoginPage.click_login_button(),
        Wait(5).for_the(MattermostLoginPage.ERROR_BANNER).to_appear(),
    )

    user.should(
        MattermostLoginPage.error_contains_text("The email/username or password is invalid.")
    )


# -------------------------------------------------------------------
# 🔹4. LOGIN – CAMPO EMAIL VACÍO
# -------------------------------------------------------------------
def test_login_email_empty(user):
    MattermostLoginPage.open_login(user)
    user.attempts_to(

        MattermostLoginPage.enter_username(""),     # vacío
        MattermostLoginPage.enter_password("123456"),
        MattermostLoginPage.click_login_button(),
        Wait(5).for_the(MattermostLoginPage.ERROR_BANNER).to_appear(),
    )

    user.should(
        MattermostLoginPage.error_contains_text("Please enter your email or username")
    )


# -------------------------------------------------------------------
# 🔹5. LOGIN – CAMPO PASSWORD VACÍO
# -------------------------------------------------------------------
def test_login_password_empty(user):
    MattermostLoginPage.open_login(user)
    user.attempts_to(

        MattermostLoginPage.enter_username("correo@ejemplo.com"),
        MattermostLoginPage.enter_password(""),     # vacío
        MattermostLoginPage.click_login_button(),
        Wait(5).for_the(MattermostLoginPage.ERROR_BANNER).to_appear(),
    )

    user.should(
        MattermostLoginPage.error_contains_text("Please enter your password")
    )


# -------------------------------------------------------------------
# 🔹6. LOGIN – CAMPOS EMAIL Y PASSWORD VACÍOS
# -------------------------------------------------------------------
def test_login_both_fields_empty(user):
    MattermostLoginPage.open_login(user)
    user.attempts_to(

        MattermostLoginPage.enter_username(""),
        MattermostLoginPage.enter_password(""),
        MattermostLoginPage.click_login_button(),
        Wait(5).for_the(MattermostLoginPage.ERROR_BANNER).to_appear(),
    )

    user.should(
        MattermostLoginPage.error_contains_text("Please enter your email or username")
    )


# -------------------------------------------------------------------
# 🔹7. LOGIN – LINK “FORGOT PASSWORD”
# -------------------------------------------------------------------
def test_login_forgot_password_link(user):
    MattermostLoginPage.open_login(user)
    user.attempts_to(
        Wait(5).for_the(MattermostLoginPage.TITLE_TEXT).to_appear(),
        MattermostLoginPage.click_forgot_password(),
    )

    user.should(
        See.the(BrowserURL(), ContainsTheText("reset_password"))
    )

def test_login_with_spaces(user):
    MattermostLoginPage.open_login(user)
    user.attempts_to(

        # email con espacios
        MattermostLoginPage.enter_username("   correo@ejemplo.com   "),
        MattermostLoginPage.enter_password("   123456   "),
        MattermostLoginPage.click_login_button(),

        Wait(5).for_the(MattermostLoginPage.ERROR_BANNER).to_appear(),
    )

    user.should(
        MattermostLoginPage.error_contains_text("The email/username or password is invalid.")
    )

from selenium.webdriver.common.keys import Keys

def test_login_press_enter(user):
    MattermostLoginPage.open_login(user)
    user.attempts_to(

        MattermostLoginPage.enter_username("usuariovalidoo"),
        Enter.the_text("Clave123").into(MattermostLoginPage.PASSWORD_FIELD).then_hit(Keys.ENTER),
        Wait(5).for_the(MattermostLoginPage.ERROR_BANNER).to_appear(),
    )

    user.should(
        MattermostLoginPage.error_contains_text("The email/username or password is invalid.")
    )


def test_login_email_uppercase(user):
    MattermostLoginPage.open_login(user)
    user.attempts_to(

        MattermostLoginPage.enter_username("usuariovalido"),
        MattermostLoginPage.enter_password("Clave123"),
        MattermostLoginPage.click_login_button(),

        Wait(10).for_the(MattermostLoginPage.TITLE_TEXT).to_disappear(),
    )

    user.should(

        See.the(BrowserURL(), ContainsTheText("/organizacionprueba/channels/town-square")) # luego redirige a un team
    )


def test_password_visibility_toggle(user):
    MattermostLoginPage.open_login(user)
    user.attempts_to(

        MattermostLoginPage.enter_password("123456"),
    )

    # Estado inicial: password invisible (type="password")
    user.should(
        MattermostLoginPage.password_input_type_is("password")
    )

    # Click en el ojo para mostrar
    user.attempts_to(
        MattermostLoginPage.click_password_toggle()
    )

    user.should(
        MattermostLoginPage.password_input_type_is("text")
    )

    # Click otra vez para ocultar
    user.attempts_to(
        MattermostLoginPage.click_password_toggle()
    )

    user.should(
        MattermostLoginPage.password_input_type_is("password")
    )
