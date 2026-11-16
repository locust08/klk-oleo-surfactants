import { useEffect,useRef,useState } from 'react';

/** Approved privacy-enhanced YouTube embeds load only once the film scrolls into view. */
export function youtubeEmbed(url?:string){
 if(!url)return undefined;
 try{const parsed=new URL(url);const host=parsed.hostname.replace(/^www\./,'');
  const id=host==='youtu.be'?parsed.pathname.slice(1):['youtube.com','youtube-nocookie.com'].includes(host)?(parsed.pathname.startsWith('/embed/')?parsed.pathname.slice(7):parsed.searchParams.get('v')):null;
  return id&&/^[\w-]{6,20}$/.test(id)?`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&controls=1&rel=0`:undefined;
 }catch{return undefined;}
}
export function BrandFilm({src,title}:{src:string;title:string}){
 const container=useRef<HTMLDivElement>(null);
 const[visible,setVisible]=useState(false);
 useEffect(()=>{
  const node=container.current;if(!node)return;
  const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect();}},{threshold:.25});
  observer.observe(node);return()=>observer.disconnect();
 },[]);
 return <div ref={container} className="brand-film" aria-label="KLK OLEO brand film">
  {visible&&<iframe src={src} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>}
 </div>;
}
