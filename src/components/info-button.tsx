import { useHydrated } from '@/lib/use-hydrated';
import { useRef } from 'react';
import { FiArrowRight, FiX, FiInfo } from 'react-icons/fi';
export function InfoButton({title,description,label='Learn More',className='text-link',product}:{title:string;description?:string;label?:string;className?:string;product?:string}){const hydrated=useHydrated();
 const ref=useRef<HTMLDialogElement>(null);
 return <>
  <button disabled={!hydrated} type="button" className={className} onClick={()=>ref.current?.showModal()}>{label}<FiArrowRight aria-hidden="true"/></button>
  <dialog ref={ref} className="info-dialog" aria-label={title}>
   <button disabled={!hydrated} className="dialog-close icon-button" aria-label="Close information" onClick={()=>ref.current?.close()}><FiX/></button>
   <span className="eyebrow"><FiInfo aria-hidden="true"/> KLK OLEO Surfactants</span>
   <h2>{title}</h2>
   <p>{description??'Detailed information will be added once the content is confirmed. In the meantime, our team can help with your requirements.'}</p>
   <a href={`/surfactants/contact${product?`?product=${encodeURIComponent(product)}`:''}`} className="button" onClick={()=>ref.current?.close()}>Discuss your needs<FiArrowRight aria-hidden="true"/></a>
   <button disabled={!hydrated} className="quiet-button" onClick={()=>ref.current?.close()}>Continue browsing</button>
  </dialog>
 </>;
}
