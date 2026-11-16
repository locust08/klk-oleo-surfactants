import { productPath, type Product } from '../lib/product-catalog';

/** URLs already live on the earlier Next.js site, mapped onto the EmDash slugs. */
export const brandAliases: Record<string, string> = { tensaryl: 'tensaryly' };
export const articleAliases: Record<string, string> = { 'a-century-of-surfactant-excellence': 'century', 'sustainability-in-action': 'sustainability' };

export function brandRedirect(products: Product[], category: string, slug: string) {
  const product = products.find(item => item.slug === (brandAliases[slug] || slug));
  return product && productPath(product) !== `/surfactants/products/${category}/${slug}` ? productPath(product) : undefined;
}
export const articleRedirect = (slug: string) => articleAliases[slug] ? `/surfactants/news-media/${articleAliases[slug]}` : undefined;
