import { useSiteData } from '@/components/site-context';
import { useHydrated } from '@/lib/use-hydrated';
import { SiteImage as Image } from './site-image';
import { useState } from 'react';
import { FaLinkedinIn } from 'react-icons/fa6';
import { FiMenu,FiSearch,FiChevronDown,FiArrowRight } from 'react-icons/fi';
const BASE='/surfactants';
import { categories } from '@/lib/product-catalog';
const navFor=(sustainabilityUrl:string)=>[['Home',BASE],['Products',`${BASE}/products`],['Our Markets',`${BASE}/our-markets`],['Sustainability',sustainabilityUrl],['News & Media',`${BASE}/news-media`],['Contact Us',`${BASE}/contact`]];
const submenus:Record<string,{id:string;label:string;items:string[][]}>={
 Products:{id:'product-submenu',label:'Show product categories',items:categories.map(c=>[c.name.replace(/ Surfactants$/,''),`${BASE}/products/${c.slug}`])},
 'News & Media':{id:'news-submenu',label:'Show News and Media pages',items:[['News and Events',`${BASE}/news-media`],['Downloads',`${BASE}/news-media/downloads`]]},
};
export function SiteHeader({pathname}:{pathname:string}){const hydrated=useHydrated();
 const {site}=useSiteData();const nav=navFor(site?.sustainabilityUrl||'https://www.klkoleo.com/sustainability-principled-by-integrity/');const path=pathname;const[open,setOpen]=useState(false);const[submenu,setSubmenu]=useState('');
 const close=()=>{setOpen(false);setSubmenu('');};
 return <header className="site-header" onKeyDown={e=>{if(e.key==='Escape')close();}}>
  <a className="skip-link" href="#main">Skip to content</a>
  <div className="corporate-bar"><div className="header-inner"><a href="https://www.klkoleo.com/" aria-label="KLK OLEO global website"><Image src="/images/brand/logo-white.webp" alt="KLK OLEO" width={116} height={43} priority/></a><a className="linkedin-link" href={site?.headerLinkedin} aria-label="KLK Berhad on LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedinIn/></a></div></div>
  <div className="main-nav"><div className="header-inner">
   <div className="division-name"><a href="https://www.klkoleo.com/">KLK OLEO</a><span aria-hidden="true">|</span><a href={BASE} onClick={close}>Surfactants</a></div>
   <nav id="site-navigation" className={`navigation ${open?'is-open':''}`} aria-label="Main navigation">
    <form className="mobile-menu-search" action={`${BASE}/search`} role="search" onSubmit={close}><label className="sr-only" htmlFor="mobile-product-search">Search products</label><input id="mobile-product-search" type="search" name="q" placeholder="Search products..." maxLength={120} autoComplete="off"/></form>
    {nav.filter(([label])=>label!=='Home').map(([label,href])=>{const active=href===BASE?path===BASE:href.startsWith(BASE)&&path.startsWith(href);const menu=submenus[label];return menu?<div className="nav-products" key={href} onMouseEnter={()=>{if(window.matchMedia('(min-width:1101px)').matches)setSubmenu(menu.id);}} onMouseLeave={()=>{if(window.matchMedia('(min-width:1101px)').matches)setSubmenu('');}}>
     <div className="nav-products-trigger"><a href={href} onClick={close} className={active?'active':''} aria-current={active?'page':undefined}>{label}</a><button disabled={!hydrated} aria-label={menu.label} aria-expanded={submenu===menu.id} aria-controls={menu.id} onClick={()=>setSubmenu(submenu===menu.id?'':menu.id)}><FiChevronDown/></button></div>
     {submenu===menu.id&&<div id={menu.id} className="product-submenu"><a className="submenu-overview" href={href} onClick={close}>{label}<span aria-hidden="true"><FiArrowRight/></span></a><div className="submenu-categories">{menu.items.map(([name,url])=><a key={url} href={url} onClick={close} aria-current={path===url||path.startsWith(url+'/')?'page':undefined}>{name}</a>)}</div></div>}
    </div>:<a key={href} href={href} className={active?'active':''} aria-current={active?'page':undefined} onClick={close}>{label}</a>;})}
   </nav>
   <form className="header-search" action={`${BASE}/search`} role="search" onSubmit={close}>
    <label className="sr-only" htmlFor="product-search">Search products</label>
    <input id="product-search" type="search" name="q" placeholder="Search products" maxLength={120} autoComplete="off"/>
    <button disabled={!hydrated} aria-label="Search products"><FiSearch/></button>
   </form>
   <button disabled={!hydrated} className="mobile-toggle icon-button" aria-label={open?'Close navigation':'Open navigation'} aria-controls="site-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}><FiMenu/></button>
  </div></div>
 </header>;
}
