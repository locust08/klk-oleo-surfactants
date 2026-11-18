import type { CSSProperties } from 'react';
import { useSiteData } from '@/components/site-context';
import { FiPlay,FiChevronDown } from 'react-icons/fi';
import { HeroSlider } from './hero-slider';
import { SiteImage as Image } from './site-image';
import { BrandCarousel } from './brand-carousel';
import { BrandFilm,youtubeEmbed } from './brand-film';
import { MarketsLink } from './market-cards';
import { MarketCarousel } from './market-carousel';
import { NewsCards } from './news-cards';
import { CertificationCarousel } from './certification-carousel';
const statPhotos=['/images/hero/hero-01-100-years.jpg','/images/hero/hero-04-our-markets.jpg','/images/hero/hero-05-pilot-plant.jpg'];
const capabilityPhotos=['/images/markets/lubricants.png','/images/hero/hero-03-custom-manufacturing.jpg','/images/markets/cleaning.png','/images/hero/hero-02-sustainability.jpg'];
const helpPhotos=['/images/hero/hero-05-pilot-plant.jpg','/images/hero/hero-03-custom-manufacturing.jpg','/images/hero/hero-04-our-markets.jpg','/images/hero/hero-02-sustainability.jpg'];
/** FAQ answers keep blank-line separated paragraphs from the plain-text EmDash field. */
export const paragraphs=(text:string)=>text.split(/\n\s*\n/).map(item=>item.trim()).filter(Boolean);
export function HomePage(){const {home,faqs}=useSiteData();if(!home)return <section className="section container"><h1>KLK OLEO Surfactants</h1><p>Content is awaiting publication.</p></section>;const {introduction,capabilities,helpItems,portfolioCopy}=home;const film=youtubeEmbed(home.videoUrl);return <>
 <HeroSlider/>
 <section className="section about-section" id="about-us"><div className="container"><span className="eyebrow">About Us</span><h2 className="intro-heading">{home.introHeading.split('\n').map((line,i)=><span key={line}>{i>0&&<br className="desktop-break"/>}{i>0&&' '}{line}</span>)}</h2><p className="intro-copy">{introduction}</p><div className="about-tiles"><div className="stats-grid">{home.stats.map((stat,i)=><div key={stat.label} style={{'--stat-image':`url(${statPhotos[i%statPhotos.length]})`} as CSSProperties}><strong>{stat.value}</strong><span style={{whiteSpace:'pre-line'}}>{stat.label}</span></div>)}</div><div className="capability-grid">{capabilities.map(([title,copy],i)=><div key={title} style={{'--stat-image':`url(${capabilityPhotos[i%capabilityPhotos.length]})`} as CSSProperties}><h3>{title}</h3><p>{copy}</p></div>)}</div></div></div></section>
 <section className="section help-section"><div className="container"><span className="eyebrow">{home.helpHeading}</span><h2>Practical Technical Support</h2><div className="help-grid">{helpItems.map(([title,copy],i)=><div className="help-card" key={title}><Image src={helpPhotos[i%helpPhotos.length]} alt="" fill sizes="(max-width:700px) 100vw, 25vw"/><div className="help-card-copy"><h3>{title}</h3><p>{copy}</p></div></div>)}</div></div></section>
 <section className="section portfolio-section"><div className="container"><span className="eyebrow">What We Produce</span><h2>{home.portfolioHeading}</h2><p className="wide-copy">{portfolioCopy}</p><p>{home.portfolioInstruction}</p><BrandCarousel/></div></section>
 <section className="section markets-section" id="markets-we-serve"><div className="container"><div className="section-heading-row"><div><span className="eyebrow">Our Markets</span><h2>{home.marketsHeading}</h2></div><MarketsLink/></div><p className="wide-copy">{home.marketsCopy}</p></div><MarketCarousel/></section>
 <section className="section partner-section"><div className="container"><span className="eyebrow">Integrated Strength</span><h2>{home.partnerHeading}</h2><p className="wide-copy">{home.partnerCopy}</p>{film?<BrandFilm src={film} title={`KLK OLEO — ${home.videoHeading}`}/>:home.videoUrl?<video controls preload="none" poster={home.videoPoster} src={home.videoUrl} style={{width:'100%',marginTop:40}}/>:<div className="video-placement" aria-label="Brand film placement, footage to be supplied"><FiPlay aria-hidden="true"/><span>{home.videoHeading}</span><p>Brand film coming soon</p></div>}</div></section>
 <section className="section quality-section"><div className="container"><span className="eyebrow">Quality and Compliance</span><h2>{home.qualityHeading}</h2><p>{home.qualityCopy}</p><div className="award-panel"><div className="award-artwork"><img src={home.awardImage||'/images/quality/shell-mvps-2025.jpg'} alt={home.awardImage?(home.awardImageAlt||''):'Shell Chemicals and Refining 2025 MVPs Awards (Most Valuable Partners)'}/></div><div><h3>{home.awardTitle}</h3><p>{home.awardCopy}</p></div></div><CertificationCarousel/></div></section>
 <section className="section news-section"><div className="container"><span className="eyebrow">Release</span><h2>{home.newsHeading}</h2><p className="wide-copy">{home.newsCopy}</p><NewsCards/></div></section>
 <section className="section faq-section" id="faq"><div className="container"><span className="eyebrow">FAQ</span><h2>{home.faqHeading}</h2><div className="faq-list">{faqs.map(([q,a],i)=><details key={q} open={i===0}><summary>{q}<FiChevronDown aria-hidden="true"/></summary><div className="faq-answer">{paragraphs(a).map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div></details>)}</div></div></section>
 </>;}
