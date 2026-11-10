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
