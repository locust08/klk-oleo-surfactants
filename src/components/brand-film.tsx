'use client';
import {useEffect,useRef,useState} from 'react';

export function BrandFilm(){
 const container=useRef<HTMLDivElement>(null);
 const[visible,setVisible]=useState(false);
 useEffect(()=>{
  const node=container.current;if(!node)return;
  const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect();}},{threshold:.25});
  observer.observe(node);return()=>observer.disconnect();
 },[]);
 return <div ref={container} className="brand-film" aria-label="KLK OLEO brand film">
  {visible&&<iframe src="https://www.youtube-nocookie.com/embed/UKwlxsZb8cI?autoplay=1&mute=1&playsinline=1&controls=1&rel=0" title="KLK OLEO — From development to full-scale production" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>}
 </div>;
}
