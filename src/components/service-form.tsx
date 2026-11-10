import type { SiteData } from '../cms/types';
import { SiteProvider } from './site-context';
import { ContactForm } from './contact-form';

export function ServiceForm({siteData,title,submitLabel}:{siteData:SiteData;title:string;submitLabel?:string|null}) {
  return <SiteProvider data={siteData}><ContactForm initialMessage={`I would like to discuss a ${title} project.`} submitLabel={submitLabel?.trim()||'Send enquiry'}/></SiteProvider>;
}
