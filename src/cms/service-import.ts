import type { Kysely } from 'kysely';
import { ContentRepository, SchemaRegistry, handleContentGet, handleContentPublish, type Database } from 'emdash';
import { applySeed, validateSeed } from 'emdash/seed';
import { buildServiceSeed } from './service-seed';
import { preserveImportedEntries } from './import-policy';
import { validateStructuredContent } from './content-policy';

/** Local SQLite only. Source-key skips preserve existing drafts, unpublished and trashed entries. */
export async function installServicePages(db:Kysely<Database>,options:{publishNew:boolean}) {
  const seed=buildServiceSeed();
  const validation=validateSeed(seed);
  if(!validation.valid)throw new Error(validation.errors.join('\n'));
  return db.transaction().execute(async trx=>{
    const filtered=await preserveImportedEntries(trx,seed);
    const additions=filtered.content!.service_pages;
    if(!additions.length)return {imported:0};
    const repo=new ContentRepository(trx);
    const existing=await new SchemaRegistry(trx).getCollection('service_pages');
    if(existing)for(const entry of additions) {
      if(await repo.findByIdOrSlug('service_pages',entry.slug!))throw new Error(`Service route already exists: ${entry.slug}`);
    }
    for(const entry of additions)validateStructuredContent('service_pages',entry.data);
    await applySeed(trx,filtered,{includeContent:true,onConflict:'skip'});
    if(options.publishNew)for(const entry of additions) {
      const item=await repo.findByIdOrSlug('service_pages',entry.slug!);
      if(!item||item.data.source_key!==entry.data.source_key)throw new Error('New source entry could not be verified.');
      const current=await handleContentGet(trx,'service_pages',item.id);
      if(!current.success)throw new Error(current.error.message);
      const published=await handleContentPublish(trx,'service_pages',item.id,{_rev:current.data._rev});
      if(!published.success)throw new Error(published.error.message);
    }
    return {imported:additions.length};
  });
}
