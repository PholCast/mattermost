import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { apiCreateChannel, apiGetTeams } from '../tasks/mattermostChannels';
import { apiSendMessage } from '../tasks/mattermostMessages';

const generateRandomString = (length = 6) => Math.random().toString(36).substring(2, 2 + length);

Given('que existe un canal donde puedo publicar', async function () {
    const w: any = this as any;
    const token = w.token; // Assumes 'que estoy autenticado en Mattermost' was called

    // Get team
    const teamsRes = await apiGetTeams(token);
    const teamId = teamsRes.body[0].id;

    // Create a temporary channel for testing messages
    const name = `msg-test-${generateRandomString()}`;
    const displayName = `Msg Test ${name}`;

    const res = await apiCreateChannel(token, teamId, name, displayName, 'O');
    assert.strictEqual(res.status, 201, 'Failed to create test channel');

    w.targetChannelId = res.body.id;
});

When('envío un mensaje de texto a ese canal', async function () {
    const w: any = this as any;
    const message = `Hello Serenity ${generateRandomString()}`;
    w.sentMessageText = message;

    const res = await apiSendMessage(w.token, w.targetChannelId, message);
    w.lastResponse = res;
});

Then('el mensaje debería aparecer en el historial del canal', function () {
    const res = (this as any).lastResponse;
    assert.strictEqual(res.status, 201, `Expected status 201, got ${res.status}`);
    assert.strictEqual(res.body.message, (this as any).sentMessageText);
});
