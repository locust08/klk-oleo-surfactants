import { Breadcrumbs,PageHeading } from '@/components/page-heading';
import { NewsCards } from '@/components/news-cards';
export function NewsPage(){return <><Breadcrumbs items={[{label:'News & Media'}]}/><PageHeading title="News & Media"/><section className="section"><div className="container"><div className="centred-intro"><h2>Our Latest News</h2><p>Stay informed with the latest announcements, exhibitions, and milestones from KLK OLEO Surfactants. Explore how we continue to advance innovation and sustainability across our business.</p></div><NewsCards archive/></div></section></>;}
