import { test } from 'node:test';
import assert from 'node:assert/strict';

test('CMS destinations reject executable and protocol-relative URLs', async () => {
  const policy = await import('../src/cms/content-policy.ts').catch(() => null);
  assert.ok(policy, 'CMS content policy must exist');
  for (const value of ['javascript:alert(1)', 'data:text/html,test', '//outside.example', '/\\outside.example', 'https://user:pass@example.com']) assert.equal(policy.safeDestination(value), undefined);
  assert.equal(policy.safeDestination('/surfactants#markets-we-serve'), '/surfactants#markets-we-serve');
  assert.equal(policy.safeDestination('#markets-we-serve'), '#markets-we-serve');
  assert.equal(policy.safeDestination('https://www.klkoleo.com/'), 'https://www.klkoleo.com/');
});

test('structured CMS policy enforces hero constraints and reserved entry identities', async () => {
  const module = await import('../src/cms/content-policy.ts');
  assert.equal(typeof module.validateStructuredContent, 'function');
  const hero = { title: 'Approved title', kind: 'anchor', target: '#faq', image: { id: 'test', provider: 'external', src: '/images/source.jpg', mimeType: 'image/jpeg' } };
  assert.throws(() => module.validateStructuredContent('home', { hero_slides: [{ ...hero, kind: 'unsupported' },hero,hero] }));
  assert.throws(() => module.validateStructuredContent('home', { hero_slides: [{ ...hero, title: 'x'.repeat(6000) },hero,hero] }));
  assert.throws(() => module.validateStructuredContent('home', { hero_slides: [{ ...hero, image: { ...hero.image, mimeType: 'application/pdf' } },hero,hero] }));
  assert.doesNotThrow(() => module.validateStructuredContent('home', { hero_slides: [hero,hero,hero] }));
  assert.throws(() => module.validateStructuredContent('home', { identity: 'other' }));
  assert.throws(() => module.validateStructuredContent('pages', { route: 'contact' }, { current: { route: 'products' } }));
  assert.throws(() => module.validateStructuredContent('home', { identity: 'home' }, { isNew: true }));
  assert.throws(() => module.validateStructuredContent('brands', { source_key: 'changed' }, { current: { source_key: 'brand:palmosalt' } }));
});

test('CMS destination policy validates snake-case social fields', async () => {
  const { validateDestinations } = await import('../src/cms/content-policy.ts');
  assert.throws(() => validateDestinations({ header_linkedin: 'javascript:alert(1)' }));
  assert.throws(() => validateDestinations({ footer_linkedin: '//outside.example' }));
  assert.doesNotThrow(() => validateDestinations({ header_linkedin: 'https://www.linkedin.com/company/klkberhad/' }));
});
