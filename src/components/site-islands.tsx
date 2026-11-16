import type { SiteData } from '../cms/types';
import { SiteProvider } from './site-context';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { HomePage } from './home-page';
import { ProductsPage } from '../views/products-page';
import { CategoryPage } from '../views/category-page';
import { BrandPage } from '../views/brand-page';
import { MarketsPage } from '../views/markets-page';
import { NewsPage } from '../views/news-page';
import { DownloadsPage } from '../views/downloads-page';
import { SearchPage } from '../views/search-page';
import { ContactPage } from '../views/contact-page';

export function HeaderIsland({ data, pathname }: { data: SiteData; pathname: string }) { return <SiteProvider data={data}><SiteHeader pathname={pathname} /></SiteProvider>; }
export function FooterIsland({ data }: { data: SiteData }) { return <SiteProvider data={data}><SiteFooter /></SiteProvider>; }
export function PageIsland({ data, view, category = '', brand = '', query = '', product }: { data: SiteData; view: string; category?: string; brand?: string; query?: string; product?: string }) {
  const views: Record<string, () => React.ReactNode> = {
    home: () => <HomePage />, products: () => <ProductsPage />, category: () => <CategoryPage category={category} />, brand: () => <BrandPage brand={brand} />,
    markets: () => <MarketsPage />, news: () => <NewsPage />, downloads: () => <DownloadsPage />, search: () => <SearchPage query={query} />,
  };
  return <SiteProvider data={data}>{(views[view] || (() => <ContactPage product={product} />))()}</SiteProvider>;
}
