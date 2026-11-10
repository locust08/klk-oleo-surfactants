import { definePlugin, ContentSaveRejectedError, type PluginContext } from 'emdash';
import { validateStructuredContent } from './content-policy';

async function withTrustedMediaTypes(value: unknown, ctx: PluginContext): Promise<unknown> {
  if (Array.isArray(value)) return Promise.all(value.map(item => withTrustedMediaTypes(item, ctx)));
  if (!value || typeof value !== 'object') return value;
  const record = value as Record<string, unknown>;
  if (record.provider === 'local' || (!record.provider && record.id && (record.meta || record.mimeType))) {
    const media = await ctx.media?.get(String(record.id));
    if (!media) throw new Error('Selected media could not be verified. Select an existing library file.');
    return { ...record, mimeType: media.mimeType };
  }
  return Object.fromEntries(await Promise.all(Object.entries(record).map(async ([key,item]) => [key,await withTrustedMediaTypes(item,ctx)])));
}

export function createPlugin() {
  return definePlugin({
    id: 'surfactants-content', version: '0.1.0',
    capabilities: ['content:read', 'content:write', 'media:read', 'hooks.content-policy:register'],
    hooks: {
      'content:beforeSave': async (event, ctx) => {
        try {
          const current = event.id ? await ctx.content?.get(event.collection, event.id) : null;
          const data = await withTrustedMediaTypes(event.content,ctx) as Record<string,unknown>;
          validateStructuredContent(event.collection, data, {isNew:event.isNew,current:current?.data});
          return data;
        }
        catch (error) { throw new ContentSaveRejectedError((error as Error).message); }
      },
      'content:beforePublish': async event => {
        const content = event.content;
        const data = content.data as Record<string, unknown>;
        const expected = event.collection === 'home' ? 'home' : event.collection === 'site_content' ? 'site' : ['pages','service_pages'].includes(event.collection) ? data.route : null;
        if (expected && content.slug !== expected) return { cancel: true, reason: 'This entry has a fixed route. Restore its original slug before publishing.' };
        try { validateStructuredContent(event.collection, data, {current:data}); }
        catch (error) { return {cancel:true,reason:(error as Error).message}; }
      },
    },
  });
}
