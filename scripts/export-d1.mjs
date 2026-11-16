// Export the local editorial SQLite database as SQL for a fresh Cloudflare D1 database.
// Content, schema, revisions and plugin data are kept; accounts, passkeys, tokens and
// sessions are removed (passkeys are bound to the local hostname) and first-admin setup is
// reopened so the agency owner registers on the hosted domain.
// Usage: node scripts/export-d1.mjs <source.db> <out.sql> <site-url>
import { DatabaseSync } from 'node:sqlite';
import { copyFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [source, out, siteUrl] = process.argv.slice(2);
if (!source || !out || !siteUrl) throw new Error('Usage: node scripts/export-d1.mjs <source.db> <out.sql> <site-url>');

const work = join(mkdtempSync(join(tmpdir(), 'surfactants-d1-')), 'export.db');
const src = new DatabaseSync(source, { readOnly: true });
src.exec(`VACUUM INTO '${work.replaceAll("'", "''")}'`);
src.close();

const db = new DatabaseSync(work);
const clear = ['users', 'credentials', 'auth_challenges', 'auth_tokens', 'oauth_accounts', '_emdash_api_tokens', '_emdash_oauth_tokens',
  '_emdash_authorization_codes', '_emdash_device_codes', '_emdash_entry_locks', '_emdash_rate_limits', '_emdash_404_log', '_emdash_migrations_lock', 'audit_logs'];
const tables = new Set(db.prepare("select name from sqlite_master where type='table'").all().map((row) => row.name));
for (const table of clear) if (tables.has(table)) db.exec(`delete from "${table}"`);
const setOption = db.prepare('insert into options(name, value) values (?, ?) on conflict(name) do update set value = excluded.value');
setOption.run('emdash:setup_complete', 'false');
setOption.run('emdash:site_url', JSON.stringify(siteUrl));
setOption.run('emdash:preview_secret', JSON.stringify(randomBytes(32).toString('base64url')));
setOption.run('emdash:ip_salt', JSON.stringify(randomBytes(32).toString('base64url')));
// D1 rejects explicit transactions and PRAGMA statements and SQLite's unistr() escapes; it manages sqlite_sequence itself.
// Tables first, then rows, then indexes/triggers so imported rows do not fire triggers.
const literal = (value) => value === null ? 'NULL'
  : value instanceof Uint8Array ? `X'${Buffer.from(value).toString('hex')}'`
  : typeof value === 'number' || typeof value === 'bigint' ? String(value)
  : `'${String(value).replaceAll("'", "''")}'`;
const schema = db.prepare("select type, name, sql from sqlite_master where sql is not null and name not like 'sqlite_%' and name not like '_cf_%' order by case type when 'table' then 0 when 'index' then 1 else 2 end, rowid").all();
const lines = [];
for (const { sql } of schema.filter((row) => row.type === 'table')) lines.push(`${sql};`);
for (const { name } of schema.filter((row) => row.type === 'table')) {
  for (const row of db.prepare(`select * from "${name}"`).all()) {
    const columns = Object.keys(row);
    lines.push(`INSERT INTO "${name}" (${columns.map((column) => `"${column}"`).join(', ')}) VALUES (${columns.map((column) => literal(row[column])).join(', ')});`);
  }
}
for (const { sql } of schema.filter((row) => row.type !== 'table')) lines.push(`${sql};`);
db.close();
const sql = `${lines.join('\n')}\n`;
writeFileSync(out, sql);
console.log(`Wrote ${out} (${(sql.length / 1024).toFixed(0)} KiB, ${lines.length} statements)`);
