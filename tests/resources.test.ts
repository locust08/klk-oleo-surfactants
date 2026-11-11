import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resources,filterResources,resourceMarkets} from '../src/lib/resources.ts';
test('resource requests cover all five markets and three document types without file links',()=>{
 assert.equal(resources.length,15);assert.equal(new Set(resources.map(r=>r.id)).size,15);
 for(const market of resourceMarkets)assert.equal(filterResources('',market,'').length,3);
 assert.ok(resources.every(r=>!('url' in r)));
});
test('resource filters combine search, market and document type',()=>{
 assert.equal(filterResources('agro','Agrochemicals','Brochure').length,1);
 assert.equal(filterResources('agro','Textile and Leather','Brochure').length,0);
 assert.equal(filterResources('formulation','','').length,5);
});
