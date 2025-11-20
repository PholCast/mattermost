const BASE_URL = 'http://localhost:8065';
const TARGET_USER = '@polcastaneda';
const DM_URL = `${BASE_URL}/organizacionprueba/messages/${TARGET_USER}`;

const selectors = {
    loginId: '#input_loginId',
    loginPass: '#input_password-input',
    loginBtn: '#saveSetting',
    postTextbox: '#post_textbox',
    sendMessageBtn: '[data-testid="SendMessageButton"]',
    postListContent: '#postListContent',
    lastPost: '.post-message__text' // Selector genérico, ajustaremos si es necesario
};

const generateRandomString = (length = 6) => {
    return Math.random().toString(36).substring(2, 2 + length);
};

describe('Messaging Tests', () => {

    beforeEach(() => {
        cy.on('uncaught:exception', () => false);

        // Limpieza
        cy.window().then((win) => {
            win.localStorage.clear();
            win.sessionStorage.clear();
        });

        // 1. Abrir root y manejar "View in Browser"
        cy.visit(BASE_URL, { failOnStatusCode: false });

        cy.get('body').then($body => {
            const btn = $body.find('span:contains("View in Browser")').closest('a,button');
            if (btn.length) {
                cy.wrap(btn).click({ force: true });
            }
        });

        // 2. Ir al login
        cy.visit(`${BASE_URL}/login`, { failOnStatusCode: false });

        // 3. Loguearse
        cy.get(selectors.loginId).should('be.visible').type('usuario.valido@ejemplo.com');
        cy.get(selectors.loginPass).should('be.visible').type('Clave123');
        cy.get(selectors.loginBtn).click();

        // 4. Esperar login y navegar al chat directo
        // Podemos esperar a que cargue town-square o ir directo si la sesión está lista
        cy.url({ timeout: 15000 }).should('include', '/channels/');

        // Navegar al DM específico
        cy.visit(DM_URL);

        // Esperar a que cargue el input de mensajes
        cy.get(selectors.postTextbox, { timeout: 15000 }).should('be.visible');
    });

    it('Debe enviar un mensaje de texto correctamente', () => {
        const messageText = `Hello ${TARGET_USER}, this is a test message ${generateRandomString()}`;

        // Escribir mensaje
        cy.get(selectors.postTextbox).type(messageText);

        // Verificar que el botón de enviar se habilita
        cy.get(selectors.sendMessageBtn).should('not.be.disabled');

        // Enviar mensaje (click o enter)
        cy.get(selectors.sendMessageBtn).click();

        // Verificar que el mensaje aparece en el historial
        // Buscamos el texto en el contenedor de posts
        cy.get(selectors.postListContent).should('contain', messageText);

        // Verificar que el input se limpió
        cy.get(selectors.postTextbox).should('have.value', '');
    });

    it('Debe validar que no se puede enviar mensaje vacío', () => {
        // Verificar botón deshabilitado inicialmente o con texto vacío
        cy.get(selectors.postTextbox).clear();
        cy.get(selectors.sendMessageBtn).should('be.disabled');

        // Escribir espacios y verificar que sigue deshabilitado (si aplica)
        cy.get(selectors.postTextbox).type('   ');
        cy.get(selectors.sendMessageBtn).should('be.disabled');
    });

    it('Debe permitir enviar mensaje con Enter', () => {
        const messageText = `Message via Enter ${generateRandomString()}`;

        cy.get(selectors.postTextbox).type(`${messageText}{enter}`);

        cy.get(selectors.postListContent).should('contain', messageText);
        cy.get(selectors.postTextbox).should('have.value', '');
    });

});
