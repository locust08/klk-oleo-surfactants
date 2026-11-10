import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Kysely } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import type { Database } from 'emdash';
import { createKyselyAdapter, type AuthTables } from '@emdash-cms/auth/adapters/kysely';
import { createMagicLinkUrl, Role } from '@emdash-cms/auth';
import { buildSeed } from '../src/cms/seed';
import { applyMaterials } from '../src/cms/material-import';
import { buildMaterialPatches } from '../src/cms/material-patches';

// A separate disposable environment: source content is published only in this test database.
const directory = await mkdtemp(join(tmpdir(), 'klk-browser-'));
const database = join(directory, 'test.db');
const baseUrl = 'http://127.0.0.1:4372';
const db = new Kysely<Database>({ dialect: createDialect({ url: `file:${database}` }) });
const seed = buildSeed();
for (const entries of Object.values(seed.content || {})) for (const entry of entries) entry.status = 'published';
seed.content!.brands.push({ id: 'test:draft', slug: 'draft-only', status: 'draft', data: { title: 'DRAFTONLYSECRET', category: 'anionic', order: 99 } });
const seedPath=join(directory,'seed.json');
await writeFile(seedPath,JSON.stringify(seed));
await promisify(execFile)(process.execPath,['node_modules/emdash/dist/cli/index.mjs','seed',seedPath,'--database',database,'--on-conflict','skip','--uploads-dir',join(directory,'uploads')]);
await applyMaterials(db, buildMaterialPatches());
const adapter = createKyselyAdapter(db as unknown as Kysely<AuthTables>);
const editor = await adapter.createUser({ email: 'editor@example.test', name: 'Test Editor', role: Role.EDITOR, emailVerified: true });
const editorLink = await createMagicLinkUrl(adapter, editor, baseUrl);
await mkdir('.superpowers', { recursive: true });
await writeFile('.superpowers/browser-fixtures.json', JSON.stringify({ database, directory, editorLink }), { mode: 0o600 });
await db.destroy();
const child = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'dev', '--host', '127.0.0.1', '--port', '4372', '--ignore-lock'], {
  cwd: resolve('.'), stdio: 'inherit', env: { ...process.env, EMDASH_DATABASE_URL: `file:${database}`, EMDASH_UPLOADS_DIR: join(directory, 'uploads'), EMDASH_SITE_URL: baseUrl, ASTRO_TELEMETRY_DISABLED: '1' },
});
process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));
child.on('exit', code => process.exit(code || 0));
