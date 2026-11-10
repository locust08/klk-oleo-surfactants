import { request } from '@playwright/test';
import { readFile } from 'node:fs/promises';
export default async function setup() {
  if (process.env.TEST_SERVER_URL) return;
  const baseURL = 'http://127.0.0.1:4372';
  const admin = await request.newContext({ baseURL });
  const created = await admin.get('/_emdash/api/setup/dev-bypass?content=0');
  if (!created.ok()) throw new Error(`Test Admin setup failed: ${created.status()}`);
  const adminIdentity=await (await admin.get('/_emdash/api/auth/me')).json();
  if(adminIdentity.data.role!==50)throw new Error('Test Admin has the wrong role.');
  await admin.storageState({ path: '.superpowers/admin-state.json' });
  await admin.dispose();
  const fixture = JSON.parse(await readFile('.superpowers/browser-fixtures.json', 'utf8'));
  const editor = await request.newContext({ baseURL });
  const login = await editor.post('/_emdash/api/auth/magic-link/verify', { headers: { Origin: baseURL, 'X-EmDash-Request': '1' }, data: { token: new URL(fixture.editorLink).searchParams.get('token') } });
  if (!login.ok()) throw new Error(`Test Editor setup failed: ${login.status()}`);
  await editor.storageState({ path: '.superpowers/editor-state.json' });
  await editor.dispose();
}
