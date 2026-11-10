import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Breadcrumbs } from '@/components/page-heading';
import { articleContent, articlePath } from '@/lib/articles';

export const dynamicParams = false;
export function generateStaticParams() { return articleContent.map(article => ({ slug: article.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articleContent.find(item => item.slug === slug);
  if (!article) return {};
  return { title: article.metaTitle, description: article.description, openGraph: { type: 'article', title: article.metaTitle, description: article.description, ...(article.date ? { publishedTime: article.date } : {}) } };
}
const sectionId = (index: number) => `section-${index}`;
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleContent.find(item => item.slug === slug);
  if (!article) notFound();
  const related = articleContent.find(item => item.slug !== slug)!;
  return <>
    <Breadcrumbs items={[{ label: 'News & Media', href: '/surfactants/news-media' }, { label: article.key === 'century' ? 'A Century of Surfactant Excellence' : article.title }]} />
    <article className="editorial-article">
      <header className="article-heading container">
        <Link className="text-link" href="/surfactants/news-media"><FiArrowLeft aria-hidden="true" />Back to News &amp; Media</Link>
        <div className="article-meta"><span className="eyebrow">{article.category}</span>{article.date && <time dateTime={article.date}>10 June 2026</time>}</div>
        <h1>{article.title}</h1>
        {article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}
      </header>
      <figure className="article-cover container"><Image src={`/images/hero/${article.image}`} alt={article.alt} fill preload sizes="(max-width: 700px) 100vw, 90vw" /></figure>
      <div className="article-layout container">
        <aside className="article-contents"><nav aria-label="In this article"><span className="eyebrow">In this article</span>{article.blocks.map((block, index) => block.type === 'heading' && block.level === 2 ? <a href={`#${sectionId(index)}`} key={index}>{block.text}</a> : null)}</nav></aside>
        <div className="article-body">
          {article.key === 'sustainability' && <div className="article-impact" aria-label="Moerdijk expansion targets"><div><strong>20%</strong><span>Planned increase in production capacity</span></div><div><strong>30%</strong><span>Targeted reduction in carbon emissions</span></div></div>}
          {article.blocks.map((block, index) => block.type === 'heading' ? block.level === 2 ? <h2 id={sectionId(index)} key={index}>{block.text}</h2> : <h3 id={sectionId(index)} key={index}>{block.text}</h3> : <p key={index}>{block.text}</p>)}
          <div className="article-end"><span className="eyebrow">Continue reading</span><Link href={articlePath(related.key)}><span>{related.title}</span><FiArrowRight aria-hidden="true" /></Link></div>
        </div>
      </div>
    </article>
  </>;
}
