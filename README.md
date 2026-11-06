# KLK OLEO Surfactants

Local Next.js 16 App Router implementation of the selected option 3 design. TypeScript, React 19, locally hosted Poppins fonts and `react-icons`. No deployment configuration, remote services or email integration is enabled.

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
- Five homepage hero images in the supplied order, numbered selectors, previous/next, pause, reduced-motion handling and independent hover/focus pausing.
- Complete homepage section sequence, 25-brand carousel, five markets, quality/film placements, four news categories, five FAQs and the shared two-part footer.
- Products archive with exactly Anionic, Cationic and Nonionic category boxes; brand-led category listings and anchored search results.
- Our Markets, News & Media, Contact and product-search routes; exact supplied Home and Markets metadata.
- Honest local contact review/download flow. No form data is sent, stored or logged by the app. Required text is checked after trimming. Details remain in the current page memory until navigation/reload.

## Content boundaries

Custom Manufacturing and Pilot Plant Special Landing Pages remain deferred. Product-inner structures, technical grades, brochure files, article bodies/dates, award/certification artwork, brand film, four market destinations, Career destination and enquiry recipient remain pending. Available product information is shown in a dialog with a contact action; no detailed product pages have been invented. The two supplied article titles/summaries are previews, not fabricated full articles. News uses labelled update placements until source copy is supplied. Certification names are textual references, not recreated certification marks.

Draft content is noindex. Before any future launch, complete the content review, delivery integration, legal wording, original artwork and production metadata/indexing review. No push or deployment was performed for this task.

## Assets and sources

- The five original JPGs are copied byte-for-byte from `design-reference/supplied-assets/` into `public/images/hero/`; they are used only by the homepage hero.
- Official white KLK OLEO logo and Poppins font files reuse the adjacent local Agrochemicals project's assets.
- Contact banner reuses the Agrochemicals reference image. Two main-site product reference images are retained locally for future content review, but are not used to replace the approved text-led archive layout.
- Header LinkedIn: `https://www.linkedin.com/company/klkberhad/`.
- Footer LinkedIn: `https://www.linkedin.com/company/klk-oleo-surfactants/`.

The complete source/content record is in `docs/superpowers/specs/2026-11-06-surfactants-design.md`. Large design exports, supplied source documents, screenshots and `design-qa.md` remain in the local workspace and are excluded from Git. All assets needed to run the website are versioned under `public/`.
