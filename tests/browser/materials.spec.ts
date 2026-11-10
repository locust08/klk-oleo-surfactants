import { test, expect } from '@playwright/test';
import materials from '../../src/cms/drive-materials.json' with { type: 'json' };

test('supplied Century article publishes its body, source date and SEO with a working hero link', async ({ page }) => {
  await page.goto('/surfactants');
  const link = page.locator('.hero-slide').first().getByRole('link', { name: /Read More/i });
  await expect(link).toHaveAttribute('href', '/surfactants/news-media/century');
  await link.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(materials.articles[0].data.title);
  await expect(page.locator('main article')).toContainText('10/06/2026');
  await expect(page.getByRole('heading', { name: 'A century of progress in Delden' })).toBeVisible();
  await expect(page).toHaveTitle(materials.articles[0].data.seo_title);
  await expect(page.locator('meta[name=description]')).toHaveAttribute('content', materials.articles[0].data.seo_description!);
});

test('undated Sustainability body stays out of public output but is available in authorized preview', async ({ page, request, browser }, info) => {
  const bodyHeading = 'What the expansion will deliver';
  expect((await request.get('/surfactants/news-media/sustainability')).status()).toBe(404);
  await page.goto('/surfactants');
  expect(await page.content()).not.toContain(bodyHeading);
  await page.goto('/surfactants/news-media');
  expect(await page.content()).not.toContain(bodyHeading);
  if (info.project.name !== 'desktop') return;
  const editor = await browser.newContext({ baseURL: 'http://127.0.0.1:4372', storageState: '.superpowers/editor-state.json' });
  try {
    const list = (await (await editor.request.get('/_emdash/api/content/news')).json()).data.items;
    const item = list.find((item: { slug: string }) => item.slug === 'sustainability');
    const preview = await editor.request.post(`/_emdash/api/content/news/${item.id}/preview-url`, { headers: { Origin: 'http://127.0.0.1:4372', 'X-EmDash-Request': '1' }, data: {} });
    expect(preview.ok(), await preview.text()).toBe(true);
    const previewPage = await editor.newPage();
    await previewPage.goto((await preview.json()).data.url);
    await expect(previewPage.getByRole('heading', { name: bodyHeading })).toBeVisible();
    await expect(previewPage.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/);
  } finally { await editor.close(); }
});

test('supplied award, help icons and archive copy retain the responsive layout', async ({ page }) => {
  await page.goto('/surfactants');
  await expect(page.locator('.help-grid img')).toHaveCount(4);
  await expect(page.getByRole('img', { name: materials.award.alt })).toHaveAttribute('src', materials.award.src);
  const loaded = await page.locator('.help-grid img, .award-artwork img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0));
  expect(loaded).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/surfactants/news-media');
  await expect(page.locator('.centred-intro')).toContainText(materials.newsPage.introduction);
  await expect(page).toHaveTitle(materials.newsPage.seo_title);
});
