import {test} from 'node:test';
import assert from 'node:assert/strict';
import {marketVisuals,marketPillars} from '../src/lib/market-content.ts';

test('market overlays retain the five supplied document colours',()=>{
 assert.deepEqual(Object.fromEntries(Object.entries(marketVisuals).map(([key,value])=>[key,value.rgb])),{
  'beauty-personal-care':'225, 18, 130','home-care':'0, 134, 149',agrochemicals:'18, 80, 26',lubricants:'128, 128, 128','textile-leather':'112, 48, 160',
 });
 assert.deepEqual(marketPillars.map(pillar=>pillar.title),['Performance','Compliance','Sustainability','Technical support']);
});
