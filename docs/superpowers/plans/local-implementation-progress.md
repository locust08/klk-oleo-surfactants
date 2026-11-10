# Local implementation progress — 2026-11-06-local-nextjs-implementation.md

Task 1: complete. Next.js 16.3.6 / React 19.2.8 matches adjacent Agrochemicals. Unit tests cover product-only matching, mixed case, blank/no matches and catalogue navigation. All 25 brands retained. Five copied hero assets checked byte-identical to originals.

Task 2: complete. Shared shell, exact five heroes and full homepage. Reviewer identified light-image control contrast and shared hover/focus state; both corrected. Browser verified green controls on the light slide and no auto-advance with selector keyboard focus after more than 7 seconds. Mobile header search moved to a readable full-width row. FAQ uses library chevron icons.

Task 3: complete. Archive/listings/Markets/News/Contact/Search routes implemented. Browser verified search-to-brand navigation, 3 archive boxes, 12 Anionic brands, all 25 carousel entries, mobile menu, FAQ collapse, news filter and Escape dismissal. Contact whitespace-only names/message rejected, valid local draft reviewed/downloaded and edit preserved values. No transmission endpoint exists.

Task 4: complete. Final production build (including TypeScript), lint and 4/4 unit tests passed. HTTP checks returned 200 for all 9 content/search route variants. Desktop/tablet/mobile comparison and interaction checks passed for the agreed local-preview scope; final browser error count was zero. The detached development server remains running on 127.0.0.1:3000, with the localhost homepage marked as the user-facing browser deliverable. Full evidence and pending content are recorded in design-qa.md. No push or deployment.

Rulings: user-requested Next.js supersedes Product Design Vite starter. New repository has no initial commit, so no linked worktree was created; work stays on codex/surfactants-local. No implicit design-file commit, push, deployment, provisioned service or enquiry transmission.

Review: fresh read-only reviewer found no critical runtime defect. Two important hero accessibility findings fixed; minor whitespace validation fixed as well. Pending content and local-only contact delivery are intentional scoped limitations.

## 10 November 2026 homepage updates
- Replaced help icons with supplied SVG artwork and the award placeholder with the supplied Shell artwork.
- Matched the live Agrochemicals Product Finder centred, scaled card carousel; all 25 brands rotate with manual selection, pause on hover/focus and reduced-motion support.
- Replaced certification text with nine supplied logos in a continuous looping strip, with pause and reduced-motion support. Artwork dates and reference text are preserved.
- Linked Home Care, Beauty and Lubricants to main-site market pages; Agrochemicals retains its minisite URL. No dedicated Textile & Leather market page is listed, so its card links to the relevant main-site IMBENTIN brand page instead.
- Local changes only; no push or deployment in this update.

## Products alignment with main revamp
- Reused the exact products-background.jpg and palmerol-background.jpg assets from the main-site project.
- Matched centred archive introduction, translucent category cards, category descriptions and links, plus listing banner and sidebar proportions.
- Retained the three surfactant categories, original surfactants introduction and brand catalogue, header-only product search and Agrochemicals-style navigation.
- Production build and lint passed; desktop category navigation and mobile single-column layout verified.

## Hero alignment with main revamp
- Kept all five supplied Surfactants images and text. Matched the main hero radial overlay, image scale/fade, text reveal, bottom-left composition and centred dot navigation. Rotation uses the main reference 5.5-second interval and 600ms transition.
- Replaced hero CTA treatment with the PDF slide 6 leading circled arrow and outlined divided button. Removed hero playback control.
- Retained reduced-motion and keyboard-focus handling. All five mobile slides fit without overflow; lint and production build passed.

## Cloudflare deployment preparation
- Target: new klk-oleo-surfactants Worker in Eason CF Main; no custom-domain changes.
- Updated Next.js and ESLint configuration to 16.4.6 for OpenNext Cloudflare 1.20.16 compatibility; Wrangler 4.159.0.
- Added reproducible Worker build/deploy scripts, account-pinned configuration, Images/Assets/self bindings, observability and static asset caching. Generated output and local secrets stay excluded.
- Lint, type checks, 4 catalogue tests, Worker build and Wrangler dry run passed. Local Workers-runtime smoke checks returned HTTP 200 for Home, Products, category listing, Markets, Search, Contact and image optimisation.
- npm audit reports transitive build-tool advisories (glob/minimatch and ESLint dependency chains); no forced adapter downgrade was applied.

## Banner article pages from Google Drive
- Added static editorial routes for A Century of Surfactant Excellence and Sustainability in Action, using the supplied native Google Docs as sources. Metadata is separate from displayed article blocks.
- Preserved all 8 centenary paragraphs/8 headings and 13 sustainability paragraphs/7 headings. Corrected only the source missing space in "Surfactantsis". Kept the supplied 10 June 2026 centenary publication date; no sustainability date was invented.
- Banner and News & Media Read More links now open full articles. Added relevant cover images, section navigation, milestone subheadings, expansion target cards and related reading.
- Banner retains sharp images and existing transitions; improved headline wrapping and keyboard focus styling.
- Local production build, lint and four existing tests passed. Both banner navigation flows and mobile article layout verified without overflow.


## Pilot Plant landing page — 10 November 2026

Implemented `/surfactants/pilot-plant` from AK_Pilot plant.pdf with branded hero, proof points, three scale-up stages, reaction families, licensed raw materials, four reactor specifications, operating standards, three project-support steps and a five-field enquiry draft. Homepage slide five and footer now link directly to it. Uses existing supplied plant and tank photos; reference screenshots guide card and process layouts. The form retains the existing local review/download behavior; no email backend is configured. Verified homepage navigation, draft review, desktop and 390px mobile layouts without horizontal overflow.


## Custom Manufacturing landing page — 10 November 2026

Implemented `/surfactants/custom-manufacturing` from Custom manufacturing.pdf and the supplied Drive folder. Includes eight technology cards, source benefit copy, four supplied-icon promises, collaboration narrative, four production stages, four commitments, five technical/operational support cards, 1–35 mt scale-up range and five-field project draft form. PDF editorial note excluded from public copy. Supplied SVG variants retained under public/images/custom-manufacturing. Slide three and footer now link to the page, with a related Pilot Plant link. Applied exact Custom Manufacturing and Pilot Plant meta titles/descriptions from the supplied metadata document. Desktop/mobile layout, draft review and navigation checked; email backend remains unconfigured.
