import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { DatabaseSync } from 'node:sqlite';

test('real seed command uses .env database and preserves renamed source entries on rerun', async () => {
  const directory=await mkdtemp(join(tmpdir(),'klk-import-command-'));
  const args=['--import',fileURLToPath(new URL('../node_modules/tsx/dist/loader.mjs',import.meta.url)),fileURLToPath(new URL('../scripts/import-content.ts',import.meta.url))];
  const env={...process.env}; delete env.EMDASH_DATABASE_URL; delete env.EMDASH_UPLOADS_DIR;
  try {
    await writeFile(join(directory,'.env'),'EMDASH_DATABASE_URL=file:./configured.db\nEMDASH_UPLOADS_DIR=./media\n');
    await promisify(execFile)(process.execPath,args,{cwd:directory,env});
    assert.equal(existsSync(join(directory,'data.db')),false);
    const db=new DatabaseSync(join(directory,'configured.db'));
    db.exec("UPDATE ec_brands SET slug='renamed-brand',title='Editorial title' WHERE slug='palmosalt'; UPDATE ec_news SET slug='renamed-news' WHERE slug='century'");
    db.close();
    await promisify(execFile)(process.execPath,args,{cwd:directory,env});
    const restored=new DatabaseSync(join(directory,'configured.db'),{readOnly:true});
    try {
      assert.equal(restored.prepare('SELECT COUNT(*) AS n FROM ec_brands').get()!.n,25);
      assert.equal(restored.prepare("SELECT title FROM ec_brands WHERE slug='renamed-brand'").get()!.title,'Editorial title');
      assert.equal(restored.prepare('SELECT COUNT(*) AS n FROM ec_news').get()!.n,2);
      assert.ok(restored.prepare("SELECT id FROM ec_news WHERE slug='renamed-news'").get());
    } finally {restored.close();}
  } finally {await rm(directory,{recursive:true,force:true});}
});
