'use client';
import Image from 'next/image';
import Link from 'next/link';
import { articlePath } from '@/lib/articles';
import { useEffect,useState,useSyncExternalStore } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { heroSlides } from '@/lib/content';
import { InfoButton } from './info-button';
function subscribeMotion(callback:()=>void){const q=window.matchMedia('(prefers-reduced-motion: reduce)');q.addEventListener('change',callback);return()=>q.removeEventListener('change',callback);}
export function HeroSlider(){
 const[index,setIndex]=useState(0);const[focusWithin,setFocusWithin]=useState(false);
 const reduced=useSyncExternalStore(subscribeMotion,()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,()=>false);
 useEffect(()=>{if(focusWithin||reduced)return;const timer=window.setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%heroSlides.length);},5500);return()=>window.clearInterval(timer);},[focusWithin,reduced]);
 return <section className="hero-slider revamp-hero" aria-roledescription="carousel" aria-label="KLK OLEO Surfactants highlights" onFocusCapture={()=>setFocusWithin(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocusWithin(false);}}>
  {heroSlides.map((slide,i)=><div className={`hero-slide ${i===index?'is-active':''}`} key={slide.image} aria-hidden={i!==index} inert={i!==index}>
   <Image src={`/images/hero/${slide.image}`} alt={slide.alt} fill sizes="100vw" preload={i===0} loading={i===0?undefined:'eager'} style={{objectPosition:slide.position}}/>
   <div className="hero-shade"/>
   <div className="container hero-content"><h1>{slide.title}</h1><p>{slide.copy}</p>{(slide.kind==='article'||slide.kind==='page')?<Link href={slide.kind==='article'?articlePath(slide.target):slide.target} className="button hero-action"><span className="hero-action-icon" aria-hidden="true"><FiArrowRight/></span>{slide.action}</Link>:slide.kind==='anchor'?<a href={slide.target} className="button hero-action"><span className="hero-action-icon" aria-hidden="true"><FiArrowRight/></span>{slide.action}</a>:<InfoButton label={slide.action} className="button hero-action" leadingIcon title={slide.target}/>}</div>
  </div>)}
  <div className="hero-controls container"><div className="hero-selectors" aria-label="Choose a hero slide">{heroSlides.map((slide,i)=><button key={slide.image} aria-label={`Show slide ${i+1} of 5: ${slide.title}`} aria-current={i===index?'true':undefined} className={i===index?'is-active':''} onClick={()=>setIndex(i)}><span className="sr-only">{i+1}</span></button>)}</div></div>
 </section>;
}
