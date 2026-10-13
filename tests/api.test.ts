import { afterEach, expect, it, vi } from 'vitest';
import axios, { AxiosHeaders } from 'axios';

const originalAdapter = axios.defaults.adapter;
afterEach(() => {
    axios.defaults.adapter = originalAdapter;
    vi.unstubAllEnvs();
});

it('sends each HTTP method with base URLs, current auth, payloads and client identity and unwraps responses', async () => {
    // Existing instances use their own defaults, so re-import after installing the adapter.
    vi.resetModules();
    const requests: import('axios').InternalAxiosRequestConfig[] = [];
    const transport = (await import('axios')).default;
    const adapter = vi.fn(async (config) => {
        requests.push(config);
        return { data: { ok: true }, status: 200, statusText: 'OK', headers: new AxiosHeaders(), config };
    });
    transport.defaults.adapter = adapter;
    vi.stubEnv('NEXT_PUBLIC_DEFAULT_API_URL', 'https://default.invalid');
    vi.stubEnv('NEXT_PUBLIC_POST_API_URL', 'https://posts.invalid');
    vi.stubEnv('CHAT_API_URL', 'https://chat.invalid');
    const api = (await import('api')).default;
    const posts = await import('api/post');
    const sessions = await import('api/session');
    const chat = await import('api/chat');
    localStorage.setItem('accessToken', 'first');
    expect(await api.get('/a')).toEqual({ ok: true });
    localStorage.setItem('accessToken', 'second');
    await api.post('/b', { data: { name: 'demo' } });
    await api.patch('/c');
    await api.put('/d');
    await api.delete('/e');
    await posts.getPosts();
    await posts.getPost('post1');
    await chat.getChat();
    await sessions.getSessions('client01');
    await sessions.createSession('client01', { name: 'demo', image: 'ubuntu', description: '' });
    await sessions.deleteSession('client01', { sessionId: 'session1' });
    await sessions.createClientId();
    expect(requests.slice(0, 5).map((r) => r.method)).toEqual(['get', 'post', 'patch', 'put', 'delete']);
    expect(requests[0].headers.get('Authorization')).toBe('Bearer first');
    expect(requests[1].headers.get('Authorization')).toBe('Bearer second');
    expect(requests[0].baseURL).toBe('https://default.invalid');
    expect(requests[0].timeout).toBe(3000);
    expect(requests[5].baseURL).toBe('https://posts.invalid');
    expect(requests[6].url).toBe('post/post1');
    expect(requests[7].baseURL).toBe('https://chat.invalid');
    expect(requests[8].headers.get('X-Client-Id')).toBe('client01');
    expect(JSON.parse(requests[9].data)).toEqual({ name: 'demo', image: 'ubuntu', description: '' });
    expect(JSON.parse(requests[10].data)).toEqual({ sessionId: 'session1' });
    expect(requests[11].url).toBe('session/client-id');
    adapter.mockRejectedValueOnce(new Error('offline'));
    await expect(api.get('/failure')).rejects.toThrow('offline');
    transport.defaults.adapter = originalAdapter;
});

it('supports build-time requests without browser storage and uses the longer build timeout', async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_BUILD', 'true');
    const transport = (await import('axios')).default;
    const adapter = vi.fn(async (config) => ({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config,
    }));
    transport.defaults.adapter = adapter;
    const api = (await import('api')).default;
    vi.stubGlobal('window', undefined);
    try {
        await api.get('/build');
        expect(adapter.mock.calls[0][0].timeout).toBe(30000);
    } finally {
        vi.unstubAllGlobals();
        transport.defaults.adapter = originalAdapter;
    }
});
