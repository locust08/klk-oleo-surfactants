import { categories,type CategorySlug } from '@/lib/product-catalog';
import { Breadcrumbs } from '@/components/page-heading';
import { ProductCatalogue } from '@/components/product-catalogue';
import { SiteImage as Image } from '@/components/site-image';
export const categoryDescriptions:Record<CategorySlug,string>={anionic:'High-performance surfactants designed for effective cleansing, foaming, wetting, and emulsifying applications.',cationic:'Cationic surfactants for conditioning, emulsification and specialised formulation requirements.',nonionic:'Flexible surfactant solutions offering effective emulsification, wetting, dispersion, and cleaning performance.'};
export function CategoryPage({category}:{category:string}){const item=categories.find(c=>c.slug===category)!;const label=item.name.replace(' Surfactants','');return <>
 <section className="products-listing-banner"><Image src="/images/reference/palmerol-background.jpg" alt="" fill priority sizes="100vw"/><Breadcrumbs items={[{label:'Products',href:'/surfactants/products'},{label:label}]}/><div className="container"><div><p className="banner-kicker">Product Finder</p><h1>{label}</h1></div></div></section>
 <ProductCatalogue initialCategory={item.slug} intro={{title:item.name,description:categoryDescriptions[item.slug]}}/>
</>;}
