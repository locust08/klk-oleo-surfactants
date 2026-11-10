import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DatabaseSync } from 'node:sqlite';

test('backup restores a consistent SQLite snapshot and uploads into a new directory only', async () => {
  const module = await import('../scripts/local-backup.mjs').catch(() => null);
  assert.ok(module, 'Local backup and restore implementation must exist');
  const directory = await mkdtemp(join(tmpdir(), 'klk-backup-test-'));
  try {
    const file = join(directory, 'source.db');
    const db = new DatabaseSync(file);
    db.exec("PRAGMA journal_mode=WAL; CREATE TABLE private_leads (message TEXT); INSERT INTO private_leads VALUES ('Saved enquiry')");
    await mkdir(join(directory, 'uploads'));
    await writeFile(join(directory, 'uploads', 'brochure.pdf'), 'test asset');
    const snapshot = join(directory, 'snapshot');
    await module.backupLocal({ database: file, uploads: join(directory, 'uploads'), destination: snapshot });
    db.exec("INSERT INTO private_leads VALUES ('Later enquiry')");
    db.close();
    const restored = join(directory, 'restored');
    await module.restoreLocal({ snapshot, destination: restored });
    const recovered = new DatabaseSync(join(restored, 'data.db'), { readOnly: true });
    assert.deepEqual(recovered.prepare('SELECT message FROM private_leads').all().map(row => row.message), ['Saved enquiry']);
    recovered.close();
    assert.equal(await readFile(join(restored, 'uploads', 'brochure.pdf'), 'utf8'), 'test asset');
    await assert.rejects(module.restoreLocal({ snapshot, destination: restored }), /exist/i);
    await assert.rejects(module.backupLocal({ database: file, uploads: join(directory, 'uploads'), destination: snapshot }), /exist/i);
    await writeFile(join(snapshot, 'data.db'), 'corrupted');
    await assert.rejects(module.restoreLocal({ snapshot, destination: join(directory, 'corrupt-restored') }), /checksum/i);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
