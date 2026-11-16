import materials from './drive-materials.json' with { type: 'json' };
import { helpItems, markets, faqs, articles, brandFilmUrl } from '../lib/content';
import { marketIntroduction } from '../lib/market-content';
import type { MaterialPatch } from './material-import';
import { normalizeNewsCategory } from './news-categories';

/** Second source version: content that went live on the earlier Next.js site after the Drive import. */
export const siteUpdateVersion = 'live-site-2026-11-16-v1';

export function buildSiteUpdatePatches(): MaterialPatch[] {
  const key = (slug: string) => `${siteUpdateVersion}:${slug}`;
  return [
    ...faqs.map(([title, answer], order) => ({ collection: 'faqs', slug: `faq-${order + 1}`, key: key(`faq-${order + 1}`), publish: true, create: true, data: { title, answer: answer.join('\n\n'), order, source_key: `source:faq-${order + 1}` } })),
    ...markets.map((market, order) => ({ collection: 'markets', slug: market.slug, key: key(`market-${market.slug}`), publish: true, data: { title: market.name, url: market.url, order } })),
    ...articles.map(article => ({ collection: 'news', slug: article.slug, key: key(`news-${article.slug}`), publish: article.slug === 'century', data: (current: Record<string, unknown>) => ({
      category: article.category, markets: Array.isArray(current.markets) ? current.markets : [],
      image: current.image || { provider: 'external', id: `/images/hero/${article.image}`, src: `/images/hero/${article.image}`, mimeType: 'image/jpeg', alt: article.alt },
    }) })),
    { collection: 'brands', slug: 'tensaryl', rename: 'tensaryly', key: key('brand-tensaryly'), publish: true, data: { title: 'TENSARYLY' } },
    { collection: 'pages', slug: 'our-markets', key: key('our-markets'), publish: true, data: { heading: 'KLK OLEO Surfactants for Key Industries', introduction: marketIntroduction } },
    { collection: 'home', slug: 'home', key: key('home'), publish: true, data: current => ({ video_url: current.video_url || brandFilmUrl }) },
  ];
}

export function buildMaterialPatches(): MaterialPatch[] {
  return [
    // Entries imported before the category rename are saved under the supplied category names.
    ...materials.articles.map(article => ({ ...article, collection: 'news', key: `${materials.version}:${article.slug}`, data: (current: Record<string, unknown>) => ({ ...article.data, category: normalizeNewsCategory(current.category) }) })),
    { collection: 'pages', slug: 'news-media', key: `${materials.version}:news-media`, publish: true, data: materials.newsPage },
    { collection: 'home', slug: 'home', key: `${materials.version}:home`, publish: true, data: current => {
      if (!Array.isArray(current.help_items)) throw new Error('Home help cards require editorial review before importing icons.');
      return {
        award_image: current.award_image || materials.award,
        help_items: current.help_items.map((item: Record<string, unknown>) => {
          const index = helpItems.findIndex(([title]) => title === item.title);
          if (index === -1) throw new Error('A renamed help card requires editorial icon mapping.');
          return { ...item, image: item.image || materials.helpImages[index] };
        }),
      };
    } },
  ];
}
