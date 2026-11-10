import { SiteImage as Image } from './site-image';
import { BASE } from '@/lib/content';
import { FiChevronRight } from 'react-icons/fi';
export function Breadcrumbs({items}:{items:{label:string;href?:string}[]}){return <nav className="breadcrumbs" aria-label="Breadcrumb"><div className="container"><a href={BASE}>Home</a>{items.map((item,i)=><span key={`${item.label}-${i}`}><FiChevronRight aria-hidden="true"/>{item.href?<a href={item.href}>{item.label}</a>:<span aria-current="page">{item.label}</span>}</span>)}</div></nav>;}
export function PageHeading({title,image,children}:{title:string;image?:string;children?:React.ReactNode}){return <section className={`page-heading ${image?'has-image':''}`}>{image&&<Image src={image} alt="" fill sizes="100vw" priority/>}<div className="container"><h1>{title}</h1>{children}</div></section>;}
