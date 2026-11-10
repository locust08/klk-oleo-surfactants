import Image from 'next/image';
const references = [
 {name:'RSPO',file:'rspo.png'}, {name:'ISCC',file:'iscc.png'},
 {name:'EcoVadis Platinum 2022',file:'ecovadis.svg'}, {name:'ISO',file:'iso.svg'},
 {name:'Kosher',file:'kosher.jpg'}, {name:'Halal',file:'halal.jpg'},
 {name:'COSMOS ORGANIC',file:'cosmos-organic.avif'},
 {name:'ECOCERT COSMOS APPROVED raw material',file:'cosmos-approved.jpg'},
 {name:'NATRUE Certified Natural & Organic Cosmetic',file:'natural-organic.png'},
];
export function CertificationCarousel() {
 return <div className="certification-carousel logo-carousel">
  <div className="logo-window" tabIndex={0} role="region" aria-label="Quality and certification references">
   <div className="logo-track">{[0,1].map(copy => <div className="logo-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{references.map(item => <div className="certification-logo" key={item.file}><Image src={`/images/certifications/${item.file}`} alt={copy === 0 ? item.name : ''} width={180} height={110} sizes="156px" loading="eager"/></div>)}</div>)}</div>
  </div>
 </div>;
}
