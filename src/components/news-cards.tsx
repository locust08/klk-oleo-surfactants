import { useSiteData } from '@/components/site-context';
import { useHydrated } from '@/lib/use-hydrated';
import { useState } from 'react';
import { FiArrowRight,FiCalendar,FiPackage,FiUsers,FiFeather } from 'react-icons/fi';
import { newsCategories,type NewsCategory } from '@/cms/news-categories';
import { InfoButton } from './info-button';
const itemsFor=(articles:ReturnType<typeof useSiteData>['articles'])=>[
 {slug:'exhibition-pending',title:'Meet us at upcoming exhibitions',category:'Exhibition' as NewsCategory,summary:'Exhibition announcements will be added here.',pending:true},
 {slug:'product-pending',title:'Discover our latest product updates',category:'Product' as NewsCategory,summary:'Product updates will be added here.',pending:true},
 ...articles.map(a=>({...a,pending:false})),
];
const icons={Exhibition:FiCalendar,Product:FiPackage,Corporate:FiUsers,Sustainability:FiFeather};
export function NewsCards({archive=false}:{archive?:boolean}){const hydrated=useHydrated();const {articles}=useSiteData();const items=itemsFor(articles);const[filter,setFilter]=useState('All');const visible=filter==='All'?items:items.filter(a=>a.category===filter);return <>
 {archive&&<div className="news-filter"><label htmlFor="news-category">Filter by</label><select disabled={!hydrated} id="news-category" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{newsCategories.map(c=><option key={c}>{c}</option>)}</select><span aria-live="polite">{visible.length} {visible.length===1?'update':'updates'}</span></div>}
 <div className={`news-grid ${archive?'news-archive-grid':''}`}>{visible.map(a=>{const Icon=icons[a.category];return <article className="news-card" key={a.slug}><div className="news-artwork"><Icon aria-hidden="true"/><span>{a.category}</span></div><div className="news-card-copy"><span className="eyebrow">{a.category}</span><h3>{a.title}</h3><p>{a.summary}</p>{'body' in a&&a.body?.length&&'publishedAt' in a&&a.publishedAt?<a className="text-link" href={`/surfactants/news-media/${a.slug}`}>Read More<FiArrowRight/></a>:<InfoButton title={a.title} description={a.pending?'This section will be updated when the source content is confirmed.':`${a.summary} The full article and publication date will be added once the source content is supplied.`} label={a.pending?'More information':'Read More'}/>}</div></article>;})}</div>
 {!archive&&<a href="/surfactants/news-media" className="text-link news-all">View all news<FiArrowRight aria-hidden="true"/></a>}
 </>;}
