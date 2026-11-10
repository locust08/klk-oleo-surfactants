import type { SiteData } from '../cms/types';
import { SiteProvider } from './site-context';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { HomePage } from './home-page';
import { ProductsPage } from '../views/products-page';
import { CategoryPage } from '../views/category-page';
import { MarketsPage } from '../views/markets-page';
import { NewsPage } from '../views/news-page';
import { SearchPage } from '../views/search-page';
import { ContactPage } from '../views/contact-page';

export function HeaderIsland({ data, pathname }: { data: SiteData; pathname: string }) { return <SiteProvider data={data}><SiteHeader pathname={pathname} /></SiteProvider>; }
export function FooterIsland({ data }: { data: SiteData }) { return <SiteProvider data={data}><SiteFooter /></SiteProvider>; }
export function PageIsland({ data, view, category = '', query = '', product }: { data: SiteData; view: string; category?: string; query?: string; product?: string }) {
  return <SiteProvider data={data}>{view === 'home' ? <HomePage /> : view === 'products' ? <ProductsPage /> : view === 'category' ? <CategoryPage category={category} /> : view === 'markets' ? <MarketsPage /> : view === 'news' ? <NewsPage /> : view === 'search' ? <SearchPage query={query} /> : <ContactPage product={product} />}</SiteProvider>;
}
