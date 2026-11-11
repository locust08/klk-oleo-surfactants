'use client';
import Image from 'next/image';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {FiArrowUpRight} from 'react-icons/fi';
import {markets} from '@/lib/content';
import {marketVisuals} from '@/lib/market-content';

export function MarketCarousel(){
 const viewport=useRef<HTMLDivElement>(null);
 const focused=useRef(false);const resumeAt=useRef(0);const[active,setActive]=useState(0);
 useEffect(()=>{
  const node=viewport.current;if(!node)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const stride=()=>{const cards=node.querySelectorAll<HTMLElement>('.industry-card');return cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:0;};
  const position=()=>{const step=stride();if(step)node.scrollLeft=step*markets.length;};
  position();const resize=new ResizeObserver(position);resize.observe(node);
  let frame=0,last=0,carry=0;
  const tick=(time:number)=>{
   const step=stride(),span=step*markets.length;
   if(last&&!motion.matches&&!focused.current&&!document.hidden&&Date.now()>resumeAt.current&&span){
    carry+=Math.min(time-last,50)*.035;const pixels=Math.floor(carry);carry-=pixels;node.scrollLeft+=pixels;
    if(node.scrollLeft>=span*2)node.scrollLeft-=span;
    if(node.scrollLeft<span*.25)node.scrollLeft+=span;
   }
   last=time;frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);resize.disconnect();};
 },[]);
 const move=(index:number)=>{
  const node=viewport.current;if(!node)return;
  const cards=node.querySelectorAll<HTMLElement>('.industry-card');const step=cards[1].offsetLeft-cards[0].offsetLeft;
  resumeAt.current=Date.now()+5000;
  node.scrollTo({left:(markets.length+index)*step,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 return <div className="industry-carousel" onFocusCapture={()=>{focused.current=true;}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))focused.current=false;}}>
  <div ref={viewport} className="industry-window" role="region" aria-roledescription="carousel" aria-label="Markets we serve. Swipe or use left and right arrow keys to explore." tabIndex={0}
   onPointerDown={()=>{resumeAt.current=Date.now()+5000;}}
   onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move((active+(e.key==='ArrowRight'?1:-1)+markets.length)%markets.length);}}}
   onScroll={()=>{const node=viewport.current;if(!node)return;const cards=node.querySelectorAll<HTMLElement>('.industry-card');const step=cards[1].offsetLeft-cards[0].offsetLeft;if(step)setActive(Math.round(node.scrollLeft/step)%markets.length);}}>
   {[...markets,...markets,...markets].map((market,i)=>{const visual=marketVisuals[market.slug];const duplicate=i<markets.length||i>=markets.length*2;return <article className="industry-card" key={`${market.slug}-${i}`} aria-hidden={duplicate||undefined} style={{'--market-rgb':visual.rgb} as CSSProperties}>
    <Image src={visual.image} alt="" fill sizes="(max-width:700px) 82vw, (max-width:1100px) 46vw, 33vw" draggable={false}/><div className="industry-overlay"/>
    <div className="industry-card-copy"><h3>{market.name}</h3><p>{market.copy}</p><a href={market.url} tabIndex={duplicate?-1:0} className="text-link">Explore market<FiArrowUpRight aria-hidden="true"/></a></div>
   </article>;})}
  </div>
  <div className="industry-pagination" aria-label="Choose a market">{markets.map((market,i)=><button key={market.slug} aria-label={`Show ${market.name}`} aria-current={active===i?'true':undefined} onClick={()=>move(i)}><span/></button>)}</div>
 </div>;
}
