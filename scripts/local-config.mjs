import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { resolve } from 'node:path';

export function loadLocalConfig(directory = process.cwd(), environment = process.env) {
  const file = resolve(directory, '.env');
  const values = { ...(existsSync(file) ? parseEnv(readFileSync(file, 'utf8')) : {}), ...environment };
  const url = values.EMDASH_DATABASE_URL || 'file:./data.db';
  if (!url.startsWith('file:') || url.includes('?')) throw new Error('Local imports require a plain file: SQLite URL.');
  return { database: resolve(directory, url.slice(5)), uploads: resolve(directory, values.EMDASH_UPLOADS_DIR || './uploads') };
}
