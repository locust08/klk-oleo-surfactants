import { test, expect, type BrowserContext } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.describe('EmDash administration and publishing', () => {
  let admin: BrowserContext;
  let editor: BrowserContext;
  const headers = { Origin: 'http://127.0.0.1:4372', 'X-EmDash-Request': '1' };
  test.beforeAll(async ({ browser }, info) => {
    test.skip(info.project.name !== 'desktop');
    admin = await browser.newContext({baseURL:'http://127.0.0.1:4372',storageState:'.superpowers/admin-state.json'});
    editor = await browser.newContext({baseURL:'http://127.0.0.1:4372',storageState:'.superpowers/editor-state.json'});
  });
  test.afterAll(async () => { await admin?.close(); await editor?.close(); });

  test('anonymous reads exclude draft brands and deny administration', async ({ page, request }) => {
    await page.goto('/surfactants/search?q=DRAFTONLYSECRET');
    await expect(page.getByRole('heading', { name: 'No matching products' })).toBeVisible();
    expect((await page.content()).includes('"brand":"DRAFTONLYSECRET"')).toBe(false);
    expect((await request.get('/_emdash/api/content/brands?status=draft')).status()).toBe(401);
  });

  test('client Editor can edit and publish but cannot administer accounts or schemas', async () => {
    const identity = await (await editor.request.get('/_emdash/api/auth/me')).json();
    expect(identity.data.role).toBe(40);
    expect((await editor.request.get('/_emdash/api/admin/users')).status()).toBe(403);
    const schema = await editor.request.post('/_emdash/api/schema/collections', { headers, data: { slug: 'unauthorised', label: 'Unauthorised' } });
    expect(schema.status()).toBe(403);
  });

  test('draft preview, publication and revision restoration keep public content separate', async ({ page }) => {
    const list = await (await editor.request.get('/_emdash/api/content/home')).json();
    const id = list.data.items[0].id;
    const current = await (await editor.request.get(`/_emdash/api/content/home/${id}`)).json();
    const original = current.data.item;
    const saved = await editor.request.put(`/_emdash/api/content/home/${id}`, { headers, data: { data: { introduction: 'CMS preview isolation test.' }, _rev: original._rev } });
    expect(saved.ok()).toBe(true);
    await page.goto('/surfactants');
    await expect(page.locator('.intro-copy')).not.toHaveText('CMS preview isolation test.');
    const preview = await (await editor.request.post(`/_emdash/api/content/home/${id}/preview-url`, { headers, data: {} })).json();
    await page.goto(preview.data.url);
    await expect(page.locator('.intro-copy')).toHaveText('CMS preview isolation test.');
    const publicPage = await page.context().newPage();
    await publicPage.goto('/surfactants');
    await expect(publicPage.locator('.intro-copy')).not.toHaveText('CMS preview isolation test.');
    await publicPage.close();
    const latest = await (await editor.request.get(`/_emdash/api/content/home/${id}`)).json();
    expect((await editor.request.post(`/_emdash/api/content/home/${id}/publish`, { headers, data: { _rev: latest.data.item._rev } })).ok()).toBe(true);
    await page.goto('/surfactants');
    await expect(page.locator('.intro-copy')).toHaveText('CMS preview isolation test.');
    const revisions = await (await editor.request.get(`/_emdash/api/content/home/${id}/revisions`)).json();
    const old = revisions.data.items.find((item: { data: { introduction?: string } }) => item.data?.introduction === original.data.introduction);
    expect(old).toBeTruthy();
    expect((await editor.request.post(`/_emdash/api/revisions/${old.id}/restore`, { headers, data: {} })).ok()).toBe(true);
    const restored = await (await editor.request.get(`/_emdash/api/content/home/${id}`)).json();
    expect((await editor.request.post(`/_emdash/api/content/home/${id}/publish`, { headers, data: { _rev: restored.data.item._rev } })).ok()).toBe(true);
    await page.goto('/surfactants');
    await expect(page.locator('.intro-copy')).toHaveText(original.data.introduction);
  });

  test('uploaded CMS images and brochure PDFs survive save, publish and public rendering', async ({ page, request }) => {
    const home = (await (await editor.request.get('/_emdash/api/content/home')).json()).data.items[0];
    const brand = (await (await editor.request.get('/_emdash/api/content/brands')).json()).data.items.find((item: {slug:string}) => item.slug === 'palmosalt');
    const upload = await editor.request.post('/_emdash/api/media', { headers, multipart: { file: { name: 'fixture.png', mimeType: 'image/png', buffer: readFileSync('public/images/brand/favicon.png') } } });
    expect(upload.ok(), await upload.text()).toBe(true);
    const image = (await upload.json()).data.item;
    const pdfUpload = await editor.request.post('/_emdash/api/media', { headers, multipart: { file: { name: 'fixture.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n') } } });
    expect(pdfUpload.ok(), await pdfUpload.text()).toBe(true);
    const pdf = (await pdfUpload.json()).data.item;
    const ref = (item: {id:string;mimeType:string;storageKey:string}) => ({ id:item.id,provider:'local',mimeType:item.mimeType,meta:{storageKey:item.storageKey} });
    async function update(collection:string,id:string,data:Record<string,unknown>) {
      const current = (await (await editor.request.get(`/_emdash/api/content/${collection}/${id}`)).json()).data.item;
      const saved = await editor.request.put(`/_emdash/api/content/${collection}/${id}`,{headers,data:{data,_rev:current._rev}});
      expect(saved.ok(),await saved.text()).toBe(true);
      const latest = (await (await editor.request.get(`/_emdash/api/content/${collection}/${id}`)).json()).data.item;
      const published = await editor.request.post(`/_emdash/api/content/${collection}/${id}/publish`,{headers,data:{_rev:latest._rev}});
      expect(published.ok(),await published.text()).toBe(true);
    }
    try {
      await update('home',home.id,{award_image:ref(image),hero_slides:home.data.hero_slides.map((slide:Record<string,unknown>,i:number)=>i===0?{...slide,image:ref(image)}:slide)});
      await update('brands',brand.id,{brochure:ref(pdf)});
      await page.goto('/surfactants');
      expect(await page.locator('.hero-slide').first().locator('img').getAttribute('src')).toContain(image.storageKey);
      await expect(page.locator('.award-artwork img')).toHaveAttribute('src',new RegExp(image.storageKey));
      await page.goto('/surfactants/products/anionic');
      const href=await page.locator('#palmosalt').getByRole('link',{name:'Download brochure (PDF)'}).getAttribute('href');
      expect(href).toContain(pdf.storageKey);
      expect((await request.get(href!)).status()).toBe(200);
    } finally {
      await update('home',home.id,{award_image:home.data.award_image||null,hero_slides:home.data.hero_slides});
      await update('brands',brand.id,{brochure:brand.data.brochure||null});
    }
  });

  test('structured hero values and reserved entry identities are enforced on direct Editor saves', async () => {
    const home=(await (await editor.request.get('/_emdash/api/content/home')).json()).data.items[0];
    const current=(await (await editor.request.get(`/_emdash/api/content/home/${home.id}`)).json()).data.item;
    const invalidHero={...current.data.hero_slides[0],kind:'unsupported'};
    const invalid=await editor.request.put(`/_emdash/api/content/home/${home.id}`,{headers,data:{data:{hero_slides:[invalidHero,...current.data.hero_slides.slice(1)]},_rev:current._rev}});
    expect(invalid.status()).toBeGreaterThanOrEqual(400);
    expect(invalid.status()).toBeLessThan(500);
    const duplicate=await editor.request.post('/_emdash/api/content/home',{headers,data:{slug:'extra-home',data:{title:'Extra Home',identity:'home'}}});
    expect(duplicate.status()).toBeGreaterThanOrEqual(400);
    expect(duplicate.status()).toBeLessThan(500);
    const pages=(await (await editor.request.get('/_emdash/api/content/pages')).json()).data.items;
    const page=pages.find((item:{slug:string})=>item.slug==='products');
    const revision=(await (await editor.request.get(`/_emdash/api/content/pages/${page.id}`)).json()).data.item;
    const changed=await editor.request.put(`/_emdash/api/content/pages/${page.id}`,{headers,data:{data:{route:'contact'},_rev:revision._rev}});
    expect(changed.status()).toBeGreaterThanOrEqual(400);
    expect(changed.status()).toBeLessThan(500);
    const slugChange=await editor.request.put(`/_emdash/api/content/home/${home.id}`,{headers,data:{slug:'renamed-home',_rev:current._rev}});
    try {
      expect(slugChange.status()).toBeGreaterThanOrEqual(400);
      expect(slugChange.status()).toBeLessThan(500);
    } finally {
      if(slugChange.ok()) {
        const renamed=(await (await editor.request.get(`/_emdash/api/content/home/${home.id}`)).json()).data.item;
        await editor.request.put(`/_emdash/api/content/home/${home.id}`,{headers,data:{slug:'home',_rev:renamed._rev}});
      }
    }
  });
});
