import { useSiteData } from '@/components/site-context';
import { Breadcrumbs,PageHeading } from '@/components/page-heading';
import { ContactForm } from '@/components/contact-form';
export function ContactPage({product}:{product?:string}){const page=useSiteData().pages.contact;return <><Breadcrumbs items={[{label:'Contact Us'}]}/><PageHeading title="Contact Us" image="/images/reference/contact.webp"/><section className="section contact-section"><div className="container"><span className="eyebrow">Discuss Your Needs</span><h2>{page?.heading||'Contact Us'}</h2><p className="wide-copy">{page?.introduction}</p><ContactForm product={product}/></div></section></>;}
