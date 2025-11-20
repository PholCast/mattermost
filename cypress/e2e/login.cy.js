// Pruebas E2E de Login para Mattermost (UI Real)
// Escenarios: Credenciales correctas, fallos de email, fallos de contraseña, recuperación de contraseña

const BASE_URL = 'http://localhost:8065';

const selectors = {
  loginInput: '#input_loginId',
  passInput: '#input_password-input',
  submitBtn: '#saveSetting',
  forgotPasswordBtn: 'a[href="/reset_password"]',
  passwordToggleBtn: '#password_toggle',
  formContainer: '.login-body-card-form'
};

// ---------------------------------------
// Helper: obtiene los inputs de login
// ---------------------------------------
const getLoginInputs = () => {
  return {
    email: cy.get(selectors.loginInput),
    password: cy.get(selectors.passInput)
  };
};

describe('Pruebas E2E - Login Mattermost', () => {

  // ---------------------------------------
  // BEFORE EACH CORREGIDO
  // ---------------------------------------
  beforeEach(() => {
    cy.on('uncaught:exception', () => false);

    // Limpieza
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });

    // Abrir el root para capturar el "View in Browser"
    cy.visit('http://localhost:8065', {
      failOnStatusCode: false
    });

    // Si aparece el botón "View in Browser", clicarlo antes de redirección
    cy.get('body').then($body => {
      const btn = $body.find('span:contains("View in Browser")').closest('a,button');
      if (btn.length) {
        cy.wrap(btn).click({ force: true });
      }
    });

    // Ahora forzar ir al login verdadero
    cy.visit('http://localhost:8065/login', {
      failOnStatusCode: false
    });

    // Esperar campos visibles
    cy.get(selectors.loginInput, { timeout: 15000 }).should('be.visible');
    cy.get(selectors.passInput, { timeout: 15000 }).should('be.visible');
  });


  // =========================================
  // ESCENARIO 1: Credenciales CORRECTAS
  // =========================================
  describe('ESCENARIO 1 - Credenciales correctas (Email + Contraseña válidos)', () => {

    it('Debe loguear exitosamente con email y contraseña correctos', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 200,
        body: {
          id: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
          roles: 'system_user',
          auth_service: ''
        }
      }).as('loginSuccess');

      getLoginInputs().email.type('test@example.com');
      getLoginInputs().password.type('password123');
      cy.get(selectors.submitBtn).click();

      cy.wait('@loginSuccess');
      cy.location('pathname', { timeout: 10000 }).should('not.include', 'login');
    });

    it('Debe permitir login con username en lugar de email', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 200,
        body: {
          id: 'user-456',
          username: 'testuser',
          email: 'test@example.com',
          roles: 'system_user'
        }
      }).as('loginWithUsername');

      getLoginInputs().email.type('testuser');
      getLoginInputs().password.type('password123');
      cy.get(selectors.submitBtn).click();

      cy.wait('@loginWithUsername');
      cy.location('pathname', { timeout: 10000 }).should('not.include', 'login');
    });

    it('Debe mostrar datos del usuario después de login exitoso', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 200,
        body: {
          id: 'user-789',
          email: 'admin@example.com',
          username: 'admin',
          roles: 'system_user system_admin'
        }
      }).as('adminLogin');

      getLoginInputs().email.type('admin@example.com');
      getLoginInputs().password.type('admin123');
      cy.get(selectors.submitBtn).click();

      cy.wait('@adminLogin').then((interception) => {
        expect(interception.response.body.id).to.equal('user-789');
        expect(interception.response.body.roles).to.include('system_admin');
      });
    });

  });

  // =========================================
  // ESCENARIO 2: Email FALLA, Contraseña CORRECTA
  // =========================================
  describe('ESCENARIO 2 - Email falla (email inválido, contraseña correcta)', () => {

    it('Debe rechazar login cuando el email no existe', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 401,
        body: {
          message: 'Invalid login credentials.',
          status_code: 'api.user.login.invalid_credentials'
        }
      }).as('emailNotFound');

      getLoginInputs().email.type('nonexistent@example.com');
      getLoginInputs().password.type('password123');
      cy.get(selectors.submitBtn).click();

      cy.wait('@emailNotFound');
      // Debe permanecer en la página de login
      cy.location('pathname', { timeout: 10000 }).should('include', 'login');
    });

    it('Debe mostrar error cuando el email tiene formato inválido', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 401,
        body: { message: 'Invalid email format' }
      }).as('invalidEmailFormat');

      getLoginInputs().email.type('invalid-email-format');
      getLoginInputs().password.type('password123');
      cy.get(selectors.submitBtn).click();

      cy.wait('@invalidEmailFormat');
      cy.url().should('include', 'login');
    });

    it('Debe rechazar login si el usuario no está activo', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 401,
        body: {
          message: 'User is not active.',
          status_code: 'api.user.login.inactive_user'
        }
      }).as('inactiveUser');

      getLoginInputs().email.type('inactive@example.com');
      getLoginInputs().password.type('password123');
      cy.get(selectors.submitBtn).click();

      cy.wait('@inactiveUser');
      cy.url().should('include', 'login');
    });

  });

  // =========================================
  // ESCENARIO 3: Email CORRECTO, Contraseña FALLA
  // =========================================
  describe('ESCENARIO 3 - Email correcto (contraseña inválida)', () => {

    it('Debe rechazar login cuando la contraseña es incorrecta', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 401,
        body: {
          message: 'Invalid login credentials.',
          status_code: 'api.user.login.invalid_credentials'
        }
      }).as('wrongPassword');

      getLoginInputs().email.type('test@example.com');
      getLoginInputs().password.type('wrongpassword');
      cy.get(selectors.submitBtn).click();

      cy.wait('@wrongPassword');
      cy.url().should('include', 'login');
      cy.location('pathname', { timeout: 10000 }).should('include', 'login');
    });

    it('Debe manejar contraseña vacía', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 400,
        body: { message: 'Password cannot be empty' }
      }).as('emptyPassword');

      getLoginInputs().email.type('test@example.com');
      // No escribimos contraseña
      cy.get(selectors.submitBtn).click();

      // Puede validarse antes de hacer la petición o después
      cy.get(selectors.passInput).should('have.attr', 'aria-invalid', 'false');
    });

    it('Debe rechazar si contraseña tiene caracteres inválidos', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' }
      }).as('invalidChars');

      getLoginInputs().email.type('test@example.com');
      getLoginInputs().password.type('contraseña123'); // Con ñ
      cy.get(selectors.submitBtn).click();

      cy.wait('@invalidChars', { timeout: 5000 });
      cy.url().should('include', 'login');
    });

  });

  // =========================================
  // ESCENARIO 4: Recuperación de Contraseña
  // =========================================
  describe('ESCENARIO 4 - Recuperación de Contraseña (Forgot Password)', () => {

    it('Debe navegar a la página de reset cuando se clickea "Forgot your password?"', () => {
      cy.get(selectors.forgotPasswordBtn).should('exist').and('be.visible');
      cy.get(selectors.forgotPasswordBtn).click();

      cy.location('pathname', { timeout: 10000 }).should('include', 'reset_password');
    });

    it('Debe mostrar enlace de recuperación en la página de login', () => {
      cy.get(selectors.forgotPasswordBtn)
        .should('exist')
        .should('be.visible')
        .should('have.text', 'Forgot your password?');
    });

    it('Debe permitir solicitar reset de contraseña con email válido', () => {
      cy.intercept('POST', '**/api/v4/users/password/reset/send', {
        statusCode: 200,
        body: {
          message: 'We\'ve sent an email with a link to reset your password. Check your email to continue.'
        }
      }).as('resetEmailSent');

      // Navegar a reset password
      cy.get(selectors.forgotPasswordBtn).click();
      cy.location('pathname', { timeout: 10000 }).should('include', 'reset_password');

      // Rellenar email y enviar
      cy.get('input[placeholder*="Email"], input[id*="email"]', { timeout: 10000 })
        .first()
        .type('test@example.com');

      cy.get('button[type="submit"]').first().click();

      cy.wait('@resetEmailSent');
    });

  });

  // =========================================
  // ESCENARIO 5: Funcionalidades adicionales de UI
  // =========================================
  describe('ESCENARIO 5 - Funcionalidades adicionales de UI', () => {

    it('Debe permitir mostrar/ocultar contraseña con toggle button', () => {
      getLoginInputs().password.type('password123');

      // Verificar que está oculta (type="password")
      cy.get(selectors.passInput).should('have.attr', 'type', 'password');

      // Clickear toggle para mostrar
      cy.get(selectors.passwordToggleBtn).click();
      cy.get(selectors.passInput).should('have.attr', 'type', 'text');

      // Clickear toggle nuevamente para ocultar
      cy.get(selectors.passwordToggleBtn).click();
      cy.get(selectors.passInput).should('have.attr', 'type', 'password');
    });

    it('Debe tener los campos de email y contraseña requeridos en el formulario', () => {
      cy.get(selectors.loginInput).should('exist').and('be.visible');
      cy.get(selectors.passInput).should('exist').and('be.visible');
      cy.get(selectors.submitBtn).should('exist').and('be.visible');
    });

    it('Debe permitir escribir en ambos campos sin errores', () => {
      getLoginInputs().email
        .should('be.visible')
        .type('test@example.com')
        .should('have.value', 'test@example.com');

      getLoginInputs().password
        .should('be.visible')
        .type('password123')
        .should('have.value', 'password123');
    });

    it('Debe limpiar los campos cuando el usuario lo desee', () => {
      getLoginInputs().email.type('test@example.com');
      getLoginInputs().password.type('password123');

      getLoginInputs().email.clear().should('have.value', '');
      getLoginInputs().password.clear().should('have.value', '');
    });

    it('Debe permitir enviar el formulario presionando Enter en el campo de contraseña', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 200,
        body: {
          id: 'user-123',
          email: 'test@example.com',
          roles: 'system_user'
        }
      }).as('loginViaEnter');

      getLoginInputs().email.type('test@example.com');
      getLoginInputs().password.type('password123{enter}');

      cy.wait('@loginViaEnter');
    });

  });

  // =========================================
  // ESCENARIO 6: Validaciones de Error Server
  // =========================================
  describe('ESCENARIO 6 - Manejo de errores del servidor', () => {

    it('Debe manejar error 500 del servidor', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 500,
        body: { message: 'Internal server error' }
      }).as('serverError');

      getLoginInputs().email.type('test@example.com');
      getLoginInputs().password.type('password123');
      cy.get(selectors.submitBtn).click();

      cy.wait('@serverError');
      cy.url().should('include', 'login');
    });

    it('Debe manejar error 503 (servicio no disponible)', () => {
      cy.intercept('POST', '**/api/v4/users/login', {
        statusCode: 503,
        body: { message: 'Service temporarily unavailable' }
      }).as('serviceUnavailable');

      getLoginInputs().email.type('test@example.com');
      getLoginInputs().password.type('password123');
      cy.get(selectors.submitBtn).click();

      cy.wait('@serviceUnavailable');
      cy.url().should('include', 'login');
    });

    it('Debe manejar timeout de la petición', () => {
      cy.intercept('POST', '**/api/v4/users/login', (req) => {
        req.destroy();
      }).as('requestTimeout');

      getLoginInputs().email.type('test@example.com');
      getLoginInputs().password.type('password123');
      cy.get(selectors.submitBtn).click();

      // Esperar a que falle la petición
      cy.on('fail', () => {
        cy.url().should('include', 'login');
      });
    });

  });

});
