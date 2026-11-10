import { definePlugin, type PluginContext } from 'emdash';
import { pluginResponse } from 'emdash/plugin';
import { acceptEnquiry, notificationPreview, type Lead, type EnquirySettings } from './intake';

async function publishedSettings(ctx: PluginContext): Promise<EnquirySettings | null> {
  if (!ctx.content) return null;
  const settings = await ctx.content.list('site_content', { where: { status: 'published' }, limit: 10 });
  const site = settings.items.find(item => item.slug === 'site');
  if (!site) return null;
  const revision = site.liveRevisionId && ctx.content.getRevision ? await ctx.content.getRevision('site_content', site.id, site.liveRevisionId) : null;
  const data = revision?.data || site.data;
  if (typeof data.consent_label !== 'string' || !data.consent_label) return null;
  const products = await ctx.content.list('brands', { where: { status: 'published' }, limit: 100 });
  return { consentText: data.consent_label, version: site.liveRevisionId || site.updatedAt, products: products.items.map(item => ({ id: item.id, slug: item.slug || '', title: String(item.data.title) })) };
}

export function createPlugin() {
  return definePlugin({
    id: 'surfactants-enquiries', version: '0.1.0', capabilities: ['content:read', 'content:revisions:read'],
    storage: { enquiries: { indexes: ['createdAt', 'status'] }, rates: { indexes: ['resetAt'] } },
    routes: {
      submit: {
        public: true, methods: ['POST'], request: { body: 'json', maxBytes: 20_000, headers: ['origin'] }, response: 'raw',
        handler: async ctx => {
          try {
            const result = await acceptEnquiry(ctx.input, ctx.request, { leads: ctx.storage.enquiries, rates: ctx.storage.rates, settings: await publishedSettings(ctx), expectedOrigin: new URL(ctx.site.url).origin, ip: ctx.requestMeta.ip || 'unknown' });
            return pluginResponse({ status: result.status, headers: { 'Content-Type': 'application/json' }, body: { kind: 'text', value: JSON.stringify(result.body) } });
          } catch { return pluginResponse({ status: 503, headers: { 'Content-Type': 'application/json' }, body: { kind: 'text', value: JSON.stringify({ error: 'Enquiries are temporarily unavailable.' }) } }); }
        },
      },
      receipt: {
        public: true, methods: ['GET'], request: { body: 'none' },
        handler: async ctx => {
          const id = new URL(ctx.request.url).searchParams.get('id') || '';
          if (!/^[0-9a-f-]{36}$/i.test(id)) return { received: false };
          return { received: Boolean(await ctx.storage.enquiries.get(id)) };
        },
      },
      list: {
        methods: ['GET'], permission: 'plugins:manage', request: { body: 'none' },
        handler: async ctx => {
          const cursor = new URL(ctx.request.url).searchParams.get('cursor') || undefined;
          const result = await ctx.storage.enquiries.query({ orderBy: { createdAt: 'desc' }, limit: 50, cursor });
          return { ...result, items: result.items.map(item => ({ id: item.id, data: { ...item.data as Lead, notificationPreview: notificationPreview(item.data as Lead) } })) };
        },
      },
    },
    admin: { entry: 'klk-oleo-surfactants/enquiries-admin', pages: [{ path: '/inbox', label: 'Enquiries', icon: 'envelope' }] },
  });
}
