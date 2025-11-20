import superagent from 'superagent';

const API_BASE = 'http://localhost:8065/api/v4';

export async function apiSendMessage(token: string, channelId: string, message: string) {
    const payload = {
        channel_id: channelId,
        message: message
    };
    const url = `${API_BASE}/posts`;
    try {
        const res = await superagent.post(url)
            .set('Authorization', `Bearer ${token}`)
            .send(payload)
            .ok(res => res.status < 500);
        console.log('[apiSendMessage] POST', url, '=>', res.status);
        return res;
    } catch (err: any) {
        console.error('[apiSendMessage] ERROR', url, err && err.message);
        return { status: err?.status || 500, body: err?.response?.body } as any;
    }
}
