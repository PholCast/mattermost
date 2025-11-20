import superagent from 'superagent';

const API_BASE = 'http://localhost:8065/api/v4';

export async function apiCreateChannel(token: string, teamId: string, name: string, displayName: string, type: 'O' | 'P' = 'O') {
    const payload = {
        team_id: teamId,
        name: name,
        display_name: displayName,
        type: type
    };
    const url = `${API_BASE}/channels`;
    try {
        const res = await superagent.post(url)
            .set('Authorization', `Bearer ${token}`)
            .send(payload)
            .ok(res => res.status < 500);
        console.log('[apiCreateChannel] POST', url, '=>', res.status);
        return res;
    } catch (err: any) {
        console.error('[apiCreateChannel] ERROR', url, err && err.message);
        return { status: err?.status || 500, body: err?.response?.body } as any;
    }
}

// Helper to get Team ID (needed for channel creation)
export async function apiGetTeams(token: string) {
    const url = `${API_BASE}/users/me/teams`;
    try {
        const res = await superagent.get(url)
            .set('Authorization', `Bearer ${token}`)
            .ok(res => res.status < 500);
        return res;
    } catch (err: any) {
        console.error('[apiGetTeams] ERROR', url, err && err.message);
        return { status: err?.status || 500, body: err?.response?.body } as any;
    }
}
