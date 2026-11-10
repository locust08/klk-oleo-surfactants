import { mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { validateSeed } from 'emdash/seed';
import { buildSeed } from '../src/cms/seed';

const seed = buildSeed();
const validation = validateSeed(seed);
if (!validation.valid) throw new Error(validation.errors.join('\n'));
await mkdir('.emdash', { recursive: true });
await writeFile('.emdash/seed.json', JSON.stringify(seed, null, 2) + '\n');
const database = (process.env.EMDASH_DATABASE_URL || 'file:./data.db').replace(/^file:/, '');
const { stdout } = await promisify(execFile)(process.execPath, ['node_modules/emdash/dist/cli/index.mjs', 'seed', '.emdash/seed.json', '--database', database, '--on-conflict', 'skip', '--uploads-dir', process.env.EMDASH_UPLOADS_DIR || './uploads']);
console.log(stdout);
