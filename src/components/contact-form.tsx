import { useHydrated } from '@/lib/use-hydrated';
import { useRef,useState } from 'react';
import { FiArrowRight,FiArrowLeft,FiDownload,FiCheckCircle } from 'react-icons/fi';
import countries from '@/lib/countries.json';
export function ContactForm({product}:{product?:string}){const hydrated=useHydrated();
 const formRef=useRef<HTMLFormElement>(null);const reviewRef=useRef<HTMLElement>(null);const[review,setReview]=useState<Record<string,string>|null>(null);
 const download=()=>{if(!review)return;const text='KLK OLEO Surfactants — Enquiry draft\nPrepared locally; not submitted.\n\n'+Object.entries(review).map(([key,value])=>`${key}: ${value||'—'}`).join('\n\n');const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='klk-oleo-enquiry-draft.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 return <div className="contact-form-wrap"><p className="preview-note"><strong>Local preview</strong> — this form prepares an enquiry draft for review. Nothing is sent or stored.</p>
 <form ref={formRef} hidden={!!review} onInput={e=>{const target=e.target;if(target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement)target.setCustomValidity('');}} onSubmit={e=>{e.preventDefault();const form=e.currentTarget;for(const field of form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input[required]:not([type="checkbox"]),textarea[required]')){const value=field.value.trim();if(!value||(field.name==='Message'&&value.length<10)){field.setCustomValidity(field.name==='Message'?'Please enter a message of at least 10 characters.':'Please enter a value, not only spaces.');field.reportValidity();return;}}const data=new FormData(form);const values=Object.fromEntries([...data.entries()].filter(([key])=>key!=='consent').map(([key,value])=>[key,String(value).trim()]));setReview(values);requestAnimationFrame(()=>reviewRef.current?.focus());}}>
  <div className="form-grid">
   <label>First Name <span>*</span><input name="First Name" autoComplete="given-name" required maxLength={80}/></label>
   <label>Last Name <span>*</span><input name="Last Name" autoComplete="family-name" required maxLength={80}/></label>
   <label>Company Name <span>*</span><input name="Company Name" autoComplete="organization" required maxLength={160}/></label>
   <label>Job Position<input name="Job Position" autoComplete="organization-title" maxLength={120}/></label>
   <label>Country <span>*</span><select name="Country" autoComplete="country-name" required defaultValue=""><option value="" disabled>Select Country</option>{countries.map(country=><option key={country}>{country}</option>)}</select></label>
   <label>Email <span>*</span><input name="Email" type="email" autoComplete="email" required maxLength={254}/></label>
   <label className="full-width">Company Website<input name="Company Website" type="url" autoComplete="url" placeholder="https://" maxLength={300}/></label>
   <label className="full-width">Message <span>*</span><textarea name="Message" required minLength={10} maxLength={5000} rows={6} defaultValue={product?`I would like to enquire about ${product}.`:''}/></label>
  </div>
  <label className="consent-label"><input name="consent" type="checkbox" required/> <span>I agree that KLK OLEO may use my submitted details to respond to this enquiry. <a href="https://www.klkoleo.com/privacy-policy/">Privacy information</a></span></label>
  <p className="small-note">Fields marked * are required. Contact routing and final consent wording will be confirmed before launch.</p>
  <button disabled={!hydrated} type="submit" className="button">Review enquiry<FiArrowRight aria-hidden="true"/></button>
 </form>
 {review&&<section className="enquiry-review" ref={reviewRef} tabIndex={-1} aria-labelledby="review-title"><FiCheckCircle className="review-icon" aria-hidden="true"/><h2 id="review-title">Review your enquiry</h2><p>Your draft is ready. Nothing has been sent.</p><dl>{Object.entries(review).map(([key,value])=>value&&<div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl><div className="review-actions"><button disabled={!hydrated} className="button" onClick={download}>Download draft<FiDownload aria-hidden="true"/></button><button disabled={!hydrated} className="text-link" onClick={()=>{setReview(null);requestAnimationFrame(()=>formRef.current?.querySelector('input')?.focus());}}><FiArrowLeft aria-hidden="true"/>Edit enquiry</button></div></section>}
 </div>;
}
