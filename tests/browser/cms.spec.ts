import { test, expect, type BrowserContext } from '@playwright/test';

test.describe('EmDash administration and publishing', () => {
  let admin: BrowserContext;
  let editor: BrowserContext;
  const headers = { Origin: 'http://127.0.0.1:4372', 'X-EmDash-Request': '1' };
  test.beforeAll(async ({ browser }, info) => {
    test.skip(info.project.name !== 'desktop');
    admin = await browser.newContext({baseURL:'http://127.0.0.1:4372',storageState:'.superpowers/admin-state.json'});
    editor = await browser.newContext({baseURL:'http://127.0.0.1:4372',storageState:'.superpowers/editor-state.json'});
  });
  test.afterAll(async () => { await admin?.close(); await editor?.close(); });

  test('anonymous reads exclude draft brands and deny administration', async ({ page, request }) => {
    await page.goto('/surfactants/search?q=DRAFTONLYSECRET');
    await expect(page.getByRole('heading', { name: 'No matching products' })).toBeVisible();
    expect((await page.content()).includes('"brand":"DRAFTONLYSECRET"')).toBe(false);
    expect((await request.get('/_emdash/api/content/brands?status=draft')).status()).toBe(401);
  });

  test('client Editor can edit and publish but cannot administer accounts or schemas', async () => {
    const identity = await (await editor.request.get('/_emdash/api/auth/me')).json();
    expect(identity.data.role).toBe(40);
    expect((await editor.request.get('/_emdash/api/admin/users')).status()).toBe(403);
    const schema = await editor.request.post('/_emdash/api/schema/collections', { headers, data: { slug: 'unauthorised', label: 'Unauthorised' } });
    expect(schema.status()).toBe(403);
  });

  test('draft preview, publication and revision restoration keep public content separate', async ({ page }) => {
    const list = await (await editor.request.get('/_emdash/api/content/home')).json();
    const id = list.data.items[0].id;
    const current = await (await editor.request.get(`/_emdash/api/content/home/${id}`)).json();
    const original = current.data.item;
    const saved = await editor.request.put(`/_emdash/api/content/home/${id}`, { headers, data: { data: { introduction: 'CMS preview isolation test.' }, _rev: original._rev } });
    expect(saved.ok()).toBe(true);
    await page.goto('/surfactants');
    await expect(page.locator('.intro-copy')).not.toHaveText('CMS preview isolation test.');
    const preview = await (await editor.request.post(`/_emdash/api/content/home/${id}/preview-url`, { headers, data: {} })).json();
    await page.goto(preview.data.url);
    await expect(page.locator('.intro-copy')).toHaveText('CMS preview isolation test.');
    const publicPage = await page.context().newPage();
    await publicPage.goto('/surfactants');
    await expect(publicPage.locator('.intro-copy')).not.toHaveText('CMS preview isolation test.');
    await publicPage.close();
    const latest = await (await editor.request.get(`/_emdash/api/content/home/${id}`)).json();
    expect((await editor.request.post(`/_emdash/api/content/home/${id}/publish`, { headers, data: { _rev: latest.data.item._rev } })).ok()).toBe(true);
    await page.goto('/surfactants');
    await expect(page.locator('.intro-copy')).toHaveText('CMS preview isolation test.');
    const revisions = await (await editor.request.get(`/_emdash/api/content/home/${id}/revisions`)).json();
    const old = revisions.data.items.find((item: { data: { introduction?: string } }) => item.data?.introduction === original.data.introduction);
    expect(old).toBeTruthy();
    expect((await editor.request.post(`/_emdash/api/revisions/${old.id}/restore`, { headers, data: {} })).ok()).toBe(true);
    const restored = await (await editor.request.get(`/_emdash/api/content/home/${id}`)).json();
    expect((await editor.request.post(`/_emdash/api/content/home/${id}/publish`, { headers, data: { _rev: restored.data.item._rev } })).ok()).toBe(true);
    await page.goto('/surfactants');
    await expect(page.locator('.intro-copy')).toHaveText(original.data.introduction);
  });
});
