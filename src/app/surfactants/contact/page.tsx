import type { Metadata } from 'next';
import { Breadcrumbs,PageHeading } from '@/components/page-heading';
import { ContactForm } from '@/components/contact-form';
import { products } from '@/lib/catalog';
export const metadata:Metadata={title:'Contact Us | KLK OLEO Surfactants'};
export default async function ContactPage({searchParams}:{searchParams:Promise<{product?:string}>}){const query=await searchParams;const product=products.find(p=>p.brand===query.product)?.brand;return <><Breadcrumbs items={[{label:'Contact Us'}]}/><PageHeading title="Contact Us" image="/images/reference/contact.webp"/><section className="section contact-section"><div className="container"><span className="eyebrow">Discuss Your Needs</span><h2>Get in Touch with Our Team</h2><p className="wide-copy">If you wish to enquire about KLK OLEO Surfactants products, please complete the short form provided. Our team will be in contact with you shortly.</p><ContactForm product={product}/></div></section></>;}
