import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { ContactForm } from '@/components/contact-form';
import { manufacturingTechnologies, manufacturingPromises, manufacturingSteps, manufacturingCommitments, manufacturingSupport } from '@/lib/custom-manufacturing';

export const metadata: Metadata = {
  title: 'Custom Chemical Manufacturing | KLK OLEO Surfactants',
  description: 'Expert custom and contract chemical manufacturing for industrial and specialty applications. Partner with KLK OLEO Surfactants — contact us today!',
};

function ManufacturingIcon({ name }: { name: string }) {
  return <Image src={`/images/custom-manufacturing/${name}.svg`} alt="" width={64} height={64} className="manufacturing-icon" />;
}

export default function CustomManufacturingPage() {
  return <div className="pilot-page manufacturing-page">
    <section className="pilot-hero manufacturing-hero">
      <Image src="/images/hero/hero-03-custom-manufacturing.jpg" alt="Stainless-steel manufacturing tanks and process walkways" fill preload sizes="100vw" />
      <div className="pilot-hero-shade" />
      <div className="container pilot-hero-copy">
        <nav aria-label="Breadcrumb"><Link href="/surfactants">Home</Link><span>/</span><span>Custom Manufacturing</span></nav>
        <span className="eyebrow">From your idea to industrial production</span>
        <h1>Custom Chemical Manufacturing</h1>
        <p className="manufacturing-hero-line">That brings your ideas to life.</p>
        <p>From contract chemical manufacturing to industrial scale production, KLK OLEO Surfactants helps turn your product or intermediate into a scalable reality.</p>
        <a href="#project-enquiry" className="button hero-action"><span className="hero-action-icon"><FiArrowRight aria-hidden="true" /></span>Talk to Our Team</a>
      </div>
    </section>

    <section className="section manufacturing-technologies" aria-labelledby="manufacturing-technologies-title">
      <div className="container">
        <span className="eyebrow">Specialty chemistry. Practical expertise.</span>
        <h2 id="manufacturing-technologies-title">Our Manufacturing Technologies</h2>
        <p className="pilot-intro">From alkoxylation and phosphation to sulphation, sulphonation, esterification, amidation, polymerization, and quaternisation, our broad manufacturing capabilities turn complex chemistry into high-performance solutions.</p>
        <ul className="manufacturing-technology-grid">{manufacturingTechnologies.map((technology, i) => <li key={technology}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h3>{technology}</h3><FiCheckCircle aria-hidden="true" /></li>)}</ul>
      </div>
    </section>

    <section className="section pilot-mint">
      <div className="container">
        <span className="eyebrow">Built around your requirements</span>
        <h2>Why customers choose KLK OLEO Surfactants</h2>
        <p className="pilot-intro">We combine specialty chemical know-how, manufacturing expertise, and dedicated support teams to co-create solutions that meet your performance, quality, regulatory, and ESG requirements.</p>
        <div className="pilot-three pilot-benefits">
          {[
            ['Tailor-made solutions', 'Designed around a defined performance profile and your application target.'],
            ['Reliable scale-up', 'From lab results to industrial readiness with repeatable performance in focus.'],
            ['Quality, regulatory, and ESG support', 'Documentation, compliance, and sustainability expectations supported throughout the process.'],
          ].map(([title, copy]) => <article key={title}><FiCheckCircle aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
        <div className="pilot-four manufacturing-promises">{manufacturingPromises.map(item => <article key={item.label}><ManufacturingIcon name={item.icon} /><span className="eyebrow">{item.label}</span><h3>{item.title}</h3></article>)}</div>
        <a href="#project-enquiry" className="text-link">Contact us<FiArrowRight aria-hidden="true" /></a>
      </div>
    </section>

    <section className="section">
      <div className="container pilot-split manufacturing-partner">
        <div className="pilot-photo"><Image src="/images/hero/hero-05-pilot-plant.jpg" alt="Manufacturing facility surrounded by woodland" fill sizes="(max-width:760px) 100vw, 50vw" /></div>
        <div><span className="eyebrow">A partnership built to deliver</span><h2>We don’t just supply products. We co-create solutions.</h2><p>Custom manufacturing at KLK OLEO Surfactants is built for customers who need more than capacity. It is designed for businesses looking for a partner that can take an idea, develop the right process, and deliver reliable production at scale.</p><p>Our technical and operations teams work closely with you to create a solution around your target profile, streamline the path from development to production, and support a faster, more confident route to market.</p></div>
      </div>
      <div className="container manufacturing-process"><span className="eyebrow">Connected from the start</span><h2>From idea to full-scale manufacturing</h2><ol className="pilot-four manufacturing-steps">{manufacturingSteps.map((step, i) => <li key={step.title}><span className="manufacturing-step-number">{String(i + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.copy}</p></li>)}</ol></div>
    </section>

    <section className="section manufacturing-commitments">
      <div className="container">
        <div className="manufacturing-commitments-heading"><span className="eyebrow">Dependable execution. Long-term supply.</span><h2>What you can count on</h2><p className="pilot-intro">KLK OLEO Surfactants combines specialty chemical expertise with practical manufacturing know-how, enabling dependable execution from development to long-term supply.</p></div>
        <div className="manufacturing-commitment-grid">{manufacturingCommitments.map((item, i) => <article key={item.title}><ManufacturingIcon name={['quality', 'production', 'collaboration', 'outcome'][i]} /><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}</div>
      </div>
    </section>

    <section className="section pilot-mint">
      <div className="container">
        <span className="eyebrow">Support throughout your project</span><h2>Technical and operational support</h2>
        <div className="manufacturing-support-grid">{manufacturingSupport.map(item => <article key={item.icon}><ManufacturingIcon name={item.icon} /><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
        <div className="manufacturing-scale"><div><span className="eyebrow">Scale-up range</span><strong>1 mt <span>to</span> 35 mt</strong></div><Link href="/surfactants/pilot-plant" className="text-link">Explore our Pilot Plant<FiArrowRight aria-hidden="true" /></Link></div>
      </div>
    </section>

    <section className="section" id="project-enquiry">
      <div className="container pilot-enquiry"><div><span className="eyebrow">Let’s create what comes next</span><h2>Let’s bring your product or intermediate to life.</h2><p>Looking for a partner to turn an idea into reliable production? Let’s talk about how KLK OLEO Surfactants’ custom manufacturing can support your business.</p></div><div className="pilot-form manufacturing-form"><h3>Tell us about your project</h3><p>Share your product idea, performance requirements, or scale-up challenge. Our team will get back to you to discuss the best next step.</p><ContactForm pilot /></div></div>
    </section>
  </div>;
}
