import { useSiteData } from '@/components/site-context';
import { useHydrated } from '@/lib/use-hydrated';
import { SiteImage as Image } from './site-image';
import { useEffect,useState,useSyncExternalStore } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { heroDestination } from '../cms/service-navigation';
import { InfoButton } from './info-button';
function subscribeMotion(callback:()=>void){const q=window.matchMedia('(prefers-reduced-motion: reduce)');q.addEventListener('change',callback);return()=>q.removeEventListener('change',callback);}
export function HeroSlider(){const hydrated=useHydrated();const {home,articles,servicePages}=useSiteData();const heroSlides=home?.heroSlides||[];
 const[index,setIndex]=useState(0);const[focusWithin,setFocusWithin]=useState(false);
 const reduced=useSyncExternalStore(subscribeMotion,()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,()=>false);
 useEffect(()=>{if(focusWithin||reduced)return;const timer=window.setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%heroSlides.length);},5500);return()=>window.clearInterval(timer);},[focusWithin,reduced,heroSlides.length]);
 return <section className="hero-slider revamp-hero" aria-roledescription="carousel" aria-label="KLK OLEO Surfactants highlights" onFocusCapture={()=>setFocusWithin(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocusWithin(false);}}>
  {heroSlides.map((slide,i)=>{const href=heroDestination(slide,articles,servicePages);return <div className={`hero-slide ${i===index?'is-active':''}`} key={slide.image} aria-hidden={i!==index} inert={i!==index}>
   <Image src={slide.image} alt={slide.alt} fill sizes="100vw" priority={i===0} loading="eager" style={{objectPosition:slide.position}}/>
   <div className="hero-shade"/>
   <div className="container hero-content"><h1>{slide.title}</h1><p>{slide.copy}</p>{href?<a href={href} className="button hero-action"><span className="hero-action-icon" aria-hidden="true"><FiArrowRight/></span>{slide.action}</a>:<InfoButton label={slide.action} className="button hero-action" leadingIcon title={slide.kind==='article'?(slide.target==='century'?'A Century of Surfactant Excellence':'Sustainability in Action'):slide.target} description={slide.kind==='article'?`${slide.copy} The full article will be added when the source content is available.`:undefined}/>}</div>
  </div>;})}
  <div className="hero-controls container"><div className="hero-selectors" aria-label="Choose a hero slide">{heroSlides.map((slide,i)=><button disabled={!hydrated} key={slide.image} aria-label={`Show slide ${i+1} of ${heroSlides.length}: ${slide.title}`} aria-current={i===index?'true':undefined} className={i===index?'is-active':''} onClick={()=>setIndex(i)}><span className="sr-only">{i+1}</span></button>)}</div></div>
 </section>;
}
