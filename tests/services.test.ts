import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Kysely, sql } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import { runMigrations } from 'emdash/db';
import { applySeed } from 'emdash/seed';
import { ContentRepository, RevisionRepository, type Database } from 'emdash';
import { buildSeed } from '../src/cms/seed';
import { validateStructuredContent } from '../src/cms/content-policy';
import { buildServiceSeed } from '../src/cms/service-seed';

test('service source installs two published fixed pages and preserves later editorial states on rerun', async()=>{
  const module=await import('../src/cms/service-import.ts').catch(()=>null);
  assert.ok(module,'Native service page installer must exist');
  const dir=await mkdtemp(join(tmpdir(),'klk-services-'));
  const db=new Kysely<Database>({dialect:createDialect({url:`file:${join(dir,'test.db')}`})});
  try {
    await runMigrations(db);
    const baseline=buildSeed();
    baseline.collections=baseline.collections?.filter(item=>item.slug!=='service_pages');
    delete baseline.content?.service_pages;
    await applySeed(db,baseline,{includeContent:true,onConflict:'skip'});
    const before=(await sql`SELECT * FROM ec_home`.execute(db)).rows;
    const first=await module.installServicePages(db,{publishNew:true});
    assert.equal(first.imported,2);
    const repo=new ContentRepository(db),revisions=new RevisionRepository(db);
    const manufacturing=(await repo.findByIdOrSlug('service_pages','custom-manufacturing'))!;
    const pilot=(await repo.findByIdOrSlug('service_pages','pilot-plant'))!;
    assert.equal(manufacturing.status,'published');
    assert.equal(pilot.status,'published');
    assert.equal(manufacturing.data.scale_value,'1 mt to 35 mt');
    assert.equal((manufacturing.data.support_items as unknown[]).length,5);
    assert.equal((pilot.data.equipment as unknown[]).length,4);
    assert.equal((pilot.data.materials as unknown[]).length,10);
    const edit=await revisions.create({collection:'service_pages',entryId:manufacturing.id,data:{...manufacturing.data,heading:'Editor draft heading'}});
    await repo.replaceDraftRevision('service_pages',manufacturing.id,edit.id,manufacturing);
    await repo.unpublish('service_pages',pilot.id);
    await repo.discardDraft('service_pages',pilot.id);
    const rerun=await module.installServicePages(db,{publishNew:true});
    assert.equal(rerun.imported,0);
    assert.equal((await repo.findById('service_pages',manufacturing.id))!.draftRevisionId,edit.id);
    assert.equal((await repo.findById('service_pages',pilot.id))!.status,'draft');
    await repo.delete('service_pages',pilot.id);
    assert.equal((await module.installServicePages(db,{publishNew:true})).imported,0);
    assert.equal(await repo.findByIdOrSlug('service_pages','pilot-plant'),null);
    assert.deepEqual((await sql`SELECT * FROM ec_home`.execute(db)).rows,before);
    assert.equal((await sql`SELECT * FROM ec_brands`.execute(db)).rows.length,25);
  } finally {await db.destroy();await rm(dir,{recursive:true,force:true});}
});

test('service pages reject additional records, route changes and unsafe structured images',()=>{
  assert.throws(()=>validateStructuredContent('service_pages',{title:'Extra',route:'pilot-plant'},{isNew:true}),/fixed|imported/i);
  assert.throws(()=>validateStructuredContent('service_pages',{route:'custom-manufacturing'},{current:{route:'pilot-plant'}}),/route/i);
  assert.throws(()=>validateStructuredContent('service_pages',{support_items:[{title:'Unsafe',image:{provider:'external',src:'/file.svg',mimeType:'image/svg+xml'}}]}),/image type/i);
});

test('service list schemas expose only fields that their layout renders',()=>{
  const fields=buildServiceSeed().collections![0].fields;
  for(const slug of ['technologies','materials'])assert.deepEqual((fields.find(field=>field.slug===slug)!.validation!.subFields as {slug:string}[]).map(field=>field.slug),['title']);
});
