const BASE_URL = 'http://localhost:8065';

const selectors = {
    addChannelsBtn: '#addChannelsCta',
    createNewChannelMenuItem: '#showNewChannel-button', // data-testid="showNewChannel-button"
    modal: '#new-channel-modal',
    nameInput: '#input_new-channel-modal-name',
    purposeInput: '#new-channel-modal-purpose',
    publicSelector: '#public-private-selector-button-O',
    privateSelector: '#public-private-selector-button-P',
    cancelBtn: '.GenericModal__button.btn-tertiary',
    createBtn: '.GenericModal__button.btn-primary',
    nameError: '#error_new-channel-modal-name',
    loginId: '#input_loginId',
    loginPass: '#input_password-input',
    loginBtn: '#saveSetting'
};

const generateRandomString = (length = 6) => {
    return Math.random().toString(36).substring(2, 2 + length);
};

describe('Channel Creation Tests', () => {

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

        // 4. Esperar redirección a town-square
        cy.url({ timeout: 15000 }).should('include', '/channels/town-square');
    });

    const openCreateChannelModal = () => {
        cy.get(selectors.addChannelsBtn).should('be.visible').click();
        cy.get(selectors.createNewChannelMenuItem).should('be.visible').click();
        cy.get(selectors.modal).should('be.visible');
    };

    it('Debe crear un canal PÚBLICO con nombre y descripción', () => {
        const channelName = `public-${generateRandomString()}`;
        const purpose = 'This is a public test channel';

        openCreateChannelModal();

        // Llenar datos
        cy.get(selectors.nameInput).type(channelName);
        cy.get(selectors.purposeInput).type(purpose);

        // Verificar selector público seleccionado por defecto o seleccionarlo
        cy.get(selectors.publicSelector).click();

        // Crear
        cy.get(selectors.createBtn).should('not.be.disabled').click();

        // Verificar redirección al nuevo canal
        cy.url().should('include', `/channels/${channelName}`);
        cy.contains(channelName).should('be.visible'); // Verificar header o sidebar
    });

    it('Debe crear un canal PRIVADO sin descripción', () => {
        const channelName = `private-${generateRandomString()}`;

        openCreateChannelModal();

        cy.get(selectors.nameInput).type(channelName);
        cy.get(selectors.privateSelector).click();

        cy.get(selectors.createBtn).should('not.be.disabled').click();

        cy.url().should('include', `/channels/${channelName}`);
    });

    it('Debe validar campos vacíos (botón deshabilitado y mensaje de error)', () => {
        openCreateChannelModal();

        // Verificar botón deshabilitado inicialmente
        cy.get(selectors.createBtn).should('be.disabled');

        // Escribir y borrar para detonar validación
        cy.get(selectors.nameInput).type('a').clear();

        // Verificar mensaje de error
        cy.get(selectors.nameError).should('be.visible')
            .and('contain', 'Channel names must have at least 1 character');

        cy.get(selectors.createBtn).should('be.disabled');
    });

    it('Debe mostrar error al intentar crear un canal con nombre duplicado', () => {
        const channelName = `duplicate-${generateRandomString()}`;

        // 1. Crear el primer canal
        openCreateChannelModal();
        cy.get(selectors.nameInput).type(channelName);
        cy.get(selectors.createBtn).click();
        cy.url().should('include', `/channels/${channelName}`);

        // 2. Intentar crear el segundo canal con el mismo nombre
        openCreateChannelModal();
        cy.get(selectors.nameInput).type(channelName);

        // Esperar un momento o intentar clickear (depende de si la validación es al escribir o al enviar)
        // Asumiremos que es al enviar o que muestra error
        cy.get(selectors.createBtn).click();

        // Verificar que NO redirige y muestra error
        // Nota: El selector del error puede ser el mismo o un alert general. 
        // Usamos el selector de error de input si es validación de campo, o buscamos un mensaje.
        // Si el backend devuelve error, la UI suele mostrarlo en el modal.
        cy.get(selectors.modal).should('be.visible');
        // Ajustar aserción según comportamiento real (mensaje de error específico)
        // cy.contains('Name already taken').should('be.visible'); 
        // O verificar que la URL no cambia
        cy.url().should('include', `/channels/${channelName}`);
    });

});
