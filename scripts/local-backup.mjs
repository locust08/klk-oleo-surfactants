import { DatabaseSync, backup } from 'node:sqlite';
import { mkdir, readdir, copyFile, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const checksum = async file => createHash('sha256').update(await readFile(file)).digest('hex');
const within = (parent, child) => { const path = relative(resolve(parent), resolve(child)); return !path || (!path.startsWith('..') && !isAbsolute(path)); };

async function files(directory, prefix = '') {
  if (!existsSync(directory)) return [];
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error('Uploads must contain regular files, not symbolic links.');
    const name = join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await files(join(directory, entry.name), name));
    else if (entry.isFile()) result.push(name);
  }
  return result.sort();
}

async function copyUploads(source, destination, names) {
  await mkdir(destination, { recursive: true, mode: 0o700 });
  for (const name of names) {
    const target = join(destination, name);
    await mkdir(resolve(target, '..'), { recursive: true, mode: 0o700 });
    await copyFile(join(source, name), target);
  }
}

/** Stop the application while copying database and media to keep both at one editorial point. */
export async function backupLocal({ database, uploads, destination }) {
  if (!existsSync(database) || !(await stat(database)).isFile()) throw new Error('Source SQLite database does not exist.');
  if (within(uploads, destination)) throw new Error('Backup destination must be outside uploads.');
  const names = await files(uploads);
  await mkdir(destination, { mode: 0o700 }); // Exclusive: never overwrite an existing snapshot.
  const db = new DatabaseSync(database, { readOnly: true });
  try { await backup(db, join(destination, 'data.db')); } finally { db.close(); }
  await copyUploads(uploads, join(destination, 'uploads'), names);
  const checksums = { 'data.db': await checksum(join(destination, 'data.db')) };
  for (const name of names) checksums[`uploads/${name}`] = await checksum(join(destination, 'uploads', name));
  await writeFile(join(destination, 'manifest.json'), JSON.stringify({ version: 1, createdAt: new Date().toISOString(), checksums }, null, 2), { mode: 0o600, flag: 'wx' });
}

export async function restoreLocal({ snapshot, destination }) {
  const manifest = JSON.parse(await readFile(join(snapshot, 'manifest.json'), 'utf8'));
  if (manifest.version !== 1 || !manifest.checksums?.['data.db']) throw new Error('Unsupported or incomplete backup manifest.');
  for (const [name, expected] of Object.entries(manifest.checksums)) {
    if (!within(snapshot, join(snapshot, name)) || await checksum(join(snapshot, name)) !== expected) throw new Error('Backup checksum validation failed.');
  }
  const db = new DatabaseSync(join(snapshot, 'data.db'), { readOnly: true });
  try { if (db.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('SQLite integrity check failed.'); } finally { db.close(); }
  await mkdir(destination, { mode: 0o700 }); // Restore beside the app; leave current data untouched.
  await copyFile(join(snapshot, 'data.db'), join(destination, 'data.db'));
  const names = await files(join(snapshot, 'uploads'));
  for (const name of names) if (!manifest.checksums[`uploads/${name}`]) throw new Error('Untracked upload in backup.');
  await copyUploads(join(snapshot, 'uploads'), join(destination, 'uploads'), names);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.umask(0o077);
  if (existsSync('.env')) process.loadEnvFile('.env');
  const [action, source, target] = process.argv.slice(2);
  try {
    if (action === 'backup' && source && !target) {
      const url = process.env.EMDASH_DATABASE_URL || 'file:./data.db';
      if (!url.startsWith('file:') || url.includes('?')) throw new Error('Local backups require a plain file: SQLite URL.');
      await backupLocal({ database: resolve(url.slice(5)), uploads: resolve(process.env.EMDASH_UPLOADS_DIR || './uploads'), destination: resolve(source) });
      console.log(`Backup saved to ${resolve(source)}`);
    } else if (action === 'restore' && source && target) {
      await restoreLocal({ snapshot: resolve(source), destination: resolve(target) });
      console.log(`Restored into ${resolve(target)}. Current application data was preserved.`);
    } else throw new Error('Usage: npm run cms:backup -- NEW_SNAPSHOT_DIR | npm run cms:restore -- SNAPSHOT_DIR NEW_RESTORE_DIR');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
