import type {Metadata} from 'next';
import {Breadcrumbs} from '@/components/page-heading';
import {ResourceFinder} from '@/components/resource-finder';
export const metadata:Metadata={title:'Downloads | KLK OLEO Surfactants',description:'Request product brochures, leaflets and formulation guides for KLK OLEO Surfactants.'};
export default function DownloadsPage(){return <><Breadcrumbs items={[{label:'News & Media',href:'/surfactants/news-media'},{label:'Downloads'}]}/><section className="section downloads-page"><div className="container"><span className="eyebrow">Downloads</span><h1>Resource Finder</h1><p className="resource-intro">Access our latest product brochures, application guides, technical documents, and knowledge materials to support your work across surfactant and specialty chemical applications.</p><ResourceFinder/></div></section></>;}
