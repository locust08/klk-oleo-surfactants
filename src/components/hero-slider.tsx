import { useSiteData } from '@/components/site-context';
import { useHydrated } from '@/lib/use-hydrated';
import { SiteImage as Image } from './site-image';
import { useEffect,useState,useSyncExternalStore } from 'react';
import { FiArrowLeft,FiArrowRight,FiPause,FiPlay } from 'react-icons/fi';
import { heroDestination } from '../cms/service-navigation';
import { InfoButton } from './info-button';
function subscribeMotion(callback:()=>void){const q=window.matchMedia('(prefers-reduced-motion: reduce)');q.addEventListener('change',callback);return()=>q.removeEventListener('change',callback);}
export function HeroSlider(){const hydrated=useHydrated();const {home,articles,servicePages}=useSiteData();const heroSlides=home?.heroSlides||[];
 const[index,setIndex]=useState(0);const[playing,setPlaying]=useState(true);const[hovered,setHovered]=useState(false);const[focusWithin,setFocusWithin]=useState(false);
 const reduced=useSyncExternalStore(subscribeMotion,()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,()=>false);
 useEffect(()=>{if(!playing||hovered||focusWithin||reduced)return;const timer=window.setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%heroSlides.length);},7000);return()=>window.clearInterval(timer);},[playing,hovered,focusWithin,reduced]);
 const next=(direction:number)=>setIndex(i=>(i+direction+heroSlides.length)%heroSlides.length);
 return <section className={`hero-slider ${index===3?'is-light':''}`} aria-roledescription="carousel" aria-label="KLK OLEO Surfactants highlights" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocusWithin(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocusWithin(false);}}>
  {heroSlides.map((slide,i)=><div className={`hero-slide ${i===index?'is-active':''} ${i===3?'hero-light':''}`} key={slide.image} aria-hidden={i!==index} inert={i!==index}>
   <Image src={slide.image} alt={slide.alt} fill sizes="100vw" priority={i===0} style={{objectPosition:slide.position}}/>
   <div className="hero-shade"/>
   <div className="container hero-content"><h1>{slide.title}</h1><p>{slide.copy}</p>{heroDestination(slide,articles,servicePages)?<a href={heroDestination(slide,articles,servicePages)} className="button button-outline">{slide.action}<FiArrowRight aria-hidden="true"/></a>:<InfoButton label={slide.action} className="button button-outline" title={slide.kind==='article'?(slide.target==='century'?'A Century of Surfactant Excellence':'Sustainability in Action'):slide.target} description={slide.kind==='article'?`${slide.copy} The full article will be added when the source content is available.`:undefined}/>}</div>
  </div>)}
  <div className="hero-controls container"><div className="hero-direction"><button disabled={!hydrated} className="icon-button" aria-label="Previous hero slide" onClick={()=>next(-1)}><FiArrowLeft/></button><button disabled={!hydrated} className="icon-button" aria-label="Next hero slide" onClick={()=>next(1)}><FiArrowRight/></button></div><div className="hero-selectors" aria-label="Choose a hero slide">{heroSlides.map((slide,i)=><button disabled={!hydrated} key={slide.image} aria-label={`Show slide ${i+1} of ${heroSlides.length}: ${slide.title}`} aria-current={i===index?'true':undefined} className={i===index?'is-active':''} onClick={()=>setIndex(i)}>{String(i+1).padStart(2,'0')}</button>)}</div>{!reduced&&<button disabled={!hydrated} className="hero-pause icon-button" aria-label={playing?'Pause slideshow':'Play slideshow'} onClick={()=>setPlaying(!playing)}>{playing?<FiPause/>:<FiPlay/>}</button>}</div>
 </section>;
}
