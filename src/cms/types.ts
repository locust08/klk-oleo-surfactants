import type { Product } from '../lib/product-catalog';
export type Media = { id: string; src?: string; url?: string; alt?: string; filename?: string; mimeType?: string };
export type Hero = { title: string; copy: string; image: string; alt: string; action: string; kind: string; target: string; position: string };
export type Market = { name: string; slug: string; copy: string; colour: string; url?: string };
export type Article = { slug: string; title: string; category: 'Exhibition' | 'Product' | 'Corporate' | 'Sustainability'; summary: string; body?: unknown[]; publishedAt?: string; image?: string };
export type Home = {
  title: string; introduction: string; portfolioCopy: string; heroSlides: Hero[];
  capabilities: [string, string][]; helpItems: [string, string, string?][];
  stats: { value: string; label: string }[];
  introHeading: string; helpHeading: string; portfolioHeading: string; portfolioInstruction: string;
  marketsHeading: string; marketsCopy: string; partnerHeading: string; partnerCopy: string;
  videoHeading: string; videoUrl?: string; videoPoster?: string;
  qualityHeading: string; qualityCopy: string; awardTitle: string; awardCopy: string; awardImage?: string; awardImageAlt?: string;
  newsHeading: string; newsCopy: string; faqHeading: string; certifications: string[];
};
export type Site = { title: string; ctaCopy: string; ctaHeading: string; footerCopy: string; sustainabilityUrl: string; headerLinkedin: string; footerLinkedin: string; careerUrl?: string; contactEmail?: string; consentLabel: string };
export type Page = { title: string; heading: string; introduction: string; seoTitle?: string; seoDescription?: string };
export type SiteData = { home: Home | null; site: Site | null; products: Product[]; markets: Market[]; articles: Article[]; faqs: [string, string][]; pages: Record<string, Page>; servicePages: {route:string;title:string}[] };
