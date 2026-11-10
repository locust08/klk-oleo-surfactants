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

test('CMS destination policy validates snake-case social fields', async () => {
  const { validateDestinations } = await import('../src/cms/content-policy.ts');
  assert.throws(() => validateDestinations({ header_linkedin: 'javascript:alert(1)' }));
  assert.throws(() => validateDestinations({ footer_linkedin: '//outside.example' }));
  assert.doesNotThrow(() => validateDestinations({ header_linkedin: 'https://www.linkedin.com/company/klkberhad/' }));
});
