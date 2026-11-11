import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { categories,products,productPath } from '@/lib/catalog';
import { Breadcrumbs } from '@/components/page-heading';
import { FiArrowRight } from 'react-icons/fi';
import { ProductCategories } from '@/components/product-categories';
export function generateStaticParams(){return categories.map(c=>({category:c.slug}));}
export async function generateMetadata({params}:{params:Promise<{category:string}>}):Promise<Metadata>{const{category}=await params;return{title:`${categories.find(c=>c.slug===category)?.name??'Products'} | KLK OLEO Surfactants`};}
export default async function CategoryPage({params}:{params:Promise<{category:string}>}){const{category}=await params;const item=categories.find(c=>c.slug===category);if(!item)notFound();const list=products.filter(p=>p.category===category);return <><div className="products-listing-banner"><Image src="/images/reference/palmerol-background.jpg" alt="" fill preload sizes="100vw"/><Breadcrumbs items={[{label:'Products',href:'/surfactants/products'},{label:item.name}]}/><div className="container"><h1>Products</h1></div></div><div className="catalogue-layout"><ProductCategories active={category}/><section className="catalogue-main"><div className="section-heading-row"><h2>{item.name}</h2><span className="result-count">{list.length} {list.length===1?'brand':'brands'}</span></div>{list.map(p=><article className="product-panel" id={p.slug} key={p.slug}><span className="eyebrow">{item.name}</span><h3 className="product-brand-title"><Link href={productPath(p)}>{p.brand}</Link></h3>{p.descriptor&&<p className="product-family">{p.descriptor}</p>}{p.brand==='PALMOSALT'&&<p>Soap compositions for cosmetic, toiletry and laundry detergent formulations.</p>}<Link className="text-link" href={productPath(p)}>View {p.brand}<FiArrowRight aria-hidden="true"/></Link></article>)}</section></div></>;}
