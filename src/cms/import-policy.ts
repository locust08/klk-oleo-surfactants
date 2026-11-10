import { sql, type Kysely } from 'kysely';
import type { Database } from 'emdash';
import type { SeedFile } from 'emdash/seed';

/** Slugs are editorial; source keys preserve import ownership across later renames. */
export async function preserveImportedEntries(db: Kysely<Database>, seed: SeedFile): Promise<SeedFile> {
  const content: NonNullable<SeedFile['content']> = {};
  for (const [collection, entries] of Object.entries(seed.content || {})) {
    if (!/^[a-z_]+$/.test(collection)) throw new Error('Invalid source collection.');
    const table = `ec_${collection}`;
    const exists = await sql`SELECT name FROM sqlite_master WHERE type='table' AND name=${table}`.execute(db);
    if (!exists.rows.length) { content[collection] = entries; continue; }
    const columns = await sql<{name:string}>`PRAGMA table_info(${sql.ref(table)})`.execute(db);
    if (!columns.rows.some(column => column.name === 'source_key')) { content[collection] = entries; continue; }
    const rows = await sql<{source_key:string|null}>`SELECT source_key FROM ${sql.table(table)}`.execute(db);
    const keys = new Set(rows.rows.map(row => row.source_key).filter(Boolean));
    content[collection] = entries.filter(entry => !keys.has(String(entry.data.source_key || '')));
  }
  return { ...seed, content };
}
