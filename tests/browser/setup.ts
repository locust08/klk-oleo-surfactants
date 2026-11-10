import { request } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
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
  // Native MCP is bearer-only: authorize a scoped token through the real device flow.
  // This account/database is disposable; never use the real local CMS for this fixture.
  const codeResponse=await editor.post('/_emdash/api/oauth/device/code',{data:{scope:'content:read content:write'}});
  if(!codeResponse.ok())throw new Error(`MCP test device code failed: ${codeResponse.status()}`);
  const code=(await codeResponse.json()).data;
  const authorization=await editor.post('/_emdash/api/oauth/device/authorize',{headers:{Origin:baseURL,'X-EmDash-Request':'1'},data:{user_code:code.user_code,action:'approve'}});
  if(!authorization.ok())throw new Error(`MCP test authorization failed: ${authorization.status()}`);
  const exchange=await editor.post('/_emdash/api/oauth/device/token',{data:{device_code:code.device_code,grant_type:'urn:ietf:params:oauth:grant-type:device_code'}});
  if(!exchange.ok())throw new Error(`MCP test token exchange failed: ${exchange.status()}`);
  fixture.editorMcpToken=(await exchange.json()).data.access_token;
  await writeFile('.superpowers/browser-fixtures.json',JSON.stringify(fixture),{mode:0o600});
  await editor.dispose();
}
