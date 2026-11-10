import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Kysely, sql } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import { runMigrations } from 'emdash/db';
import { applySeed, validateSeed } from 'emdash/seed';
import type { Database } from 'emdash';

test('CMS import creates draft source records and preserves editor changes on rerun', async () => {
  const module = await import('../src/cms/seed.ts').catch(() => null);
  assert.ok(module, 'Surfactants CMS seed must exist');
  const directory = await mkdtemp(join(tmpdir(), 'klk-cms-'));
  const db = new Kysely<Database>({ dialect: createDialect({ url: `file:${join(directory, 'test.db')}` }) });
  try {
    await runMigrations(db);
    const seed = module.buildSeed();
    assert.deepEqual(validateSeed(seed).errors, []);
    await applySeed(db, seed, { includeContent: true, onConflict: 'skip' });
    const brands = await sql<{ slug: string; status: string; title: string }>`select slug,status,title from ec_brands`.execute(db);
    assert.equal(brands.rows.length, 25);
    assert.ok(brands.rows.every(row => row.status === 'draft'));
    assert.ok(brands.rows.some(row => row.slug === 'sympare'));
    const home = await sql<{ hero_slides: string }>`select "hero_slides" from ec_home`.execute(db);
    assert.equal(JSON.parse(home.rows[0].hero_slides).length, 5);
    await sql`update ec_brands set title='Edited PALMOSALT' where slug='palmosalt'`.execute(db);
    await applySeed(db, seed, { includeContent: true, onConflict: 'skip' });
    const edited = await sql<{ title: string }>`select title from ec_brands where slug='palmosalt'`.execute(db);
    assert.equal(edited.rows[0].title, 'Edited PALMOSALT');
    assert.equal((await sql`select * from ec_brands`.execute(db)).rows.length, 25);
  } finally { await db.destroy(); await rm(directory, { recursive: true, force: true }); }
});
