import { useSiteData } from '@/components/site-context';
import type { CSSProperties } from 'react';
import { FiArrowUpRight,FiArrowRight } from 'react-icons/fi';
import { InfoButton } from './info-button';
import { marketRgb } from '@/lib/market-content';
export function MarketCards({archive=false}:{archive?:boolean}){const {markets}=useSiteData();return <div className="market-grid">{markets.map(m=><article id={m.slug} key={m.slug} className={`market-card market-${m.colour}`} style={{'--market-rgb':marketRgb(m.slug,m.colour)} as CSSProperties}><span className="market-marker" aria-hidden="true"/><h3>{m.name}</h3><p>{m.copy}</p>{m.url?<a className={`text-link ${archive?'market-full-link':''}`} href={m.url} aria-label={`Explore ${m.name}`}>Explore market<FiArrowUpRight aria-hidden="true"/></a>:<InfoButton title={m.name} label="Explore market" description={`${m.copy} Our team can help you identify a solution for your application.`}/>}</article>)}</div>;}
export function MarketsLink(){return <a className="text-link" href="/surfactants/our-markets">View all markets<FiArrowRight aria-hidden="true"/></a>;}
