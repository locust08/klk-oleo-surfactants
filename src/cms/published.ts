import { getEmDashCollection } from 'emdash';
import type { SiteData, Home, Site, Article, Media } from './types';
import { safeDestination } from './content-policy';
import { resolveCmsMedia } from './media';

function camel(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(camel);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()), camel(item)]));
  return value;
}

/** EmDash's request context supplies authorised previews; ordinary reads stay published-only. */
export async function loadSiteContent(publicMediaUrl?: (key: string) => string) {
  const mediaSrc = (value: unknown) => resolveCmsMedia(value, publicMediaUrl);
  const names = ['home', 'brands', 'markets', 'news', 'faqs', 'pages', 'site_content'] as const;
  const results = await Promise.all(names.map(name => getEmDashCollection(name, { limit: 100 })));
  for (const result of results) if (result.error) throw result.error;
  const mapped = results.map(result => result.entries.map((entry): Record<string, unknown> => ({ ...camel(entry.data) as Record<string, unknown>, slug: String(entry.data.slug || entry.id) })));
  const [homes, brands, markets, articles, faqs, pages, sites] = mapped;
  const rawHome = homes.find(item => item.identity === 'home');
  const rawSite = sites.find(item => item.identity === 'site');
  const data: SiteData = {
    home: rawHome ? {
      ...Object.fromEntries(['title','introduction','portfolioCopy','introHeading','helpHeading','portfolioHeading','portfolioInstruction','marketsHeading','marketsCopy','partnerHeading','partnerCopy','videoHeading','qualityHeading','qualityCopy','awardTitle','awardCopy','newsHeading','newsCopy','faqHeading'].map(key => [key, String(rawHome[key] || '')])),
      stats: Array.isArray(rawHome.stats) ? rawHome.stats : [],
      videoUrl: safeDestination(rawHome.videoUrl),
      heroSlides: ((rawHome.heroSlides || []) as Record<string, unknown>[]).map(slide => ({ ...slide, image: mediaSrc(slide.image) || '', alt: (slide.image as Media)?.alt || '', position: String(slide.position || '50% 50%') })),
      capabilities: ((rawHome.capabilities || []) as Record<string, string>[]).map(item => [item.title, item.copy]),
      helpItems: ((rawHome.helpItems || []) as Record<string, unknown>[]).map(item => [String(item.title || ''), String(item.copy || ''), mediaSrc(item.image)]),
      certifications: ((rawHome.certifications || []) as { name: string }[]).map(item => item.name),
      videoPoster: mediaSrc(rawHome.videoPoster),
      awardImage: mediaSrc(rawHome.awardImage),
      awardImageAlt: (rawHome.awardImage as Media)?.alt || '',
    } as unknown as Home : null,
    site: rawSite ? { ...rawSite, ...Object.fromEntries(['sustainabilityUrl', 'headerLinkedin', 'footerLinkedin', 'careerUrl'].map(key => [key, safeDestination(rawSite[key])])) } as unknown as Site : null,
    products: brands.sort((a, b) => Number(a.order || 0) - Number(b.order || 0)).map(item => ({ brand: String(item.title), slug: String(item.slug), category: item.category as 'anionic' | 'cationic' | 'nonionic', descriptor: item.descriptor as string | undefined, summary: item.summary as string | undefined, brochure: mediaSrc(item.brochure) })),
    markets: markets.sort((a, b) => Number(a.order || 0) - Number(b.order || 0)).map(item => ({ name: String(item.title), slug: String(item.slug), copy: String(item.copy || ''), colour: String(item.colour || 'green'), url: safeDestination(item.url) })),
    articles: articles.map(item => ({ ...item, image: mediaSrc(item.image), publishedAt: item.publicationDate })) as Article[],
    faqs: faqs.sort((a, b) => Number(a.order || 0) - Number(b.order || 0)).map(item => [String(item.title), String(item.answer)]),
    pages: Object.fromEntries(pages.map(item => [String(item.route), { title: String(item.title || ''), heading: String(item.heading || ''), introduction: String(item.introduction || ''), seoTitle: String(item.seoTitle || ''), seoDescription: String(item.seoDescription || '') }])),
  };
  return { data, homeEdit: results[0].entries.find(entry => entry.id === 'home')?.edit || {}, siteEdit: results[6].entries.find(entry => entry.id === 'site')?.edit || {} };
}
