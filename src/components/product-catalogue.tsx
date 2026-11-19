import { useEffect,useState } from 'react';
import { FiArrowRight,FiSearch } from 'react-icons/fi';
import { useSiteData } from '@/components/site-context';
import { categories,categoryName,productPath,type CategorySlug,productDescriptor} from '@/lib/product-catalog';
const PAGE_SIZE=20;
/** Agrochemicals-style catalogue: search, Category filter accordion with counts, ruled product rows, pagination. */
export function ProductCatalogue({initialCategory,intro}:{initialCategory?:CategorySlug;intro?:{title:string;description:string}}){
 const {products}=useSiteData();
  const[query,setQuery]=useState('');const[page,setPage]=useState(1);
 useEffect(()=>{const requested=Number(new URLSearchParams(window.location.search).get('page'));if(requested>1)setPage(requested);},[]);
 const term=query.trim().toLowerCase();
 const filtered=products.filter(p=>(!initialCategory||p.category===initialCategory)&&(!term||[p.brand,p.descriptor,p.summary,categoryName(p.category)].some(v=>v&&v.toLowerCase().includes(term))));
 const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));const current=Math.min(page,pages);
 const shown=filtered.slice((current-1)*PAGE_SIZE,current*PAGE_SIZE);
 const go=(next:number)=>{setPage(next);const url=new URL(window.location.href);if(next>1)url.searchParams.set('page',String(next));else url.searchParams.delete('page');window.history.replaceState(null,'',url);document.getElementById('catalogue-top')?.scrollIntoView({block:'start'});};
 return <div className="catalogue-layout" id="catalogue-top">
  <aside className="catalogue-filters">
   <label className="catalogue-search"><span className="sr-only">Search products</span><input type="search" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}} placeholder="Search" maxLength={80} autoComplete="off"/><FiSearch aria-hidden="true"/></label>
   <nav className="catalogue-category-nav" aria-label="Product categories"><h2>Category</h2>{categories.map(category=><a key={category.slug} href={`/surfactants/products/${category.slug}`} aria-current={category.slug===initialCategory?'page':undefined}>{category.name.replace(' Surfactants','')}</a>)}</nav>
  </aside>
  <section className="catalogue-main" aria-live="polite">
   {intro&&<div className="catalogue-intro"><h2>{intro.title}</h2><p>{intro.description}</p></div>}
   <div className="section-heading-row"><h2>{filtered.length} {filtered.length===1?'Product':'Products'}</h2><span className="result-count">Page {current} of {pages}</span></div>
   {shown.map(p=><article className="product-panel" id={p.slug} key={p.slug}><span className="eyebrow">{categoryName(p.category)}</span><h3 className="product-brand-title"><a href={productPath(p)}>{p.brand}</a></h3><p className="product-family">{productDescriptor(p)}</p>{p.summary&&<p>{p.summary}</p>}<a className="catalogue-row-arrow" href={productPath(p)} aria-label={`View ${p.brand}`}><FiArrowRight aria-hidden="true"/></a></article>)}
   {filtered.length===0&&<p className="catalogue-empty" role="status">No products match your filters.</p>}
   {pages>1&&<nav className="catalogue-pagination" aria-label="Pagination">{Array.from({length:pages},(_,i)=>i+1).map(n=><a key={n} href={n>1?`?page=${n}`:'?'} aria-current={n===current?'page':undefined} onClick={e=>{e.preventDefault();go(n);}}>{n}</a>)}{current<pages&&<a href={`?page=${current+1}`} onClick={e=>{e.preventDefault();go(current+1);}}>Next</a>}</nav>}
  </section>
 </div>;
}
