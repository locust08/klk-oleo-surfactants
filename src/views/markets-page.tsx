import { useSiteData } from '@/components/site-context';
import { Breadcrumbs } from '@/components/page-heading';
import { MarketCards } from '@/components/market-cards';
export function MarketsPage(){const page=useSiteData().pages['our-markets'];return <><Breadcrumbs items={[{label:'Our Markets'}]}/><section className="section markets-archive"><div className="container"><span className="eyebrow">Our Markets</span><h1>{page?.heading||'Our Markets'}</h1><p className="wide-copy">{page?.introduction}</p><MarketCards/></div></section></>;}
