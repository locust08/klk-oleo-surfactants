import {FiArrowUpRight,FiArrowRight} from 'react-icons/fi';
import type {CSSProperties} from 'react';
import {markets} from '@/lib/content';
import {marketVisuals} from '@/lib/market-content';
export function MarketCards({archive=false}:{archive?:boolean}){return <div className="market-grid">{markets.map(m=><article id={m.slug} key={m.slug} className={`market-card market-${m.colour}`} style={{'--market-rgb':marketVisuals[m.slug].rgb} as CSSProperties}><span className="market-marker" aria-hidden="true"/><h3>{m.name}</h3><p>{m.copy}</p><a className={`text-link ${archive?'market-full-link':''}`} href={m.url} aria-label={`Explore ${m.name}`}>Explore market<FiArrowUpRight aria-hidden="true"/></a></article>)}</div>;}
export function MarketsLink(){return <a className="text-link" href="/surfactants/our-markets">View all markets<FiArrowRight aria-hidden="true"/></a>;}
