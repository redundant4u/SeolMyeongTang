import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    use: { baseURL: 'http://127.0.0.1:4317', trace: 'retain-on-failure' },
    webServer: [
        { command: 'node tests/e2e/fixture-server.cjs', url: 'http://127.0.0.1:4318/post', reuseExistingServer: false },
        {
            command: 'pnpm exec next dev --webpack --hostname 127.0.0.1 --port 4317',
            url: 'http://127.0.0.1:4317',
            reuseExistingServer: false,
            timeout: 120000,
            env: {
                NEXT_PUBLIC_POST_API_URL: 'http://127.0.0.1:4318',
                NEXT_PUBLIC_DEFAULT_API_URL: 'http://127.0.0.1:4318',
                NEXT_PUBLIC_VNC_API_URL: 'vnc.test',
            },
        },
    ],
});
