import { useSiteData } from '@/components/site-context';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { categoryName, productPath } from '@/lib/product-catalog';
/** Centred, continuously advancing portfolio carousel; three copies keep the loop seamless. */
export function BrandCarousel() {
 const {products}=useSiteData();const count=products.length;const slides=[...products,...products,...products];
 const shell=useRef<HTMLDivElement>(null);
 const [index,setIndex]=useState(count);const [width,setWidth]=useState(0);const [transitioning,setTransitioning]=useState(true);const [focused,setFocused]=useState(false);const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const node=shell.current;if(!node)return;
  const observer=new ResizeObserver(([entry])=>setWidth(entry.contentRect.width));observer.observe(node);
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);
  update();media.addEventListener('change',update);
  return()=>{observer.disconnect();media.removeEventListener('change',update);};
 },[]);
 useEffect(()=>{
  if(focused||reduced||!transitioning||count<2)return;
  const timer=window.setInterval(()=>{if(!document.hidden)setIndex(i=>i+1);},3200);
  return()=>window.clearInterval(timer);
 },[focused,reduced,transitioning,count]);
 useEffect(()=>{
  if(transitioning)return;
  const frame=requestAnimationFrame(()=>requestAnimationFrame(()=>setTransitioning(true)));
  return()=>cancelAnimationFrame(frame);
 },[transitioning]);
 if(!count)return null;
 const active=((index%count)+count)%count;
 const slot=Math.min(421,Math.max(250,width-28));
 return <div className="brand-carousel" onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}>
  <div className="portfolio-link"><a href="/surfactants/products" className="text-link">View all products<FiArrowRight aria-hidden="true"/></a></div>
  <div ref={shell} className="portfolio-carousel-shell" role="region" aria-roledescription="carousel" aria-label="Surfactants portfolio">
   <div className={`portfolio-carousel-track${transitioning?' is-transitioning':''}`} style={{transform:`translate3d(${width/2-(index+.5)*slot}px,0,0)`,'--portfolio-slot':`${slot}px`} as CSSProperties} onTransitionEnd={e=>{
    if(e.target!==e.currentTarget)return;
    if(index>=count*2||index<count){setTransitioning(false);setIndex(count+active);}
   }}>
    {slides.map((p,i)=><div className="portfolio-carousel-slot" key={`${p.slug}-${i}`} aria-hidden={i!==index}><a href={productPath(p)} tabIndex={i===index?0:-1} className={`portfolio-carousel-card${i===index?' is-active':''}`}><span>{categoryName(p.category)}</span><h3>{p.brand}</h3>{p.descriptor&&<p>{p.descriptor}</p>}<FiArrowRight aria-hidden="true"/></a></div>)}
   </div>
  </div>
  <div className="portfolio-dots" aria-label="Choose a surfactant brand">{products.map((p,i)=><button key={p.slug} aria-label={`Show ${p.brand}`} aria-current={i===active?'true':undefined} onClick={()=>setIndex(count+i)}><span/></button>)}</div>
 </div>;
}
