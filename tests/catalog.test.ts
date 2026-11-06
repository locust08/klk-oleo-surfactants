import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchProducts, categories, products } from '../src/lib/catalog.ts';

test('search matches a brand regardless of case and surrounding whitespace',()=>{
  assert.deepEqual(searchProducts('  pAlMoSaLt ').map(p=>p.brand),['PALMOSALT']);
});
test('search discovers products by descriptor and category',()=>{
  assert.ok(searchProducts('soap noodles').some(p=>p.brand==='PALMOSALT'));
  assert.ok(searchProducts('cationic').every(p=>p.category==='cationic'));
  assert.equal(searchProducts('cationic').length,1);
});
test('empty search is not an unbounded result list and news is excluded',()=>{
  assert.deepEqual(searchProducts('   '),[]);
  assert.deepEqual(searchProducts('A Century of Surfactant Excellence'),[]);
  assert.deepEqual(searchProducts('<script>alert(1)</script>'),[]);
});
test('catalogue supports the required navigation without losing source brands',()=>{
  assert.deepEqual(categories.map(c=>c.slug),['anionic','cationic','nonionic']);
  assert.ok(products.some(p=>p.brand==='SYMPARE'));
  assert.equal(new Set(products.map(p=>p.slug)).size,products.length);
});
