import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { apiMattermostLogin } from '../tasks/mattermostAuth';
import { apiCreateChannel, apiGetTeams } from '../tasks/mattermostChannels';

const generateRandomString = (length = 6) => Math.random().toString(36).substring(2, 2 + length);

Given('que estoy autenticado en Mattermost', async function () {
    // Hardcoded valid credentials for now, or reuse from context if available
    const loginId = 'usuario.valido@ejemplo.com';
    const password = 'Clave123';

    const res = await apiMattermostLogin(loginId, password);
    assert.strictEqual(res.status, 200, 'Login failed');
    (this as any).token = res.body.token;
    (this as any).user = res.body;
});

Given('tengo datos válidos para un nuevo canal público', async function () {
    const w: any = this as any;
    const token = w.token;

    // Need a team ID to create a channel
    const teamsRes = await apiGetTeams(token);
    assert.strictEqual(teamsRes.status, 200, 'Failed to get teams');
    assert.ok(teamsRes.body.length > 0, 'No teams found for user');

    const teamId = teamsRes.body[0].id;
    const name = `channel-${generateRandomString()}`;
    const displayName = `Channel ${name}`;

    w.channelData = { teamId, name, displayName, type: 'O' };
});

When('intento crear el canal', async function () {
    const w: any = this as any;
    const { teamId, name, displayName, type } = w.channelData;
    const res = await apiCreateChannel(w.token, teamId, name, displayName, type);
    w.lastResponse = res;
});

Then('el canal debería ser creado exitosamente', function () {
    const res = (this as any).lastResponse;
    assert.strictEqual(res.status, 201, `Expected status 201, got ${res.status}`);
    assert.ok(res.body.id, 'Expected channel ID in response');
});

Then('debería poder ver el canal en la lista de canales', function () {
    const res = (this as any).lastResponse;
    assert.strictEqual(res.body.name, (this as any).channelData.name);
});
