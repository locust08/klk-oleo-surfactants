# KLK OLEO Surfactants

Local Next.js 16 App Router implementation of the selected option 3 design. TypeScript, React 19, locally hosted Poppins fonts and `react-icons`. Deployed to Cloudflare Workers with OpenNext; email integration is not configured.

## Run locally

```sh
npm install
npm run dev -- --port 3000
```

Open `http://localhost:3000/surfactants`. `/` redirects to the minisite. The development server binds to `127.0.0.1`.

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

## Implemented

- Shared Agrochemicals-style two-tier header, responsive menu, three-category Products submenu and product-only search.
- Five supplied homepage hero images with the main revamp fade/zoom transition, dot selectors, PDF-style icon buttons and reduced-motion handling.
- Complete homepage section sequence, 25-brand carousel, five markets, quality/film placements, four news categories, five FAQs and the shared two-part footer.
- Products archive with exactly Anionic, Cationic and Nonionic category boxes; brand-led category listings and anchored search results.
- Our Markets, News & Media, Contact and product-search routes; exact supplied Home and Markets metadata.
- Honest local contact review/download flow. No form data is sent, stored or logged by the app. Required text is checked after trimming. Details remain in the current page memory until navigation/reload.

## Content boundaries

The Pilot Plant landing page is implemented from AK_Pilot plant.pdf and linked from homepage slide five and the footer. Its five-field form uses the existing enquiry draft/review flow. The Custom Manufacturing landing page is implemented from the supplied PDF, with supplied SVG icons, eight technology cards, five technical support capabilities and a 1–35 mt scale-up range. Homepage slide three and the footer link to it. Both landing pages use the supplied Drive metadata. Product-inner structures, technical grades, brochure files, brand film, Career destination and enquiry recipient remain pending. Available product information is shown in a dialog with a contact action; no detailed product pages have been invented. The two banner articles use the full supplied Google Docs copy in structured editorial pages; their SEO metadata and available publication date come from the source documents. News uses labelled update placements until source copy is supplied. The quality section uses supplied certification logos and Shell award artwork. Certification artwork retains supplied dates and reference text.

Draft content is noindex. Before any future launch, complete the content review, delivery integration, legal wording, original artwork and production metadata/indexing review. The Cloudflare Worker is a review deployment; draft content remains noindex.

## Assets and sources

- The five original JPGs are copied byte-for-byte from `design-reference/supplied-assets/` into `public/images/hero/`; they are used by the homepage hero and relevant article covers.
- Official white KLK OLEO logo and Poppins font files reuse the adjacent local Agrochemicals project's assets.
- Contact banner reuses the Agrochemicals reference image. The Products archive and category banners use the exact background images from the revamped main-site project.
- Header LinkedIn: `https://www.linkedin.com/company/klkberhad/`.
- Footer LinkedIn: `https://www.linkedin.com/company/klk-oleo-surfactants/`.

The complete source/content record is in `docs/superpowers/specs/2026-11-06-surfactants-design.md`. Large design exports, supplied source documents, screenshots and `design-qa.md` remain in the local workspace and are excluded from Git. All assets needed to run the website are versioned under `public/`.

## Cloudflare Worker

- Account: Eason CF Main (`e7c515dde995479daacd82ad79dfc3e8`).
- Worker: `klk-oleo-surfactants` (separate from the main website).
- Runtime: Next.js with the OpenNext Cloudflare adapter, static asset and Images bindings.
- Run `npm run build:worker`, then `npm run deploy` using an authenticated Wrangler session.
- Run `npm run cf-typegen` after changing bindings; generated types and build output are ignored.
- The root URL redirects to `/surfactants`. Contact enquiries still use the review/download flow; email delivery is not configured.
