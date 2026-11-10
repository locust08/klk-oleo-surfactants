import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('seed configuration honors .env and explicit environment overrides', async () => {
  const module = await import('../scripts/local-config.mjs').catch(() => null);
  assert.ok(module, 'Shared local seed configuration must exist');
  const directory = await mkdtemp(join(tmpdir(), 'klk-config-'));
  try {
    await writeFile(join(directory, '.env'), 'EMDASH_DATABASE_URL=file:./alternate.db\nEMDASH_UPLOADS_DIR=./other-uploads\n');
    assert.equal(module.loadLocalConfig(directory, {}).database, join(directory, 'alternate.db'));
    assert.equal(module.loadLocalConfig(directory, {}).uploads, join(directory, 'other-uploads'));
    assert.equal(module.loadLocalConfig(directory, { EMDASH_DATABASE_URL: 'file:./override.db' }).database, join(directory, 'override.db'));
  } finally { await rm(directory, { recursive: true, force: true }); }
});
