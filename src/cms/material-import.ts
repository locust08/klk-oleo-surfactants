import type { Kysely } from 'kysely';
import { ContentRepository, RevisionRepository, OptionsRepository, SchemaRegistry, handleContentGet, handleContentPublish, type Database } from 'emdash';
import { buildSeed } from './seed';
import { validateStructuredContent } from './content-policy';

export type MaterialPatch = {
  collection: string;
  slug: string;
  key: string;
  publish: boolean;
  data: Record<string, unknown> | ((current: Record<string, unknown>) => Record<string, unknown>);
};

async function ensureMaterialSchema(db: Kysely<Database>) {
  const registry = new SchemaRegistry(db);
  const collections = buildSeed().collections!;
  for (const slug of ['seo_title', 'seo_description']) {
    if (!await registry.getField('news', slug)) {
      const field = collections.find(item => item.slug === 'news')!.fields.find(item => item.slug === slug)!;
      await registry.createField('news', field);
    }
  }
  const help = await registry.getField('home', 'help_items');
  if (!help) throw new Error('Import the base Surfactants schema first.');
  if (!help.validation?.subFields?.some(field => field.slug === 'image')) {
    const desired = collections.find(item => item.slug === 'home')!.fields.find(item => item.slug === 'help_items')!;
    const desiredValidation = desired.validation as NonNullable<typeof help.validation>;
    const image = desiredValidation.subFields!.find(field => field.slug === 'image')!;
    await registry.updateField('home', 'help_items', { validation: { ...help.validation, subFields: [...(help.validation?.subFields || []), image] } });
  }
}

/** Offline SQLite import: one atomic transaction, native revisions, no account changes.
 * Receipts skip completed source versions before checking for subsequent editorial drafts.
 */
export async function applyMaterials(db: Kysely<Database>, patches: MaterialPatch[]) {
  return db.transaction().execute(async trx => {
    const repo = new ContentRepository(trx);
    const revisions = new RevisionRepository(trx);
    const options = new OptionsRepository(trx);
    const results: { key: string; state: 'skipped' | 'published' | 'staged' }[] = [];
    const pending = [];
    const identities = new Set<string>();
    const keys = new Set<string>();
    for (const patch of patches) {
      const identity = `${patch.collection}/${patch.slug}`;
      if (identities.has(identity) || keys.has(patch.key)) throw new Error('Duplicate material patch.');
      identities.add(identity); keys.add(patch.key);
      const receipt = `surfactants:drive_materials:${patch.key}`;
      if (await options.exists(receipt)) { results.push({ key: patch.key, state: 'skipped' }); continue; }
      const current = await repo.findByIdOrSlug(patch.collection, patch.slug);
      if (!current) throw new Error(`Missing imported entry: ${identity}`);
      if (current.status !== 'published' || current.draftRevisionId) throw new Error(`Preserve unpublished entry or editor draft: ${identity}`);
      const data = { ...current.data, ...(typeof patch.data === 'function' ? patch.data(current.data) : patch.data) };
      validateStructuredContent(patch.collection, data, { current: current.data });
      if (patch.collection === 'news' && patch.publish && (!Array.isArray(data.body) || !data.body.length || !data.publication_date)) throw new Error('Published source articles require a body and approved date.');
      pending.push({ patch, current, data, receipt });
    }
    if (!pending.length) return results;
    await ensureMaterialSchema(trx);
    for (const { patch, current, data, receipt } of pending) {
      const revision = await revisions.create({ collection: patch.collection, entryId: current.id, data });
      if (!await repo.replaceDraftRevision(patch.collection, current.id, revision.id, current)) throw new Error(`Entry changed during import: ${patch.collection}/${patch.slug}`);
      if (patch.publish) {
        const staged = await handleContentGet(trx, patch.collection, current.id);
        if (!staged.success || staged.data.item.draftRevisionId !== revision.id) throw new Error('Staged material revision changed.');
        const published = await handleContentPublish(trx, patch.collection, current.id, { _rev: staged.data._rev });
        if (!published.success) throw new Error(published.error.message);
      }
      const state = patch.publish ? 'published' : 'staged';
      await options.set(receipt, { collection: patch.collection, entryId: current.id, revisionId: revision.id, state });
      results.push({ key: patch.key, state });
    }
    return results;
  });
}
