import superagent from 'superagent';

const API_BASE = 'http://localhost:8065/api/v4';

export async function apiMattermostSignUp(username: string, email: string, password: string, inviteId?: string) {
    const payload: any = { username, email, password };
    if (inviteId) {
        payload.invite_id = inviteId;
    }
    let url = `${API_BASE}/users`;
    if (inviteId) {
        url += `?iid=${inviteId}`;
        payload.invite_id = inviteId;
    }
    try {
        const res = await superagent.post(url).send(payload).ok(res => res.status < 500);
        console.log('[apiMattermostSignUp] POST', url, '=>', res.status);
        return res;
    } catch (err: any) {
        console.error('[apiMattermostSignUp] ERROR', url, err && err.message);
        return { status: err?.status || 500, body: err?.response?.body } as any;
    }
}

export async function apiMattermostLogin(login_id: string, password: string) {
    const payload = { login_id, password };
    const url = `${API_BASE}/users/login`;
    try {
        const res = await superagent.post(url).send(payload).ok(res => res.status < 500);
        console.log('[apiMattermostLogin] POST', url, '=>', res.status);
        // Mattermost returns the token in the 'Token' header
        if (res.header['token']) {
            res.body.token = res.header['token'];
        }
        return res;
    } catch (err: any) {
        console.error('[apiMattermostLogin] ERROR', url, err && err.message);
        return { status: err?.status || 500, body: err?.response?.body } as any;
    }
}
