import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { apiMattermostSignUp } from '../tasks/mattermostAuth';

const generateRandomString = (length = 6) => Math.random().toString(36).substring(2, 2 + length);

Given('que tengo datos de usuario nuevos y válidos', function () {
    const randomSuffix = generateRandomString();
    const username = `user_${randomSuffix}`;
    const email = `user_${randomSuffix}@example.com`;
    const password = 'Password123!';
    (this as any).credentials = { username, email, password };
});

When('intento registrarme en Mattermost', async function () {
    const w: any = this as any;
    const creds = w.credentials;
    // Use the known invite ID from the environment or hardcoded from previous context
    const inviteId = 'peigeoymd7d4zrgsyn6s3azyue';
    const res = await apiMattermostSignUp(creds.username, creds.email, creds.password, inviteId);
    w.lastResponse = res;
});

Then('debería recibir una confirmación de registro exitoso', function () {
    const res = (this as any).lastResponse;
    if (res.status !== 201) {
        console.error('Signup failed with status:', res.status);
        console.error('Error body:', JSON.stringify(res.body, null, 2));
    }
    assert.ok(res, 'Expected response to exist');
    assert.strictEqual(res.status, 201, `Expected status 201, got ${res.status}`);
});

Then('el usuario debería existir en el sistema', function () {
    const res = (this as any).lastResponse;
    assert.ok(res.body.id, 'Expected user ID in response');
    assert.strictEqual(res.body.username, (this as any).credentials.username);
});
