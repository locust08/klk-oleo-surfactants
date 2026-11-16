import { useSiteData } from '@/components/site-context';
import { useEffect,useRef,useState,type CSSProperties } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { InfoButton } from './info-button';
import { marketRgb,marketVisuals } from '@/lib/market-content';
import { SiteImage as Image } from './site-image';

/** Slow continuous market strip; three copies keep scrolling seamless and duplicates stay hidden from assistive technology. */
export function MarketCarousel(){
 const {markets}=useSiteData();const count=markets.length;
 const viewport=useRef<HTMLDivElement>(null);
 const focused=useRef(false);const resumeAt=useRef(0);const[active,setActive]=useState(0);
 const stride=()=>{const cards=viewport.current?.querySelectorAll<HTMLElement>('.industry-card');return cards&&cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:0;};
 useEffect(()=>{
  const node=viewport.current;if(!node||!count)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const position=()=>{const step=stride();if(step)node.scrollLeft=step*count;};
  position();const resize=new ResizeObserver(position);resize.observe(node);
  let frame=0,last=0,carry=0;
  const tick=(time:number)=>{
   const span=stride()*count;
   if(last&&!motion.matches&&!focused.current&&!document.hidden&&Date.now()>resumeAt.current&&span){
    carry+=Math.min(time-last,50)*.035;const pixels=Math.floor(carry);carry-=pixels;node.scrollLeft+=pixels;
    if(node.scrollLeft>=span*2)node.scrollLeft-=span;
    if(node.scrollLeft<span*.25)node.scrollLeft+=span;
   }
   last=time;frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);resize.disconnect();};
 },[count]);
 const move=(index:number)=>{
  const node=viewport.current;if(!node)return;
  resumeAt.current=Date.now()+5000;
  node.scrollTo({left:(count+index)*stride(),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 if(!count)return null;
 return <div className="industry-carousel" onFocusCapture={()=>{focused.current=true;}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))focused.current=false;}}>
  <div ref={viewport} className="industry-window" role="region" aria-roledescription="carousel" aria-label="Markets we serve. Swipe or use left and right arrow keys to explore." tabIndex={0}
   onPointerDown={()=>{resumeAt.current=Date.now()+5000;}}
   onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move((active+(e.key==='ArrowRight'?1:-1)+count)%count);}}}
   onScroll={()=>{const node=viewport.current,step=stride();if(node&&step)setActive(Math.round(node.scrollLeft/step)%count);}}>
   {[...markets,...markets,...markets].map((market,i)=>{const duplicate=i<count||i>=count*2;return <article className="industry-card" key={`${market.slug}-${i}`} aria-hidden={duplicate||undefined} style={{'--market-rgb':marketRgb(market.slug,market.colour)} as CSSProperties}>
    <Image src={marketVisuals[market.slug]?.image||'/images/hero/hero-04-our-markets.jpg'} alt="" fill sizes="(max-width:700px) 82vw, 33vw"/><div className="industry-overlay" aria-hidden="true"/>
    <div className="industry-card-copy"><h3>{market.name}</h3><p>{market.copy}</p>{market.url?<a href={market.url} tabIndex={duplicate?-1:0} className="text-link">Explore market<FiArrowUpRight aria-hidden="true"/></a>:!duplicate&&<InfoButton title={market.name} label="Explore market" description={`${market.copy} Our team can help you identify a solution for your application.`}/>}</div>
   </article>;})}
  </div>
  <div className="industry-pagination" aria-label="Choose a market">{markets.map((market,i)=><button key={market.slug} aria-label={`Show ${market.name}`} aria-current={active===i?'true':undefined} onClick={()=>move(i)}><span/></button>)}</div>
 </div>;
}
