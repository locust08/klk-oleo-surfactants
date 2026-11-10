import type { SeedFile, SeedField, SeedCollection } from 'emdash/seed';
import * as source from '../lib/content';
import { products } from '../lib/catalog';

const snake = (value: string) => value.replace(/[A-Z]/g, character => `_${character.toLowerCase()}`);
const wireData = (value: unknown): unknown => Array.isArray(value) ? value.map(wireData) : value && typeof value === 'object' ? 'provider' in value ? value : Object.fromEntries(Object.entries(value).map(([key, item]) => [snake(key), wireData(item)])) : value;
const text = (slug: string, label: string, required = false): SeedField => ({ slug: snake(slug), label, type: 'text', required, validation: { maxLength: 5000 } });
const short = (slug: string, label: string, required = false): SeedField => ({ slug: snake(slug), label, type: 'string', required, validation: { maxLength: 500 } });
const image = (slug: string, label: string): SeedField => ({ slug: snake(slug), label, type: 'image', validation: { allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] } });
const choice = (slug: string, label: string, options: string[], required = false): SeedField => ({ slug: snake(slug), label, type: 'select', required, validation: { options } });
const rows = (slug: string, label: string, fields: SeedField[], maxItems = 50, minItems = 0): SeedField => ({ slug: snake(slug), label, type: 'repeater', validation: { subFields: fields.map(field => ({ ...field, ...(field.validation?.options ? { options: field.validation.options } : {}) })), maxItems, minItems } });
const collection = (slug: string, label: string, fields: SeedField[], urlPattern?: string): SeedCollection => ({ slug, label, fields: [short('title', 'Title', true), short('sourceKey', 'Import source key (managed by agency)'), ...fields], supports: ['drafts', 'revisions', 'preview'], urlPattern, group: 'Surfactants', editLocking: true });
const draft = (slug: string, data: Record<string, unknown>) => ({ id: `source:${slug}`, slug, status: 'draft' as const, data: wireData({sourceKey:`source:${slug}`,...data}) as Record<string, unknown> });
const pairs = (items: string[][]) => items.map(([title, copy]) => ({ title, copy }));

/** Source snapshots only: imports always create drafts and skip existing slugs. */
export function buildSeed(): SeedFile {
  const homeFields: SeedField[] = [
    text('introduction', 'Introduction'), short('introHeading', 'Introduction heading'),
    short('helpHeading', 'Help heading'), short('portfolioHeading', 'Portfolio heading'),
    text('portfolioCopy', 'Portfolio introduction'), text('portfolioInstruction', 'Portfolio instruction'),
    short('marketsHeading', 'Markets heading'), text('marketsCopy', 'Markets introduction'),
    short('partnerHeading', 'Partner heading'), text('partnerCopy', 'Partner introduction'),
    short('videoHeading', 'Video heading'), { slug: 'video_url', label: 'Approved video URL', type: 'url' }, image('videoPoster', 'Video poster'),
    short('qualityHeading', 'Quality heading'), text('qualityCopy', 'Quality introduction'),
    short('awardTitle', 'Award title'), text('awardCopy', 'Award description'), image('awardImage', 'Award artwork'),
    short('newsHeading', 'News heading'), text('newsCopy', 'News introduction'), short('faqHeading', 'FAQ heading'),
    rows('heroSlides', 'Hero slides', [short('title', 'Heading', true), text('copy', 'Description'), image('image', 'Image'), short('action', 'Button label'), choice('kind', 'Destination type', ['article', 'anchor', 'external', 'deferred'], true), short('target', 'Article slug or approved destination'), short('position', 'Image focal position')], 5, 3),
    rows('stats', 'Statistics', [short('value', 'Value', true), short('label', 'Label', true)], 6),
    rows('capabilities', 'Capabilities', [short('title', 'Heading', true), text('copy', 'Description')], 4),
    rows('helpItems', 'Help cards', [short('title', 'Heading', true), text('copy', 'Description'), image('image', 'Icon')], 4),
    rows('certifications', 'Certification references', [short('name', 'Name', true)], 20),
  ];
  const home = {
    title: 'Home', identity: 'home', introduction: source.introduction, introHeading: 'Global Surfactant\nManufacturer and Supplier',
    helpHeading: 'How Can We Help', portfolioHeading: 'Surfactants Portfolio', portfolioCopy: source.portfolioCopy,
    portfolioInstruction: 'Use our Product Explorer to navigate our diverse portfolio and identify the best fit for your application.',
    marketsHeading: 'Markets We Serve', marketsCopy: 'Oleo-based and synthetic solutions for key industries where performance and reliability matter. Functions include wetting, foaming, emulsifying, cleaning, dispersion, and stability, designed to deliver consistent results at scale.',
    partnerHeading: 'Your Partner of Choice for Surfactants', partnerCopy: "KLK OLEO is one of the world's largest vertically integrated oleochemicals manufacturers, giving you direct access to oleochemicals and their derivatives, raw material security, global production capacity, and consistent supply.",
    videoHeading: 'From development to full-scale production', qualityHeading: 'High Standard, High Trust', qualityCopy: 'Our ISO-certified quality systems and full documentation support make audits and approvals straightforward for our customers.',
    awardTitle: 'Shell Gold Award for Operational Excellence', awardCopy: 'We are proud to be recognised for award-winning operations, with 24-hour responsiveness, proactive supply reliability, and co-created solutions, backed by ISO-certified management systems and a Platinum EcoVadis rating.',
    newsHeading: 'Latest News', newsCopy: 'Stay informed with the latest announcements, exhibitions, and milestones from KLK OLEO Surfactants. Explore how we continue to advance innovation and sustainability across our business.', faqHeading: 'Frequently Asked Questions',
    heroSlides: source.heroSlides.map(slide => ({ ...slide, image: { id: `/images/hero/${slide.image}`, src: `/images/hero/${slide.image}`, alt: slide.alt, provider: 'external', mimeType: 'image/jpeg' } })),
    stats: [{ value: '100+', label: 'Years of surfactant expertise' }, { value: '100+', label: 'Countries supplied' }, { value: '7', label: 'Surfactants manufacturing\nsites in Europe and Asia' }],
    capabilities: pairs(source.capabilities), helpItems: pairs(source.helpItems),
    certifications: ['RSPO', 'ISCC PLUS', 'EcoVadis', 'ISO', 'Kosher', 'Halal', 'COSMOS ORGANIC', 'COSMOS APPROVED', 'Natural & Organic'].map(name => ({ name })),
  };
  return {
    version: '1', meta: { name: 'KLK OLEO Surfactants', description: 'Source content imported as drafts for editorial review.' },
    collections: [
      collection('home', 'Home', [{...choice('identity', 'Fixed identity', ['home'], true), unique: true}, ...homeFields], '/surfactants'),
      collection('brands', 'Brands', [choice('category', 'Category', ['anionic', 'cationic', 'nonionic'], true), short('descriptor', 'Descriptor'), text('summary', 'Approved summary'), { slug: 'order', label: 'Order', type: 'integer', indexed: true }, { slug: 'brochure', label: 'Approved brochure', type: 'file', validation: { allowedMimeTypes: ['application/pdf'] } }, image('image', 'Image')], '/surfactants/brands/{slug}'),
      collection('markets', 'Markets', [text('copy', 'Description'), choice('colour', 'Overlay colour', ['teal', 'pink', 'green', 'grey', 'purple']), { slug: 'url', label: 'Approved destination', type: 'url' }, { slug: 'order', label: 'Order', type: 'integer', indexed: true }], '/surfactants/our-markets#{slug}'),
      collection('news', 'News', [choice('category', 'Category', ['Exhibition', 'Product', 'Corporate', 'Sustainability'], true), text('summary', 'Summary'), { slug: 'body', label: 'Article body', type: 'portableText' }, { slug: 'publication_date', label: 'Approved publication date', type: 'datetime' }, image('image', 'Featured image'), short('seoTitle', 'SEO title'), text('seoDescription', 'SEO description')], '/surfactants/news-media/{slug}'),
      collection('faqs', 'FAQs', [text('answer', 'Answer', true), { slug: 'order', label: 'Order', type: 'integer', indexed: true }], '/surfactants#faq'),
      collection('pages', 'Pages', [{...choice('route', 'Fixed page route', ['products', 'our-markets', 'news-media', 'contact'], true), unique: true}, short('heading', 'Page heading'), text('introduction', 'Introduction'), short('seoTitle', 'SEO title'), text('seoDescription', 'SEO description')], '/surfactants/{slug}'),
      collection('site_content', 'Site content', [{...choice('identity', 'Fixed identity', ['site'], true), unique: true}, short('ctaHeading', 'CTA heading'), text('ctaCopy', 'CTA description'), text('footerCopy', 'Footer introduction'), { slug: 'sustainability_url', label: 'Sustainability URL', type: 'url' }, { slug: 'header_linkedin', label: 'Header LinkedIn URL', type: 'url' }, { slug: 'footer_linkedin', label: 'Footer LinkedIn URL', type: 'url' }, { slug: 'career_url', label: 'Approved career URL', type: 'url' }, short('contactEmail', 'Public contact email'), text('consentLabel', 'Enquiry consent label', true)], '/surfactants'),
    ],
    content: {
      home: [draft('home', home)],
      brands: products.map((item, order) => draft(item.slug, { title: item.brand, category: item.category, descriptor: item.descriptor, order, sourceKey: `brand:${item.slug}`, summary: item.brand === 'PALMOSALT' ? 'Soap compositions for cosmetic, toiletry and laundry detergent formulations.' : undefined })),
      markets: source.markets.map((item, order) => draft(item.slug, { title: item.name, copy: item.copy, colour: item.colour, url: 'url' in item ? item.url : undefined, order })),
      news: source.articles.map(item => draft(item.slug, { title: item.title, summary: item.summary, category: item.category })),
      faqs: source.faqs.map(([question, answer], order) => draft(`faq-${order + 1}`, { title: question, answer, order })),
      pages: [
        draft('products', { route: 'products', title: 'Products', heading: 'Enriching Performance\n Across Industries', introduction: 'KLK OLEO Surfactants delivers high-performance surfactant solutions that support a wide range of industries around the world.', seoTitle: 'Our Products | KLK OLEO Surfactants' }),
        draft('our-markets', { route: 'our-markets', title: 'Our Markets', heading: 'Surfactant Solutions for Key Industries', introduction: 'Oleo-based and synthetic solutions for key industries where performance and reliability matter.', seoTitle: 'KLK OLEO Surfactants for Key Industries', seoDescription: 'Explore KLK OLEO surfactants for personal care, home care, agriculture, and more. High performance, compliant, and sustainable solutions' }),
        draft('news-media', { route: 'news-media', title: 'News & Media', heading: 'Our Latest News', introduction: home.newsCopy, seoTitle: 'News & Media | KLK OLEO Surfactants' }),
        draft('contact', { route: 'contact', title: 'Contact Us', heading: 'Get in Touch with Our Team', introduction: 'If you wish to enquire about KLK OLEO Surfactants products, please complete the short form provided. Our team will be in contact with you shortly.', seoTitle: 'Contact Us | KLK OLEO Surfactants' }),
      ],
      site_content: [draft('site', { title: 'KLK OLEO | Surfactants', identity: 'site', ctaHeading: 'How can we support your next formulation?', ctaCopy: source.ctaCopy, footerCopy: source.footerCopy, sustainabilityUrl: source.sustainabilityUrl, headerLinkedin: 'https://www.linkedin.com/company/klkberhad/', footerLinkedin: 'https://www.linkedin.com/company/klk-oleo-surfactants/', consentLabel: 'I agree that KLK OLEO may use my submitted details to respond to this enquiry.' })],
    },
  };
}
