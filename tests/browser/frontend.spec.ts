import { test, expect } from '@playwright/test';

test('home preserves the supplied portfolio, markets and responsive layout', async ({ page }, info) => {
  await page.goto('/surfactants');
  await expect(page.getByRole('heading', { name: '100 YEARS', exact: true })).toBeVisible();
  await expect(page.locator('.hero-selectors button')).toHaveCount(5);
  await expect(page.locator('.brand-card')).toHaveCount(25);
  await expect(page.locator('.market-card')).toHaveCount(5);
  await expect(page.locator('.faq-list details')).toHaveCount(5);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `.superpowers/parity/${process.env.PARITY_PHASE || 'astro'}-${info.project.name}.png`, fullPage: true, animations: 'disabled' });
});

test('catalogue retains three categories, brand anchors and bounded search', async ({ page }) => {
  await page.goto('/surfactants/products');
  await expect(page.locator('.category-card')).toHaveCount(3);
  await page.getByRole('link', { name: /Anionic Surfactants/ }).last().click();
  await page.waitForURL('**/products/anionic', {waitUntil:'load'});
  await expect(page.locator('.product-panel')).toHaveCount(12);
  await page.goto('/surfactants/search?q=pAlMoSaLt');
  await expect(page.locator('.search-result')).toHaveCount(1);
  await page.locator('.search-result').click();
  await expect(page).toHaveURL(/\/products\/anionic#palmosalt$/);
  await page.locator('#palmosalt').getByRole('button', { name: 'Learn More' }).click();
  await expect(page.getByRole('dialog', { name: 'PALMOSALT' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'PALMOSALT' })).not.toBeVisible();
  await page.goto('/surfactants/search?q=A%20Century%20of%20Surfactant%20Excellence');
  await expect(page.getByRole('heading', { name: 'No matching products' })).toBeVisible();
  const missing = await page.goto('/surfactants/products/unknown');
  expect(missing?.status()).toBe(404);
});

test('hero, news filter, FAQ and navigation retain interactive behaviour', async ({ page }, info) => {
  await page.goto('/surfactants');
  if (info.project.name === 'mobile') await page.getByRole('button', { name: 'Show slide 2 of 5: SUSTAINABILITY IN ACTION', exact: true }).click();
  else await page.getByRole('button', { name: 'Next hero slide', exact: true }).click();
  await expect(page.locator('.hero-slide.is-active h1')).toHaveText('SUSTAINABILITY IN ACTION');
  await page.getByRole('button', { name: 'Show slide 4 of 5: OUR MARKETS', exact: true }).click();
  await expect(page.locator('.hero-slider')).toHaveClass(/is-light/);
  await page.locator('.faq-list details').nth(1).locator('summary').click();
  await expect(page.locator('.faq-list details').nth(1)).toHaveAttribute('open', '');
  const mobileNavigation = page.getByRole('button', { name: 'Open navigation' });
  if (await mobileNavigation.isVisible()) await mobileNavigation.click();
  await page.getByRole('button', { name: 'Show product categories' }).click();
  await expect(page.locator('#product-submenu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#product-submenu')).not.toBeVisible();
  await page.goto('/surfactants/news-media');
  await page.locator('.news-filter select').selectOption('Corporate');
  await expect(page.locator('.news-card')).toHaveCount(1);
});

test('contact review preserves validation, prefilled product and editing', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/surfactants/contact?product=PALMOSALT');
  await expect(page.getByLabel('Message', { exact: false })).toHaveValue(/PALMOSALT/);
  await page.getByLabel('First Name').fill('Ada');
  await page.getByLabel('Last Name').fill('Example');
  await page.getByLabel('Company Name').fill('Example Labs');
  await page.getByLabel('Country').selectOption({ label: 'Malaysia' });
  await page.getByLabel('Email', { exact: false }).fill('ada@example.com');
  await page.locator('input[name=consent]').check();
  await page.getByRole('button', { name: 'Review enquiry' }).click();
  await expect(page.getByRole('heading', { name: 'Review your enquiry' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit enquiry' }).click();
  await expect(page.getByLabel('First Name')).toHaveValue('Ada');
  expect(errors).toEqual([]);
});
