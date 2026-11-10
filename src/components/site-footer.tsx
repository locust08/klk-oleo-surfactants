import { useSiteData } from '@/components/site-context';
import { SiteImage as Image } from './site-image';
import { FaLinkedinIn } from 'react-icons/fa6';
import { FiArrowRight } from 'react-icons/fi';
const BASE='/surfactants';
import { InfoButton } from './info-button';
export function SiteFooter(){const {site,markets}=useSiteData();if(!site)return null;const {ctaCopy,footerCopy,sustainabilityUrl}=site;return <>
 <section className="enquiry-banner" aria-labelledby="enquiry-heading"><div className="container enquiry-inner"><div><span className="eyebrow">Discuss Your Needs</span><h2 id="enquiry-heading">{site.ctaHeading}</h2><p>{ctaCopy}</p></div><a href={`${BASE}/contact`} className="button button-light">Contact Us<FiArrowRight aria-hidden="true"/></a></div></section>
 <footer className="site-footer"><div className="container"><div className="footer-grid">
  <div className="footer-brand"><a href="https://www.klkoleo.com/" aria-label="KLK OLEO global website"><Image src="/images/brand/logo-white.webp" alt="KLK OLEO" width={158} height={58}/></a><h2>KLK OLEO | Surfactants</h2><p>{footerCopy}</p><a className="linkedin-link" href={site.footerLinkedin} aria-label="KLK OLEO Surfactants on LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedinIn/></a></div>
  <div><h3>Quick Links</h3><ul><li><a href={`${BASE}/products`}>Products</a></li><li><InfoButton title="Custom Manufacturing" label="Custom Manufacturing" className="footer-button"/></li><li><InfoButton title="Pilot Plant" label="Pilot Plant" className="footer-button"/></li><li><a href={sustainabilityUrl}>Sustainability</a></li><li><a href={`${BASE}/news-media`}>News &amp; Media</a></li><li>{site.careerUrl?<a href={site.careerUrl}>Career</a>:<InfoButton title="Career" label="Career" className="footer-button" description="Career information and the relevant destination will be added when confirmed."/>}</li></ul></div>
  <div><h3>Markets</h3><ul>{markets.map(m=><li key={m.slug}>{m.url?<a href={m.url}>{m.name}</a>:<a href={`${BASE}/our-markets#${m.slug}`}>{m.name}</a>}</li>)}</ul></div>
 </div><div className="footer-legal"><p>2026 KLK OLEO | Surfactants. All rights reserved.</p><nav aria-label="Legal information"><a href="https://www.klkoleo.com/disclaimer/">Disclaimer</a><a href="https://www.klkoleo.com/privacy-policy/">Personal Data Notice Statement</a><a href="https://www.klk.com.my/privacy-notice/">Privacy Notice</a><a href="https://www.klkoleo.com/cookie-policy/">Cookie Notice</a></nav></div></div></footer>
 </>;}
