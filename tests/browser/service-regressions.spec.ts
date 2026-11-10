import { test, expect, type Browser, type BrowserContext } from '@playwright/test';
import { readFile } from 'node:fs/promises';

type Item={id:string;slug:string;_rev:string;data:Record<string,unknown>};
const headers={Origin:'http://127.0.0.1:4372','X-EmDash-Request':'1'};
async function session(browser:Browser) {
  const ctx=await browser.newContext({baseURL:'http://127.0.0.1:4372',storageState:'.superpowers/editor-state.json'});
  const items=(await(await ctx.request.get('/_emdash/api/content/service_pages')).json()).data.items as Item[];
  const item=items.find(item=>item.slug==='pilot-plant')!;
  return {ctx,item};
}
const path=(id:string)=>`/_emdash/api/content/service_pages/${id}`;
async function current(ctx:BrowserContext,id:string):Promise<Item>{return(await(await ctx.request.get(path(id))).json()).data.item;}
async function publish(ctx:BrowserContext,id:string){const item=await current(ctx,id);const response=await ctx.request.post(`${path(id)}/publish`,{headers,data:{_rev:item._rev}});expect(response.ok(),await response.text()).toBe(true);}
async function save(ctx:BrowserContext,id:string,data:Record<string,unknown>){const item=await current(ctx,id);const response=await ctx.request.put(path(id),{headers,data:{data,_rev:item._rev}});expect(response.ok(),await response.text()).toBe(true);}
async function mcp(ctx:BrowserContext,name:string,args:Record<string,unknown>){
  const fixture=JSON.parse(await readFile('.superpowers/browser-fixtures.json','utf8'));
  return ctx.request.post('/_emdash/api/mcp',{headers:{...headers,Authorization:`Bearer ${fixture.editorMcpToken}`,Accept:'application/json, text/event-stream','MCP-Protocol-Version':'2025-03-26'},data:{jsonrpc:'2.0',id:1,method:'tools/call',params:{name,arguments:args}}});
}
test.beforeEach(({},info)=>test.skip(info.project.name!=='desktop'));

test('MCP slug-only updates cannot move a published fixed service route',async({browser,page})=>{
  const {ctx,item}=await session(browser);
  try {
    // Prove this session/transport reaches the real MCP server before testing a rejection.
    const read=await mcp(ctx,'content_get',{collection:'service_pages',id:item.id});
    expect(read.ok(),await read.text()).toBe(true);
    expect(await read.text()).toContain(item.id);
    const response=await mcp(ctx,'content_update',{collection:'service_pages',id:item.id,slug:'mcp-moved-service',_rev:(await current(ctx,item.id))._rev});
    expect(response.status()).toBe(400);
    expect((await current(ctx,item.id)).slug).toBe('pilot-plant');
    expect((await page.goto('/surfactants/pilot-plant'))?.status()).toBe(200);
  } finally {
    const latest=await current(ctx,item.id);
    if(latest.slug!=='pilot-plant')await ctx.request.put(path(item.id),{headers,data:{slug:'pilot-plant',_rev:latest._rev}});
    await ctx.close();
  }
});

test('native REST and MCP duplication cannot add another fixed service record',async({browser})=>{
  const {ctx,item}=await session(browser);
  const count=async()=>(await(await ctx.request.get('/_emdash/api/content/service_pages')).json()).data.items as Item[];
  try {
    const rest=await ctx.request.post(`${path(item.id)}/duplicate`,{headers,data:{}});
    const rpc=await mcp(ctx,'content_duplicate',{collection:'service_pages',id:item.id});
    expect(rest.status()).toBe(400);expect(rpc.status()).toBe(400);
    const encoded=await ctx.request.post(`/_emdash/api/content/service%5fpages/${item.id}/duplicate`,{headers,data:{}});
    expect(encoded.status()).toBeGreaterThanOrEqual(400);expect(encoded.status()).toBeLessThan(500);
    expect(await count()).toHaveLength(2);
  } finally {
    for(const extra of await count())if(!['custom-manufacturing','pilot-plant'].includes(extra.slug))await ctx.request.delete(path(extra.id),{headers});
    await ctx.close();
  }
});

test('cleared optional repeaters render safely in native preview and after publication',async({browser,page})=>{
  const {ctx,item}=await session(browser);
  try {
    await save(ctx,item.id,{highlights:null,benefits:null,process_steps:null,technologies:null,materials:null,equipment:null,assurances:null,support_items:null});
    const preview=await ctx.request.post(`${path(item.id)}/preview-url`,{headers,data:{}});
    const previewPage=await ctx.newPage();expect((await previewPage.goto((await preview.json()).data.url))?.status()).toBe(200);
    await expect(previewPage.getByRole('heading',{level:1})).toHaveText(String(item.data.heading));await previewPage.close();
    await publish(ctx,item.id);expect((await page.goto('/surfactants/pilot-plant'))?.status()).toBe(200);
    await expect(page.locator('.service-highlights article')).toHaveCount(0);
  } finally {await save(ctx,item.id,item.data);await publish(ctx,item.id);await ctx.close();}
});

test('cleared CMS send labels retain an accessible enquiry action',async({browser,page})=>{
  test.setTimeout(90_000);
  const {ctx,item}=await session(browser);
  try {
    for(const form_action_label of ['',null,'   ']) {
      await save(ctx,item.id,{form_action_label});await publish(ctx,item.id);
      await page.goto('/surfactants/pilot-plant#project-enquiry');
      await page.reload(); // Same-URL hash navigation otherwise retains the previous review step.
      await expect(page.getByRole('button',{name:'Review enquiry'})).toBeEnabled();
      await page.getByLabel('First Name').fill('Label');await page.getByLabel('Last Name').fill('Fixture');
      await page.getByLabel('Company Name').fill('Test Company');await page.getByLabel('Country').selectOption({label:'Malaysia'});
      await page.getByLabel('Email',{exact:false}).fill('label@example.test');await page.locator('input[name=consent]').check();
      await page.getByRole('button',{name:'Review enquiry'}).click();
      await expect(page.getByRole('button',{name:'Send enquiry',exact:true})).toBeVisible();
    }
  } finally {await save(ctx,item.id,item.data);await publish(ctx,item.id);await ctx.close();}
});

test('optional Pilot support labels and images edited in EmDash appear in the page',async({browser,page})=>{
  const {ctx,item}=await session(browser);
  try {
    const rows=item.data.support_items as Record<string,unknown>[];
    await save(ctx,item.id,{support_items:rows.map((row,i)=>i?row:{...row,label:'EDITABLE SUPPORT LABEL',image:{provider:'external',id:'/images/services/research.png',src:'/images/services/research.png',mimeType:'image/png',alt:'Editable process support'}})});
    await publish(ctx,item.id);await page.goto('/surfactants/pilot-plant');
    await expect(page.locator('.service-support')).toContainText('EDITABLE SUPPORT LABEL');
    await expect(page.getByRole('img',{name:'Editable process support',exact:true})).toHaveAttribute('src','/images/services/research.png');
  } finally {await save(ctx,item.id,item.data);await publish(ctx,item.id);await ctx.close();}
});
