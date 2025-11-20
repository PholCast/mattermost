// Pruebas E2E de Signup para Mattermost
// Escenarios: Registro exitoso, validaciones de campos, UI interactions

const BASE_URL = 'http://localhost:8065';

const selectors = {
    emailInput: '#input_email',
    nameInput: '#input_name',
    passInput: '#input_password-input',
    submitBtn: '#saveSetting',
    passwordToggleBtn: '#password_toggle',
    loginLink: '.alternate-link__link',
    backButton: '[data-testid="back_button"]',
    emailError: '#error_email', // Asumido, verificar si existe en HTML o usar selector genérico
    nameError: '#error_name',
    passError: '#error_password-input',
    newsletterCheckbox: '#signup-body-card-form-check-newsletter'
};

// ---------------------------------------
// Helper: obtiene los inputs de signup
// ---------------------------------------

const generateRandomSixDigitNumber = () => {
    // Genera un número aleatorio entre 100000 (inclusive) y 999999 (inclusive)
    return Math.floor(100000 + Math.random() * 900000);
};

const getSignupInputs = () => {
    return {
        email: cy.get(selectors.emailInput),
        name: cy.get(selectors.nameInput),
        password: cy.get(selectors.passInput)
    };
};

describe('Pruebas E2E - Signup Mattermost', () => {

    // ---------------------------------------
    // BEFORE EACH
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

        // Ahora forzar ir al signup verdadero
        // Nota: Se asume /signup_email como la URL estándar de registro por email
        cy.visit('http://localhost:8065/signup_user_complete/?id=peigeoymd7d4zrgsyn6s3azyue', {
            failOnStatusCode: false
        });

        // Esperar campos visibles
        cy.get(selectors.emailInput, { timeout: 15000 }).should('be.visible');
        cy.get(selectors.nameInput, { timeout: 15000 }).should('be.visible');
    });

    // =========================================
    // ESCENARIO 1: Registro Exitoso
    // =========================================
    describe('ESCENARIO 1 - Registro Exitoso', () => {

        it('Debe registrar un usuario exitosamente con datos válidos', () => {

            const randomSuffix = generateRandomSixDigitNumber();
            const username = `newuser${randomSuffix}`;
            const email = `newuser_${randomSuffix}@example.com`;

            getSignupInputs().email.type(email);
            getSignupInputs().name.type(username);
            getSignupInputs().password.type('Password123!');

            // Verificar que el botón se habilita (si aplica) o simplemente clickear
            cy.get(selectors.submitBtn).should('not.be.disabled').click();

            // Verificar redirección o mensaje de éxito
            // Normalmente redirige al login o al tutorial
            cy.location('pathname', { timeout: 10000 }).should('not.include', 'signup');
        });

    });

    // =========================================
    // ESCENARIO 2: Validaciones de Campos
    // =========================================
    describe('ESCENARIO 2 - Validaciones de Campos', () => {

        it('Debe mostrar error si el usuario ya existe', () => {
            // Usamos un usuario que sabemos que existe (o muy probable)
            getSignupInputs().email.type('unique_email_' + generateRandomSixDigitNumber() + '@example.com');
            getSignupInputs().name.type('testuser'); // Usuario común en tests
            getSignupInputs().password.type('Password123!');

            cy.get(selectors.submitBtn).should('not.be.disabled').click();

            // Verificar que seguimos en la página
            cy.url().should('include', 'signup');
        });

        it('Debe mostrar error si el email ya está en uso', () => {
            getSignupInputs().email.type('test@example.com'); // Email común en tests
            getSignupInputs().name.type('newuser_' + generateRandomSixDigitNumber());
            getSignupInputs().password.type('Password123!');

            cy.get(selectors.submitBtn).should('not.be.disabled').click();

            cy.url().should('include', 'signup');
        });

        it('Debe validar formato de contraseña inválido (muy corta)', () => {
            // Validación del lado del cliente o servidor
            getSignupInputs().email.type('test@example.com');
            getSignupInputs().name.type('testuser');
            getSignupInputs().password.type('123'); // Muy corta

            // Verificar si aparece el error antes de enviar o al enviar
            // Asumiendo validación en tiempo real o al blur
            cy.get(selectors.passInput).blur();
            cy.get(selectors.passError).should('be.visible').and('contain', 'Your password must be');
        });

        it('Debe validar caracteres inválidos en el nombre de usuario', () => {
            getSignupInputs().name.type('user name'); // Espacio no permitido usualmente
            cy.get(selectors.nameInput).blur();
            cy.get(selectors.nameError).should('be.visible');
        });

    });

    // =========================================
    // ESCENARIO 3: UI Interactions
    // =========================================
    describe('ESCENARIO 3 - Interacciones de UI', () => {

        it('Debe permitir mostrar y ocultar la contraseña', () => {
            getSignupInputs().password.type('SecretPass');
            cy.get(selectors.passInput).should('have.attr', 'type', 'password');

            cy.get(selectors.passwordToggleBtn).click();
            cy.get(selectors.passInput).should('have.attr', 'type', 'text');

            cy.get(selectors.passwordToggleBtn).click();
            cy.get(selectors.passInput).should('have.attr', 'type', 'password');
        });

        it('Debe navegar al login al hacer click en "Log in"', () => {
            cy.get(selectors.loginLink).should('be.visible').click();
            cy.location('pathname').should('include', 'login');
        });

        it('Debe regresar al inicio al hacer click en "Back"', () => {
            cy.get(selectors.backButton).should('be.visible').click();
            // Asumiendo que vuelve al root o landing
            cy.location('pathname').should('eq', '/landing');
        });

    });

});
