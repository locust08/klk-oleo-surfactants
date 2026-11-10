import { Breadcrumbs } from '@/components/page-heading';
import { MarketCards } from '@/components/market-cards';
export function MarketsPage(){return <><Breadcrumbs items={[{label:'Our Markets'}]}/><section className="section markets-archive"><div className="container"><span className="eyebrow">Our Markets</span><h1>Surfactant Solutions for Key Industries</h1><p className="wide-copy">Oleo-based and synthetic solutions for key industries where performance and reliability matter.</p><MarketCards/></div></section></>;}
