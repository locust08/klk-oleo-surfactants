import Link from 'next/link';
import { categories,products } from '@/lib/catalog';

export function ProductCategories({active}:{active:string}) {
  return <aside className="category-sidebar"><nav aria-label="Product categories"><Link href="/surfactants/products" className="catalogue-back">All products</Link><h2>Category</h2>{categories.map(category=><Link key={category.slug} href={`/surfactants/products/${category.slug}`} aria-current={category.slug===active?'page':undefined} className={category.slug===active?'active':''}><span>{category.name.replace(' Surfactants','')}</span><span className="category-brand-count">{products.filter(product=>product.category===category.slug).length}</span></Link>)}</nav></aside>;
}
