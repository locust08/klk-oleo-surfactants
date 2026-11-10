import { useSiteData } from '@/components/site-context';
import { Breadcrumbs,PageHeading } from '@/components/page-heading';
import { NewsCards } from '@/components/news-cards';
export function NewsPage(){const page=useSiteData().pages['news-media'];return <><Breadcrumbs items={[{label:'News & Media'}]}/><PageHeading title="News & Media"/><section className="section"><div className="container"><div className="centred-intro"><h2>{page?.heading||'News & Media'}</h2><p>{page?.introduction}</p></div><NewsCards archive/></div></section></>;}
