import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

class Store<T> {
  rows = new Map<string, { value: T; revision: string }>();
  async get(id: string) { return this.rows.get(id)?.value || null; }
  async getVersioned(id: string) { return this.rows.get(id) || null; }
  async compareAndSet(id: string, revision: string | null, value: T) {
    if ((this.rows.get(id)?.revision || null) !== revision) return { applied: false as const };
    const version = randomUUID(); this.rows.set(id, { value, revision: version }); return { applied: true as const, revision: version };
  }
}
const valid = () => ({ firstName: 'Ada', lastName: 'Example', company: 'Example Labs', country: 'Malaysia', email: 'ada@example.test', message: 'Please advise on PALMOSALT availability.', consent: true, consentText: 'Approved consent.', idempotencyKey: randomUUID() });
const request = (origin = 'http://localhost:4372') => new Request('http://localhost:4372/_emdash/api/plugins/surfactants-enquiries/submit', { method: 'POST', headers: { origin } });

test('enquiry validation and same-origin checks protect durable intake', async () => {
  const module = await import('../src/enquiries/intake.ts').catch(() => null);
  assert.ok(module, 'Durable enquiry intake must exist');
  const leads = new Store(); const rates = new Store();
  const settings = { consentText: 'Approved consent.', version: 'v1', products: [] };
  const services = { leads, rates, settings, expectedOrigin: 'http://localhost:4372', ip: '127.0.0.1' };
  assert.equal((await module.acceptEnquiry(valid(), request('https://outside.example'), services)).status, 403);
  assert.equal((await module.acceptEnquiry({ ...valid(), firstName: '   ' }, request(), services)).status, 400);
  assert.equal((await module.acceptEnquiry({ ...valid(), consent: false }, request(), services)).status, 400);
  assert.equal((await module.acceptEnquiry({ ...valid(), website: 'bot-filled' }, request(), services)).status, 400);
  assert.equal((await module.acceptEnquiry({ ...valid(), consentText: 'Old wording' }, request(), services)).status, 409);
  assert.equal(leads.rows.size, 0);
});

test('concurrent retries create one lead and a changed payload cannot reuse its receipt', async () => {
  const module = await import('../src/enquiries/intake.ts').catch(() => null); assert.ok(module);
  const leads = new Store(); const rates = new Store();
  const services = { leads, rates, settings: { consentText: 'Approved consent.', version: 'v1', products: [] }, expectedOrigin: 'http://localhost:4372', ip: '127.0.0.1' };
  const input = valid();
  const results = await Promise.all([module.acceptEnquiry(input, request(), services), module.acceptEnquiry(input, request(), services)]);
  assert.ok(results.every(result => result.status === 202));
  assert.equal(leads.rows.size, 1);
  assert.equal((await module.acceptEnquiry({ ...input, message: 'A different enquiry body.' }, request(), services)).status, 409);
  assert.equal(JSON.stringify(results).includes('ada@example.test'), false);
});

test('rate limits persist across requests and storage failures never return success', async () => {
  const module = await import('../src/enquiries/intake.ts').catch(() => null); assert.ok(module);
  const leads = new Store(); const rates = new Store();
  const services = { leads, rates, settings: { consentText: 'Approved consent.', version: 'v1', products: [] }, expectedOrigin: 'http://localhost:4372', ip: '127.0.0.1' };
  for (let index = 0; index < 10; index++) assert.equal((await module.acceptEnquiry(valid(), request(), services)).status, 202);
  assert.equal((await module.acceptEnquiry(valid(), request(), services)).status, 429);
  assert.equal(leads.rows.size, 10);
  const brokenStore = new Store();brokenStore.get = async () => { throw new Error('database unavailable'); };
  const broken = { ...services, ip: 'another-address', leads: brokenStore };
  assert.equal((await module.acceptEnquiry(valid(), request(), broken)).status, 503);
});
