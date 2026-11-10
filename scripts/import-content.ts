import { mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { validateSeed } from 'emdash/seed';
import { buildSeed } from '../src/cms/seed';
import { Kysely } from 'kysely';
import type { Database } from 'emdash';
import { createDialect } from 'emdash/db/sqlite';
import { preserveImportedEntries } from '../src/cms/import-policy';
import { loadLocalConfig } from './local-config.mjs';

const seed = buildSeed();
const validation = validateSeed(seed);
if (!validation.valid) throw new Error(validation.errors.join('\n'));
await mkdir('.emdash', { recursive: true });
await writeFile('.emdash/seed.json', JSON.stringify(seed, null, 2) + '\n');
const config = loadLocalConfig();
const db = new Kysely<Database>({dialect:createDialect({url:`file:${config.database}`})});
let filtered;
try { filtered = await preserveImportedEntries(db,seed); } finally { await db.destroy(); }
const directory = await mkdtemp(join(tmpdir(),'klk-import-'));
try {
  const path=join(directory,'seed.json');
  await writeFile(path,JSON.stringify(filtered));
  const cli=fileURLToPath(new URL('../node_modules/emdash/dist/cli/index.mjs',import.meta.url));
  const {stdout}=await promisify(execFile)(process.execPath,[cli,'seed',path,'--database',config.database,'--on-conflict','skip','--uploads-dir',config.uploads]);
  console.log(stdout);
} finally { await rm(directory,{recursive:true,force:true}); }
