import { test, expect } from '@playwright/test';
import source from '../../src/cms/service-content.json' with { type:'json' };

for(const service of source.pages)test(`${service.slug} renders supplied editable sections and SEO`,async({page},info)=>{
  await page.goto(`/surfactants/${service.slug}`);
  await expect(page.getByRole('heading',{level:1})).toHaveText(service.data.heading);
  await expect(page).toHaveTitle(service.data.seo_title);
  await expect(page.locator('meta[name=description]')).toHaveAttribute('content',service.data.seo_description);
  await expect(page.locator('main')).toContainText(service.data.form_heading);
  await expect(page.locator('.service-steps li')).toHaveCount(service.data.process_steps.length);
  await expect(page.locator('.service-technologies li')).toHaveCount(service.data.technologies.length);
  if(service.slug==='pilot-plant') {
    await expect(page.locator('.service-equipment article')).toHaveCount(4);
    await expect(page.locator('.service-materials li')).toHaveCount(10);
    await expect(page.locator('main')).toContainText('Halal possible on request');
    await expect(page.locator('main')).toContainText('350 °C');
  } else {
    await expect(page.locator('.service-support article')).toHaveCount(5);
    await expect(page.locator('main')).toContainText('1 mt to 35 mt');
    await expect(page.locator('main img')).toHaveCount(9);
    expect(await page.locator('main').innerText()).not.toContain('I believe the chemistries');
  }
  await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`.superpowers/landing-pages/${service.slug}-${info.project.name}.png`,fullPage:true,animations:'disabled'});
  await page.locator('.service-intro a').click();
  await expect(page).toHaveURL(/#project-enquiry$/);
  await expect(page.getByLabel('First Name')).toBeVisible();
});

test('published service pages connect the existing hero and footer entry points',async({page})=>{
  await page.goto('/surfactants');
  await page.getByRole('button',{name:'Show slide 3 of 5: CUSTOM MANUFACTURING THAT BRINGS YOUR IDEAS TO LIFE',exact:true}).click();
  const hero=page.locator('.hero-slide.is-active').getByRole('link',{name:'Read More'});
  await expect(hero).toHaveAttribute('href','/surfactants/custom-manufacturing');
  await hero.click();
  await expect(page.getByRole('heading',{level:1})).toHaveText(source.pages[0].data.heading);
  await page.locator('footer').getByRole('link',{name:'Pilot Plant',exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText(source.pages[1].data.heading);
});

test('embedded project form reviews and saves through the existing enquiry flow',async({page})=>{
  await page.goto('/surfactants/custom-manufacturing#project-enquiry');
  await expect(page.getByLabel('Message',{exact:false})).toHaveValue(/Custom Manufacturing/);
  await page.getByLabel('First Name').fill('Service');await page.getByLabel('Last Name').fill('Fixture');
  await page.getByLabel('Company Name').fill('Test Laboratory');await page.getByLabel('Country').selectOption({label:'Malaysia'});
  await page.getByLabel('Email',{exact:false}).fill('service@example.test');await page.locator('input[name=consent]').check();
  await page.getByRole('button',{name:'Review enquiry'}).click();
  await expect(page.getByRole('heading',{name:'Review your enquiry'})).toBeVisible();
  await expect(page.locator('.enquiry-review')).toContainText('Custom Manufacturing');
  await page.getByRole('button',{name:source.pages[0].data.form_action_label,exact:true}).click();
  await expect(page).toHaveURL(/\/surfactants\/thank-you\?receipt=/);
  await expect(page.getByRole('heading',{name:'Thank you for your enquiry'})).toBeVisible();
});

test('Editor service drafts, preview, publication and unpublication keep public navigation consistent',async({browser,page},info)=>{
  test.skip(info.project.name!=='desktop');test.setTimeout(60_000);
  const editor=await browser.newContext({baseURL:'http://127.0.0.1:4372',storageState:'.superpowers/editor-state.json'});
  const headers={Origin:'http://127.0.0.1:4372','X-EmDash-Request':'1'};
  const list=(await(await editor.request.get('/_emdash/api/content/service_pages')).json()).data.items;
  const id=list.find((item:{slug:string})=>item.slug==='pilot-plant').id;
  const url=`/_emdash/api/content/service_pages/${id}`;
  const current=async()=>(await(await editor.request.get(url)).json()).data.item;
  const publish=async()=>{const latest=await current();const response=await editor.request.post(`${url}/publish`,{headers,data:{_rev:latest._rev}});expect(response.ok(),await response.text()).toBe(true);};
  const original=await current();
  try {
    const saved=await editor.request.put(url,{headers,data:{data:{heading:'PRIVATE SERVICE DRAFT HEADING'},_rev:original._rev}});
    expect(saved.ok(),await saved.text()).toBe(true);
    await page.goto('/surfactants/pilot-plant');
    await expect(page.getByRole('heading',{level:1})).toHaveText(original.data.heading);
    const preview=await editor.request.post(`${url}/preview-url`,{headers,data:{}});
    const previewPage=await editor.newPage();await previewPage.goto((await preview.json()).data.url);
    await expect(previewPage.getByRole('heading',{level:1})).toHaveText('PRIVATE SERVICE DRAFT HEADING');
    await previewPage.close();await publish();
    await page.goto('/surfactants/pilot-plant');await expect(page.getByRole('heading',{level:1})).toHaveText('PRIVATE SERVICE DRAFT HEADING');
    const revisions=(await(await editor.request.get(`${url}/revisions`)).json()).data.items;
    const prior=revisions.find((item:{data:{heading:string}})=>item.data.heading===original.data.heading);
    expect(prior).toBeTruthy();
    expect((await editor.request.post(`/_emdash/api/revisions/${prior.id}/restore`,{headers,data:{}})).ok()).toBe(true);
    await publish();
    const latest=await current();expect((await editor.request.post(`${url}/unpublish`,{headers,data:{_rev:latest._rev}})).ok()).toBe(true);
    expect((await page.goto('/surfactants/pilot-plant'))?.status()).toBe(404);
    await page.goto('/surfactants');
    await expect(page.locator('footer').getByRole('link',{name:'Pilot Plant',exact:true})).toHaveCount(0);
    await expect(page.locator('footer').getByRole('button',{name:'Pilot Plant',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Show slide 5 of 5: FROM LAB IDEA TO 1,000 KG BATCH',exact:true}).click();
    await expect(page.locator('.hero-slide.is-active').getByRole('link',{name:'Read More'})).toHaveCount(0);
    const duplicate=await editor.request.post('/_emdash/api/content/service_pages',{headers,data:{slug:'extra',data:{title:'Extra',route:'pilot-plant',heading:'Extra',introduction:'Extra'}}});
    expect(duplicate.status()).toBeGreaterThanOrEqual(400);expect(duplicate.status()).toBeLessThan(500);
    const fresh=await current();
    expect((await editor.request.put(url,{headers,data:{data:{route:'custom-manufacturing'},_rev:fresh._rev}})).status()).toBeGreaterThanOrEqual(400);
    expect((await editor.request.put(url,{headers,data:{slug:'new-route',_rev:fresh._rev}})).status()).toBe(400);
  } finally {await publish();await editor.close();}
});
