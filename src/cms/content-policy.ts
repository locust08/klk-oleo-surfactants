/** Public links and media may use explicit web URLs, local paths or anchors. */
export function safeDestination(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value || /[\u0000-\u0020\\]/.test(value)) return undefined;
  if (value.startsWith('#')) return value;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? value : undefined; }
  catch { return undefined; }
}

export function validateDestinations(value: unknown): void {
  if (Array.isArray(value)) { value.forEach(validateDestinations); return; }
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    if ((key === 'url' || key === 'src' || key.endsWith('_url') || key.endsWith('_linkedin') || key.endsWith('Linkedin')) && item && !safeDestination(item)) throw new Error('Use a site-relative path, anchor, or explicit HTTP(S) URL.');
    validateDestinations(item);
  }
  const record = value as Record<string, unknown>;
  if (['anchor', 'external'].includes(String(record.kind)) && !safeDestination(record.target)) throw new Error('A link destination must be a safe path, anchor or HTTP(S) URL.');
}
import type { SeedField } from 'emdash/seed';
import { buildSeed } from './seed';

const fieldsByCollection = new Map(buildSeed().collections?.map(collection => [collection.slug, collection.fields]));

function validateFields(data: Record<string, unknown>, fields: SeedField[], path = '') {
  for (const field of fields) {
    const rules = field.validation as {maxLength?:number; options?:string[]; allowedMimeTypes?:string[]; minItems?:number; maxItems?:number; subFields?:SeedField[]} | undefined;
    const value = data[field.slug];
    if (value == null) continue;
    const label = `${path}${field.slug}`;
    if (typeof value === 'string' && rules?.maxLength && value.length > rules.maxLength) throw new Error(`${label} is too long.`);
    if (field.type === 'select' && rules?.options && !rules.options.includes(String(value))) throw new Error(`${label} has an unsupported choice.`);
    if (field.type === 'image' || field.type === 'file') {
      const mime = (value as {mimeType?:string}).mimeType;
      if (!mime || (rules?.allowedMimeTypes && !rules.allowedMimeTypes.includes(mime))) throw new Error(`${label} requires an approved ${field.type === 'image' ? 'image' : 'file'} type.`);
    }
    if (field.type === 'repeater') {
      if (!Array.isArray(value) || value.length < (rules?.minItems || 0) || value.length > (rules?.maxItems || 50)) throw new Error(`${label} has an invalid number of rows.`);
      value.forEach((row, index) => validateFields(row, rules?.subFields || [], `${label}.${index}.`));
    }
  }
}

/** Native repeaters omit some nested validation; enforce the approved structure on every write. */
export function validateStructuredContent(collection: string, data: Record<string, unknown>, options: {isNew?: boolean; current?: Record<string, unknown>} = {}) {
  validateFields(data, fieldsByCollection.get(collection) || []);
  if (options.isNew && ['home','site_content','pages'].includes(collection)) throw new Error('Edit the imported fixed entry. Additional Home, Site content and Pages entries are not supported.');
  const expected = collection === 'home' ? 'home' : collection === 'site_content' ? 'site' : undefined;
  if (expected && data.identity !== undefined && data.identity !== expected) throw new Error('This entry has a fixed identity.');
  for (const field of ['source_key', ...(collection === 'pages' ? ['route'] : [])]) {
    if (data[field] !== undefined && options.current && data[field] !== options.current[field]) throw new Error(`${field} is managed by the agency and cannot be changed.`);
  }
  if (options.isNew && data.source_key) throw new Error('Import source keys are reserved for the agency importer.');
  validateDestinations(data);
}
