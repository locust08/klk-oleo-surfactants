import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterNews, type NewsMarket } from '../src/lib/news-filters.ts';

const items = [
  { id: 'beauty-product', category: 'Products', markets: ['Beauty & Personal Care'] as NewsMarket[] },
  { id: 'agro-product', category: 'Products', markets: ['Agrochemicals'] as NewsMarket[] },
  { id: 'agro-article', category: 'Articles', markets: ['Agrochemicals'] as NewsMarket[] },
  { id: 'unassigned', category: 'Corporate', markets: [] as NewsMarket[] },
];

test('news category and market filters combine rather than replace one another', () => {
  assert.deepEqual(filterNews(items, 'Products', 'Agrochemicals').map(item => item.id), ['agro-product']);
  assert.deepEqual(filterNews(items, 'All', 'Agrochemicals').map(item => item.id), ['agro-product', 'agro-article']);
});

test('all filters include unassigned stories, while specific markets require a tag', () => {
  assert.equal(filterNews(items, 'All', 'All').length, 4);
  assert.deepEqual(filterNews(items, 'Corporate', 'Agrochemicals'), []);
  assert.deepEqual(filterNews(items, 'Corporate', 'All').map(item => item.id), ['unassigned']);
});
