import { safeDestination } from './content-policy';

/** Local values deliberately lose src on save; use EmDash's request-local storage resolver. */
export function resolveCmsMedia(value: unknown, publicUrl?: (key: string) => string): string | undefined {
  if (typeof value === 'string') return safeDestination(value);
  if (!value || typeof value !== 'object') return undefined;
  const media = value as { provider?: string; id?: string; src?: string; url?: string; meta?: { storageKey?: string } };
  if (media.provider === 'local' || (!media.provider && !media.src && !media.url)) {
    const key = media.meta?.storageKey || media.id;
    if (!key || !/^[a-zA-Z0-9._-]+$/.test(key) || key === '.' || key === '..') return undefined;
    return safeDestination(publicUrl ? publicUrl(key) : `/_emdash/api/media/file/${encodeURIComponent(key)}`);
  }
  return safeDestination(media.src || media.url);
}
