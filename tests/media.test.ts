import { test } from 'node:test';
import assert from 'node:assert/strict';

test('CMS media resolves normalized local uploads, bare IDs and source assets safely', async () => {
  const module = await import('../src/cms/media.ts').catch(() => null);
  assert.ok(module, 'Native CMS media resolver must exist');
  assert.equal(module.resolveCmsMedia({ provider: 'local', id: 'ABC', meta: { storageKey: 'ABC.png' } }), '/_emdash/api/media/file/ABC.png');
  assert.equal(module.resolveCmsMedia({ provider: 'local', id: 'ABC' }), '/_emdash/api/media/file/ABC');
  assert.equal(module.resolveCmsMedia({ provider: 'local', id: 'ABC', meta: { storageKey: 'ABC.png' } }, key => `https://media.example/${key}`), 'https://media.example/ABC.png');
  assert.equal(module.resolveCmsMedia({ provider: 'external', id: '/images/source.jpg', src: '/images/source.jpg' }), '/images/source.jpg');
  assert.equal(module.resolveCmsMedia({ provider: 'external', id: '', src: 'javascript:alert(1)' }), undefined);
  assert.equal(module.resolveCmsMedia({ provider: 'local', id: '../outside' }), undefined);
});
