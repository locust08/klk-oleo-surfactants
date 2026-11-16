import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brandRedirect, articleRedirect } from '../src/cms/legacy-routes.ts';
import { articleSections } from '../src/cms/article-body.ts';
import { normalizeNewsCategory, newsCategories } from '../src/cms/news-categories.ts';
import { validateStructuredContent } from '../src/cms/content-policy.ts';
import { productPath, type Product } from '../src/lib/product-catalog.ts';
import { faqs } from '../src/lib/faqs.ts';
import { buildSeed } from '../src/cms/seed.ts';

const products: Product[] = [{ brand: 'TENSARYLY', slug: 'tensaryly', category: 'anionic' }, { brand: 'SERVAMINE', slug: 'servamine', category: 'cationic' }];

test('live Next.js brand and article URLs resolve to the EmDash routes', () => {
  assert.equal(productPath(products[0]), '/surfactants/products/anionic/tensaryly');
  assert.equal(brandRedirect(products, 'anionic', 'tensaryl'), '/surfactants/products/anionic/tensaryly');
  assert.equal(brandRedirect(products, 'anionic', 'servamine'), '/surfactants/products/cationic/servamine');
  assert.equal(brandRedirect(products, 'anionic', 'tensaryly'), undefined);
  assert.equal(brandRedirect(products, 'anionic', 'unknown'), undefined);
  assert.equal(articleRedirect('a-century-of-surfactant-excellence'), '/surfactants/news-media/century');
  assert.equal(articleRedirect('sustainability-in-action'), '/surfactants/news-media/sustainability');
  assert.equal(articleRedirect('century'), undefined);
});

test('news categories follow the supplied names and legacy entries keep displaying', () => {
  assert.deepEqual([...newsCategories], ['Corporate', 'Exhibition', 'Products', 'Articles']);
  assert.equal(normalizeNewsCategory('Sustainability'), 'Articles');
  assert.equal(normalizeNewsCategory('Product'), 'Products');
  assert.equal(normalizeNewsCategory('Exhibition'), 'Exhibition');
  assert.doesNotThrow(() => validateStructuredContent('news', { category: 'Articles', markets: ['Agrochemicals'] }));
  assert.throws(() => validateStructuredContent('news', { markets: ['Unknown market'] }), /unsupported/);
  assert.throws(() => validateStructuredContent('news', { category: 'Sustainability' }), /unsupported/);
});

test('article index sections start at each level-two heading', () => {
  const block = (style: string, text: string) => ({ _type: 'block', style, children: [{ text }] });
  const sections = articleSections([block('normal', 'Lead'), block('h2', 'First'), block('normal', 'A'), block('h3', 'Sub'), block('h2', 'Second')]);
  assert.deepEqual(sections.map(section => [section.id, section.heading, section.blocks.length]), [['section-0', undefined, 1], ['section-1', 'First', 3], ['section-4', 'Second', 1]]);
});

test('supplied homepage FAQs import as eight multi-paragraph answers within field limits', () => {
  const entries = buildSeed().content!.faqs;
  assert.equal(entries.length, faqs.length);
  assert.equal(entries.length, 8);
  for (const entry of entries) assert.ok(String(entry.data.answer).length < 5000 && String(entry.data.answer).includes('\n\n'));
});
