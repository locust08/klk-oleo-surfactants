'use client';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {FaLinkedinIn} from 'react-icons/fa6';
import {FiMenu,FiSearch,FiChevronDown} from 'react-icons/fi';
import {BASE,sustainabilityUrl} from '@/lib/content';
import {categories} from '@/lib/catalog';
const nav=[['Home',BASE],['Products',`${BASE}/products`],['Our Markets',`${BASE}/our-markets`],['Sustainability',sustainabilityUrl],['News & Media',`${BASE}/news-media`],['Contact Us',`${BASE}/contact`]];
export function SiteHeader(){
 const path=usePathname();const[open,setOpen]=useState(false),[submenu,setSubmenu]=useState('');
 const close=()=>{setOpen(false);setSubmenu('');};
 return <header className="site-header" onKeyDown={e=>{if(e.key==='Escape')close();}}><a className="skip-link" href="#main">Skip to content</a>
 <div className="corporate-bar"><div className="header-inner"><a href="https://www.klkoleo.com/" aria-label="KLK OLEO global website"><Image src="/images/brand/logo-white.webp" alt="KLK OLEO" width={116} height={43} priority/></a><a className="linkedin-link" href="https://www.linkedin.com/company/klkberhad/" aria-label="KLK Berhad on LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedinIn/></a></div></div>
 <div className="main-nav"><div className="header-inner"><div className="division-name"><a href="https://www.klkoleo.com/">KLK OLEO</a><span aria-hidden="true">|</span><Link href={BASE} onClick={close}>Surfactants</Link></div>
 <nav id="site-navigation" className={`navigation ${open?'is-open':''}`} aria-label="Main navigation"><form className="mobile-menu-search" action={`${BASE}/search`} role="search" onSubmit={close}><label className="sr-only" htmlFor="mobile-product-search">Search products</label><input id="mobile-product-search" type="search" name="q" placeholder="Search products..." maxLength={120} autoComplete="off"/></form>
 {nav.map(([label,href])=>{const active=href===BASE?path===BASE:href.startsWith(BASE)&&path.startsWith(href);const children=label==='Products'?categories.map(c=>[c.name,`${BASE}/products/${c.slug}`]):label==='News & Media'?[['News and Events',`${BASE}/news-media`],['Downloads',`${BASE}/news-media/downloads`]]:null;const id=label==='Products'?'product-submenu':'news-submenu';return children?<div className="nav-products" key={href}><div className="nav-products-trigger"><Link href={href} onClick={close} className={active?'active':''} aria-current={active?'page':undefined}>{label}</Link><button aria-label={label==='Products'?'Show product categories':'Show News and Media pages'} aria-expanded={submenu===id} aria-controls={id} onClick={()=>setSubmenu(submenu===id?'':id)}><FiChevronDown/></button></div>{submenu===id&&<div id={id} className="product-submenu"><Link className="submenu-overview" href={href} onClick={close}>{label}<span aria-hidden="true">→</span></Link><div className="submenu-categories">{children.map(([name,url])=><Link key={url} href={url} onClick={close}>{name}</Link>)}</div></div>}</div>:<Link key={href} href={href} className={active?'active':''} aria-current={active?'page':undefined} onClick={close}>{label}</Link>;})}</nav>
 <form className="header-search" action={`${BASE}/search`} role="search" onSubmit={close}><label className="sr-only" htmlFor="product-search">Search products</label><input id="product-search" type="search" name="q" placeholder="Search products" maxLength={120} autoComplete="off"/><button aria-label="Search products"><FiSearch/></button></form><button className="mobile-toggle icon-button" aria-label={open?'Close navigation':'Open navigation'} aria-controls="site-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}><FiMenu/></button></div></div></header>;
}
