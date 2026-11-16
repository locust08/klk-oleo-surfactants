import { useSiteData } from '@/components/site-context';
/** Versioned logo artwork for the editable certification references; unknown names render as text. */
const logos:Record<string,{file:string;alt:string}>={
 'RSPO':{file:'rspo.png',alt:'RSPO'},'ISCC PLUS':{file:'iscc.png',alt:'ISCC'},'ISCC':{file:'iscc.png',alt:'ISCC'},
 'EcoVadis':{file:'ecovadis.svg',alt:'EcoVadis Platinum 2022'},'ISO':{file:'iso.svg',alt:'ISO'},
 'Kosher':{file:'kosher.jpg',alt:'Kosher'},'Halal':{file:'halal.jpg',alt:'Halal'},
 'COSMOS ORGANIC':{file:'cosmos-organic.avif',alt:'COSMOS ORGANIC'},
 'COSMOS APPROVED':{file:'cosmos-approved.jpg',alt:'ECOCERT COSMOS APPROVED raw material'},
 'Natural & Organic':{file:'natural-organic.png',alt:'NATRUE Certified Natural & Organic Cosmetic'},
};
export function CertificationCarousel(){const {home}=useSiteData();const references=home?.certifications||[];
 return <div className="certification-carousel logo-carousel">
  <div className="logo-window" tabIndex={0} role="region" aria-label="Quality and certification references">
   <div className="logo-track">{[0,1].map(copy=><div className="logo-group" key={copy} aria-hidden={copy===1?true:undefined}>{references.map(name=>{const logo=logos[name];return <div className="certification-logo" key={name}>{logo?<img src={`/images/certifications/${logo.file}`} alt={copy===0?logo.alt:''} width={180} height={110} loading="eager"/>:<span>{name}</span>}</div>;})}</div>)}</div>
  </div>
 </div>;
}
