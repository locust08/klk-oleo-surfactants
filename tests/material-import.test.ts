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
import { buildMaterialPatches } from '../src/cms/material-patches';

const block=(text:string)=>[{_type:'block',_key:'paragraph',style:'normal',markDefs:[],children:[{_type:'span',_key:'text',text,marks:[]}]}];
async function fixture() {
  const directory=await mkdtemp(join(tmpdir(),'klk-materials-'));
  const db=new Kysely<Database>({dialect:createDialect({url:`file:${join(directory,'test.db')}`})});
  await runMigrations(db);
  const seed=buildSeed();
  for(const collection of seed.collections||[]) {
    if(collection.slug==='news')collection.fields=collection.fields.filter(field=>!['seo_title','seo_description'].includes(field.slug));
    if(collection.slug==='home') {
      const help=collection.fields.find(field=>field.slug==='help_items')!;
      help.validation!.subFields=(help.validation!.subFields as {slug:string}[]).filter(field=>field.slug!=='image');
    }
  }
  for(const entries of Object.values(seed.content||{}))for(const entry of entries)entry.status='published';
  await applySeed(db,seed,{includeContent:true,onConflict:'skip'});
  return{db,cleanup:async()=>{await db.destroy();await rm(directory,{recursive:true,force:true});}};
}
const patches=[
  {collection:'news',slug:'century',key:'test-century-v1',publish:true,data:{title:'Supplied Century title',body:block('Published source article.'),publication_date:'2026-06-10T00:00:00.000Z',seo_title:'Source SEO title'}},
  {collection:'news',slug:'sustainability',key:'test-sustainability-v1',publish:false,data:{body:block('UNPUBLISHED_SUSTAINABILITY_BODY'),seo_description:'Draft metadata'}},
];

test('materials import publishes dated copy through revisions and retains undated copy privately',async()=>{
  const module=await import('../src/cms/material-import.ts').catch(()=>null);
  assert.ok(module,'Revision-aware materials importer must exist');
  const{db,cleanup}=await fixture();
  try {
    await module.applyMaterials(db,patches);
    const repo=new ContentRepository(db),revisions=new RevisionRepository(db);
    const century=(await repo.findByIdOrSlug('news','century'))!;
    assert.equal((century.data.body as ReturnType<typeof block>)[0].children[0].text,'Published source article.');
    assert.equal(century.data.publication_date,'2026-06-10T00:00:00.000Z');
    assert.equal(century.data.seo_title,'Source SEO title');
    assert.ok(century.liveRevisionId);
    const sustainability=(await repo.findByIdOrSlug('news','sustainability'))!;
    assert.ok(sustainability.draftRevisionId);
    assert.equal(sustainability.data.body==null,true);
    assert.equal(sustainability.data.publication_date==null,true);
    const draft=(await revisions.findById(sustainability.draftRevisionId!))!;
    assert.equal((draft.data.body as ReturnType<typeof block>)[0].children[0].text,'UNPUBLISHED_SUSTAINABILITY_BODY');
    assert.equal(draft.data.publication_date==null,true);
    const editorial=await revisions.create({collection:'news',entryId:century.id,data:{...century.data,title:'Later editorial title'}});
    assert.equal(await repo.replaceDraftRevision('news',century.id,editorial.id,century),true);
    const rerun=await module.applyMaterials(db,patches);
    assert.ok(rerun.every((item:{state:string})=>item.state==='skipped'));
    assert.equal((await repo.findById('news',century.id))!.draftRevisionId,editorial.id);
    assert.equal((await sql`SELECT * FROM ec_brands`.execute(db)).rows.length,25);
    assert.equal((await sql`SELECT * FROM ec_news`.execute(db)).rows.length,2);
  } finally {await cleanup();}
});

test('complete Drive manifest upgrades the earlier schema and preserves homepage editorial copy',async()=>{
  const {applyMaterials}=await import('../src/cms/material-import');
  const{db,cleanup}=await fixture();
  try {
    const repo=new ContentRepository(db);
    const before=(await repo.findByIdOrSlug('home','home'))!;
    const results=await applyMaterials(db,buildMaterialPatches());
    assert.equal(results.filter(item=>item.state==='published').length,3);
    assert.equal(results.filter(item=>item.state==='staged').length,1);
    const home=(await repo.findByIdOrSlug('home','home'))!;
    assert.equal(home.data.introduction,before.data.introduction);
    assert.deepEqual((home.data.help_items as {title:string;copy:string}[]).map(({title,copy})=>({title,copy})),before.data.help_items);
    assert.equal((home.data.help_items as {image:{src:string}}[])[0].image.src,'/images/icons/help-supply.png');
    assert.equal((await applyMaterials(db,buildMaterialPatches())).every(item=>item.state==='skipped'),true);
  } finally {await cleanup();}
});

test('materials import preflight refuses an editor draft before changing another entry',async()=>{
  const module=await import('../src/cms/material-import.ts').catch(()=>null);
  assert.ok(module,'Revision-aware materials importer must exist');
  const{db,cleanup}=await fixture();
  try {
    const repo=new ContentRepository(db),revisions=new RevisionRepository(db);
    const item=(await repo.findByIdOrSlug('news','sustainability'))!;
    const editorial=await revisions.create({collection:'news',entryId:item.id,data:{...item.data,title:'Editor is working'}});
    await repo.replaceDraftRevision('news',item.id,editorial.id,item);
    await assert.rejects(module.applyMaterials(db,patches),/unpublished|draft/i);
    assert.equal((await repo.findByIdOrSlug('news','century'))!.data.title,'A Century of Surfactant Excellence');
    assert.equal((await repo.findById('news',item.id))!.draftRevisionId,editorial.id);
  } finally {await cleanup();}
});

test('materials import does not republish an entry deliberately unpublished by an editor',async()=>{
  const {applyMaterials}=await import('../src/cms/material-import');
  const{db,cleanup}=await fixture();
  try {
    const repo=new ContentRepository(db);
    const item=(await repo.findByIdOrSlug('news','century'))!;
    await repo.unpublish('news',item.id);
    await repo.discardDraft('news',item.id);
    assert.equal((await repo.findById('news',item.id))!.draftRevisionId,null);
    await assert.rejects(applyMaterials(db,patches),/unpublished|draft/i);
    assert.equal((await repo.findById('news',item.id))!.status,'draft');
  } finally {await cleanup();}
});
