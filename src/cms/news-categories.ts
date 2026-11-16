import { newsMarketOptions } from '../lib/news-filters';
export const newsCategories = ['Corporate', 'Exhibition', 'Products', 'Articles'] as const;
export type NewsCategory = typeof newsCategories[number];
export const newsMarkets = newsMarketOptions;
/** Entries saved before the category rename keep displaying under the supplied names. */
const legacy: Record<string, NewsCategory> = { Product: 'Products', Sustainability: 'Articles' };
export const normalizeNewsCategory = (value: unknown): NewsCategory => (newsCategories as readonly string[]).includes(String(value)) ? value as NewsCategory : legacy[String(value)] || 'Corporate';
