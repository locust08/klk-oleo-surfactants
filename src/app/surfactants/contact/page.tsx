import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactForm } from '@/components/contact-form';
import { products } from '@/lib/catalog';
export const metadata:Metadata={title:'Contact Us | KLK OLEO Surfactants'};
export default async function ContactPage({searchParams}:{searchParams:Promise<{product?:string}>}){const query=await searchParams;const product=products.find(p=>p.brand===query.product)?.brand;return <div className="agro-contact-page"><section className="contact-hero"><Image src="/images/reference/contact-support.webp" alt="Customer support representative wearing a headset" fill sizes="100vw" preload/><div className="contact-hero-shade"/><div className="container"><h1>Contact Us</h1></div></section><section className="section contact-section" id="contact-form"><div className="container contact-layout"><div className="contact-copy"><h2>Get in Touch with Our Team</h2><p>If you wish to enquire about KLK OLEO Surfactants products, please complete the short form provided. Our team will be in contact with you shortly.</p></div><ContactForm product={product}/></div></section></div>;}
