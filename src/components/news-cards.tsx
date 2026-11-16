import { useSiteData } from '@/components/site-context';
import { useHydrated } from '@/lib/use-hydrated';
import { useState } from 'react';
import { FiArrowRight,FiCalendar,FiPackage,FiUsers,FiFeather } from 'react-icons/fi';
import { newsCategories,newsMarkets,type NewsCategory } from '@/cms/news-categories';
import { filterNews,type NewsMarket } from '@/lib/news-filters';
import type { Article } from '@/cms/types';
import { SiteImage as Image } from './site-image';
import { InfoButton } from './info-button';
type Item = Pick<Article,'slug'|'title'|'category'|'summary'|'markets'|'image'|'imageAlt'|'publishedAt'> & { pending: boolean; readable: boolean };
const itemsFor=(articles:Article[]):Item[]=>[
 {slug:'exhibition-pending',title:'Meet us at upcoming exhibitions',category:'Exhibition' as NewsCategory,summary:'Exhibition announcements will be added here.',pending:true,readable:false,markets:[] as NewsMarket[]},
 {slug:'product-pending',title:'Discover our latest product updates',category:'Products' as NewsCategory,summary:'Product updates will be added here.',pending:true,readable:false,markets:[] as NewsMarket[]},
 ...articles.map(a=>({...a,pending:false,readable:!!(a.body?.length&&a.publishedAt)})),
];
const icons={Exhibition:FiCalendar,Products:FiPackage,Corporate:FiUsers,Articles:FiFeather};
const formatDate=(value:string)=>new Date(value).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'});
const path=(slug:string)=>`/surfactants/news-media/${slug}`;
function ReadMore({item}:{item:Item}){return item.readable?<a className="text-link" href={path(item.slug)}>Read More<FiArrowRight aria-hidden="true"/></a>:<InfoButton title={item.title} description={item.pending?'This section will be updated when the source content is confirmed.':`${item.summary} Full article publication is awaiting editorial review.`} label={item.pending?'More information':'Read More'}/>;}
export function NewsCards({archive=false}:{archive?:boolean}){const hydrated=useHydrated();const {articles}=useSiteData();const items=itemsFor(articles);const[filter,setFilter]=useState('All');const[market,setMarket]=useState('All');const visible=filterNews(items,filter,market);const reset=()=>{setFilter('All');setMarket('All');};const featured=items.filter(item=>item.readable);return <>
 {archive&&featured.length>0&&<div className="news-featured" aria-label="Featured news">{featured.map(a=><article className="news-feature" key={a.slug}><a href={path(a.slug)} className="news-feature-image" aria-label={a.title}>{a.image&&<Image src={a.image} alt={a.imageAlt||''} fill sizes="(max-width:700px) 100vw, 260px"/>}</a><div className="news-feature-copy"><p className="news-meta">{a.category}{a.publishedAt&&<> <span aria-hidden="true">•</span> <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time></>}</p><h3><a href={path(a.slug)}>{a.title}</a></h3><p>{a.summary}</p><a href={path(a.slug)} className="text-link">Read More<FiArrowRight aria-hidden="true"/></a></div></article>)}</div>}
 {archive&&<div className="news-filter news-filter-panel"><div className="news-filter-fields"><div className="news-filter-field"><label htmlFor="news-category">News category</label><select disabled={!hydrated} id="news-category" value={filter} onChange={e=>setFilter(e.target.value)} aria-controls="news-results"><option value="All">All categories</option>{newsCategories.map(c=><option key={c}>{c}</option>)}</select></div><div className="news-filter-field"><label htmlFor="news-market">Market</label><select disabled={!hydrated} id="news-market" value={market} onChange={e=>setMarket(e.target.value)} aria-controls="news-results"><option value="All">All markets</option>{newsMarkets.map(m=><option key={m}>{m}</option>)}</select></div><button type="button" className="news-filter-reset" onClick={reset} disabled={!hydrated||(filter==='All'&&market==='All')}>Reset filters</button></div><p className="news-result-count" role="status" aria-live="polite">{visible.length} {visible.length===1?'update':'updates'}{filter!=='All'?` in ${filter}`:''}{market!=='All'?` for ${market}`:''}</p></div>}
 {!archive&&<a href="/surfactants/news-media" className="text-link news-all">View all news<FiArrowRight aria-hidden="true"/></a>}
 <div id={archive?'news-results':undefined} className={`news-grid ${archive?'news-archive-grid':''}`}>{visible.map(a=>{const Icon=icons[a.category];return <article className="news-card" key={a.slug}><div className="news-artwork">{archive&&a.image?<Image src={a.image} alt={a.imageAlt||a.title} fill sizes="(max-width:700px) 100vw, 33vw"/>:<><Icon aria-hidden="true"/><span>{a.category}</span></>}</div><div className="news-card-copy"><span className="eyebrow">{a.category}</span><h3>{a.title}</h3><p>{a.summary}</p><ReadMore item={a}/></div></article>;})}</div>
 {archive&&visible.length===0&&<div className="news-empty"><h3>No matching news yet</h3><p>There are no updates tagged with this combination. Try another category or market, or reset the filters to view all updates.</p><button type="button" className="text-link" onClick={reset}>View all updates<FiArrowRight aria-hidden="true"/></button></div>}
 </>;}
