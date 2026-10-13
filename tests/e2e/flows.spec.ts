import { test, expect } from '@playwright/test';

test('reads an article through actual Next routing and Markdown rendering', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Test article' })).toBeVisible();
    await page.getByRole('link', { name: 'Test article' }).click();
    await expect(page).toHaveURL(/\/post\/demo$/);
    await expect(page.getByRole('heading', { name: 'Article body' })).toBeVisible();
    await expect(page.getByText('inline code')).toBeVisible();
});

test('loads, creates and deletes sessions, and retains a session when deletion fails', async ({ page }) => {
    const existing = { name: 'Existing', sessionId: 'session1', image: 'ubuntu', description: 'workspace', ttl: 600 };
    let sessions = [existing];
    let failDelete = false;
    await page.addInitScript(() => localStorage.setItem('clientId', 'client01'));
    await page.route('http://127.0.0.1:4318/session**', async (route) => {
        const req = route.request();
        const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' };
        if (req.method() === 'OPTIONS') {
            await route.fulfill({ status: 204, headers });
            return;
        }
        expect(req.headers()['x-client-id']).toBe('client01');
        if (req.method() === 'GET') {
            await route.fulfill({ json: sessions, headers });
            return;
        }
        if (req.method() === 'POST') {
            const created = { ...req.postDataJSON(), sessionId: 'session2', ttl: 600 };
            sessions.push(created);
            await route.fulfill({ status: 201, json: created, headers });
            return;
        }
        if (failDelete) {
            await route.fulfill({ status: 400, json: { msg: 'Bad Request' }, headers });
            return;
        }
        const id = req.postDataJSON().sessionId;
        sessions = sessions.filter((s) => s.sessionId !== id);
        await route.fulfill({ status: 204, headers });
    });
    await page.goto('/session');
    await expect(page.getByText('Existing', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Create Session', exact: false }).click();
    await page.getByLabel('Name', { exact: true }).fill('New');
    await page.getByLabel('Image', { exact: true }).selectOption('ubuntu');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText('New', { exact: true })).toBeVisible();
    await page.getByTitle('Delete session').first().click();
    await expect(page.getByText('New', { exact: true })).toHaveCount(0);
    failDelete = true;
    await page.getByTitle('Delete session').click();
    await expect(page.getByText('cannot delete session')).toBeVisible();
    await expect(page.getByText('Existing', { exact: true })).toBeVisible();
});
