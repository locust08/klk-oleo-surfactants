import { resolve } from 'node:path';
import { Kysely } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import type { Database } from 'emdash';
import { loadLocalConfig } from './local-config.mjs';
import { backupLocal } from './local-backup.mjs';
import { applyMaterials } from '../src/cms/material-import';
import { buildMaterialPatches } from '../src/cms/material-patches';

// Stop the local application before invoking this offline import.
const [flag, destination, ...extra] = process.argv.slice(2);
if (flag !== '--backup' || !destination || extra.length) throw new Error('Usage: npm run cms:materials -- --backup NEW_SNAPSHOT_DIR (stop the application first)');
process.umask(0o077);
const config = loadLocalConfig();
await backupLocal({ ...config, destination: resolve(destination) });
console.log(`Pre-import backup: ${resolve(destination)}`);
const db = new Kysely<Database>({ dialect: createDialect({ url: `file:${config.database}` }) });
try { console.log(JSON.stringify(await applyMaterials(db, buildMaterialPatches()), null, 2)); }
finally { await db.destroy(); }
