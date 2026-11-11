import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { FiArrowRight,FiArrowLeft } from 'react-icons/fi';
import { categories,products,productPath } from '@/lib/catalog';
import { Breadcrumbs } from '@/components/page-heading';
import { ProductCategories } from '@/components/product-categories';

type Params={category:string;brand:string};
function findProduct({category,brand}:Params){return products.find(product=>product.category===category&&product.slug===brand);}
export function generateStaticParams(){return products.map(product=>({category:product.category,brand:product.slug}));}
export async function generateMetadata({params}:{params:Promise<Params>}):Promise<Metadata>{const product=findProduct(await params);return product?{title:`${product.brand}${product.descriptor?` | ${product.descriptor}`:''} | KLK OLEO Surfactants`,description:`Explore ${product.brand}${product.descriptor?`, ${product.descriptor}`:''} from KLK OLEO Surfactants. Contact our team for product grades, applications and technical documentation.`,alternates:{canonical:productPath(product)}}:{title:'Product not found'};}
export default async function BrandPage({params}:{params:Promise<Params>}){
 const values=await params;
 if(values.category==='anionic'&&values.brand==='tensaryl')permanentRedirect('/surfactants/products/anionic/tensaryly');
 const product=findProduct(values);if(!product)notFound();const category=categories.find(item=>item.slug===product.category)!;
 const related=products.filter(item=>item.category===product.category&&item.slug!==product.slug).slice(0,3);
 return <><Breadcrumbs items={[{label:'Products',href:'/surfactants/products'},{label:category.name,href:`/surfactants/products/${category.slug}`},{label:product.brand}]}/><div className="catalogue-layout brand-detail-layout"><ProductCategories active={category.slug}/><section className="catalogue-main brand-detail"><span className="eyebrow">{category.name}</span><h1>{product.brand}</h1>{product.descriptor&&<p className="brand-description">{product.descriptor}</p>}<div className="brand-overview"><h2>Product overview</h2>{product.summary?<p>{product.summary}</p>:<p>Contact our team to discuss {product.brand} for your formulation and production requirements.</p>}<dl><div><dt>Brand</dt><dd>{product.brand}</dd></div><div><dt>Category</dt><dd>{category.name}</dd></div>{product.descriptor&&<div><dt>Product family</dt><dd>{product.descriptor}</dd></div>}</dl></div><div className="brand-technical"><h2>Find the right product for your application</h2><p>Our team can help you discuss available grades, application requirements and technical documentation for {product.brand}.</p><Link className="button" href={`/surfactants/contact?product=${encodeURIComponent(product.brand)}`}>Enquire about {product.brand}<FiArrowRight aria-hidden="true"/></Link></div>{related.length>0&&<div className="brand-related"><h2>Explore more {category.name.toLowerCase()}</h2><div>{related.map(item=><Link href={productPath(item)} key={item.slug}><strong>{item.brand}</strong>{item.descriptor&&<span>{item.descriptor}</span>}<FiArrowRight aria-hidden="true"/></Link>)}</div></div>}<Link className="text-link" href={`/surfactants/products/${category.slug}`}><FiArrowLeft aria-hidden="true"/>Back to {category.name}</Link></section></div></>;
}
