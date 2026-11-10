import { z } from 'zod';
import countries from '../lib/countries.json';

export interface DurableStore {
  get(id: string): Promise<unknown>;
  getVersioned(id: string): Promise<{ value: unknown; revision: string } | null>;
  compareAndSet(id: string, revision: string | null, value: unknown): Promise<{ applied: boolean }>;
}
export type EnquirySettings = { consentText: string; version: string; products: { id: string; slug: string; title: string }[] };
export type Lead = {
  firstName: string; lastName: string; company: string; jobPosition?: string; country: string; email: string; companyWebsite?: string; message: string;
  id: string; fingerprint: string; createdAt: string; consentText: string; consentVersion: string; consentAt: string;
  product?: { id: string; slug: string; title: string }; status: 'manual-review'; notificationStatus: 'not-configured';
};
type Services = { leads: DurableStore; rates: DurableStore; settings: EnquirySettings | null; expectedOrigin: string; ip: string };
const schema = z.object({
  firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80), company: z.string().trim().min(1).max(160),
  jobPosition: z.string().trim().max(120).optional(), country: z.string().refine(value => countries.includes(value)), email: z.email().max(254),
  companyWebsite: z.union([z.literal(''), z.url().refine(value => ['https:', 'http:'].includes(new URL(value).protocol))]).optional(),
  message: z.string().trim().min(10).max(5000), consent: z.literal(true), consentText: z.string().min(1).max(5000), idempotencyKey: z.uuid(),
  productSlug: z.string().max(120).optional(), website: z.string().max(200).optional(),
});
const error = (status: number, message: string) => ({ status, body: { error: message } });
async function digest(value: string) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(byte => byte.toString(16).padStart(2, '0')).join(''); }

async function consumeRate(store: DurableStore, key: string, now: number): Promise<boolean> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const previous = await store.getVersioned(key);
    const value = previous?.value as { count: number; resetAt: number } | undefined;
    const active = value && value.resetAt > now;
    const count = active ? value.count : 0;
    if (count >= 10) return false;
    const result = await store.compareAndSet(key, previous?.revision || null, { count: count + 1, resetAt: active ? value.resetAt : now + 600_000 });
    if (result.applied) return true;
  }
  return false;
}

/** Persist a validated lead atomically; a receipt never implies email delivery. */
export async function acceptEnquiry(input: unknown, request: Request, services: Services) {
  if (request.headers.get('origin') !== services.expectedOrigin) return error(403, 'Please submit this enquiry from our website.');
  const parsed = schema.safeParse(input);
  if (!parsed.success) return error(400, 'Please check the required enquiry fields.');
  const values = parsed.data;
  if (values.website) return error(400, 'Please check the required enquiry fields.');
  if (!services.settings?.consentText) return error(503, 'Enquiries are temporarily unavailable. Please try again later.');
  if (values.consentText !== services.settings.consentText) return error(409, 'The consent wording has changed. Please reload the form and review it.');
  const product = values.productSlug ? services.settings.products.find(item => item.slug === values.productSlug) : undefined;
  if (values.productSlug && !product) return error(400, 'Please select a currently available product.');
  try {
    const idempotencyKey=values.idempotencyKey;
    const details={firstName:values.firstName,lastName:values.lastName,company:values.company,jobPosition:values.jobPosition,country:values.country,email:values.email,companyWebsite:values.companyWebsite,message:values.message,consentText:values.consentText};
    const fingerprint = await digest(JSON.stringify({ ...details, product: product?.id }));
    const previous = await services.leads.get(idempotencyKey) as Lead | null;
    if (previous) return previous.fingerprint === fingerprint ? { status: 202, body: { received: true, receipt: previous.id } } : error(409, 'Please prepare a new enquiry for these changed details.');
    const now = Date.now();
    if (!await consumeRate(services.rates, await digest(`${services.expectedOrigin}:${services.ip}`), now)) return error(429, 'Too many enquiries. Please try again later.');
    const createdAt = new Date(now).toISOString();
    const lead: Lead = { ...details, id: idempotencyKey, fingerprint, createdAt, consentAt: createdAt, consentVersion: services.settings.version, product, status: 'manual-review', notificationStatus: 'not-configured' };
    const created = await services.leads.compareAndSet(idempotencyKey, null, lead);
    if (!created.applied) {
      const concurrent = await services.leads.get(idempotencyKey) as Lead | null;
      if (concurrent?.fingerprint !== fingerprint) return error(409, 'Please prepare a new enquiry for these changed details.');
    }
    return { status: 202, body: { received: true, receipt: idempotencyKey } };
  } catch { return error(503, 'Your enquiry could not be saved. Please try again.'); }
}

/** Plain text notification preview for agency review; no transport is configured. */
export function notificationPreview(lead: Lead) {
  return { subject: `Surfactants enquiry${lead.product ? ` — ${lead.product.title}` : ''}`, text: `${lead.firstName} ${lead.lastName}\n${lead.company}\n${lead.email}\n${lead.country}\n\n${lead.message}` };
}
