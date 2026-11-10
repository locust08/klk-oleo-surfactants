import type { SeedField, SeedFile } from 'emdash/seed';
import source from './service-content.json' with { type: 'json' };

export const serviceRoutes = ['custom-manufacturing', 'pilot-plant'] as const;
export const serviceTextFields = [
  ['heading','Main heading'], ['introduction','Introduction'], ['cta_label','Introduction button'],
  ['benefits_heading','Benefits heading'], ['overview_heading','Overview heading'], ['overview_copy','Overview copy'],
  ['process_heading','Process heading'], ['technologies_heading','Technologies heading'], ['technologies_copy','Technologies introduction'],
  ['materials_heading','Raw materials heading'], ['materials_copy','Raw materials introduction'],
  ['equipment_heading','Reactors heading'], ['equipment_copy','Reactors introduction'],
  ['assurance_heading','Assurances heading'], ['assurance_copy','Assurances introduction'],
  ['support_heading','Support heading'], ['support_copy','Support introduction'],
  ['scale_label','Scale range label'], ['scale_value','Scale range'],
  ['closing_heading','Closing heading'], ['closing_copy','Closing copy'],
  ['form_heading','Project form heading'], ['form_copy','Project form introduction'], ['form_action_label','Project form submit label'],
  ['seo_title','SEO title'], ['seo_description','SEO description'],
] as const;
export const serviceRowFields = [
  ['highlights','Highlights',4], ['benefits','Benefits',6], ['process_steps','Process steps',6],
  ['technologies','Manufacturing technologies / reaction families',12], ['materials','Raw materials',15],
  ['equipment','Reactors',8], ['assurances','Assurances',6], ['support_items','Support cards',8],
] as const;
const short = (slug:string,label:string,required=false):SeedField=>({slug,label,type:'string',required,validation:{maxLength:500}});
const image:SeedField={slug:'image',label:'Icon / image',type:'image',validation:{allowedMimeTypes:['image/jpeg','image/png','image/webp','image/avif']}};

export function buildServiceSeed():SeedFile {
  return {
    version:'1',
    collections:[{
      slug:'service_pages',label:'Service pages',group:'Surfactants',supports:['drafts','revisions','preview'],editLocking:true,urlPattern:'/surfactants/{slug}',
      fields:[short('title','Title',true),short('source_key','Import source key (managed by agency)'),
        {slug:'route',label:'Fixed service route',type:'select',required:true,unique:true,validation:{options:[...serviceRoutes]}},
        ...serviceTextFields.map(([slug,label]):SeedField=>({slug,label,type:slug.endsWith('_copy')||slug==='introduction'||slug==='seo_description'?'text':'string',required:['heading','introduction'].includes(slug),validation:{maxLength:slug.endsWith('_copy')||slug==='introduction'?5000:500}})),
        {...image,slug:'intro_image',label:'Optional introduction image'},
        ...serviceRowFields.map(([slug,label,maxItems]):SeedField=>({slug,label,type:'repeater',validation:{maxItems,subFields:['technologies','materials'].includes(slug)?[short('title','Name',true)]:[short('title','Heading / value',true),{slug:'copy',label:'Description',type:'text',validation:{maxLength:5000}},short('label','Label'),image]}})),
      ],
    }],
    content:{service_pages:source.pages.map(({slug,data})=>({id:`source:${slug}`,slug,status:'draft',data:{...data,source_key:`service:${slug}`}}))},
  };
}
