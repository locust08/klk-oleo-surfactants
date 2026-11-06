# Local Next.js implementation

User authorised implementation after choosing option 3. Run locally only; do not push, deploy, provision services or send enquiries. The design specification in `docs/superpowers/specs/2026-11-06-surfactants-design.md` controls source copy and scope. Use Next.js App Router, TypeScript, React and the Poppins/font/logo assets from the adjacent Agrochemicals project. User-requested Next.js supersedes the Product Design Vite starter.

Work in this project directory on `codex/surfactants-local`. The repository has no initial commit, so a linked worktree cannot be created; preserve all existing design files and do not commit them implicitly.

## Task 1 — catalogue and local app foundation

- Add package/config files, local fonts and official logo, preserve the original hero assets.
- Add meaningful tests for product-only search (brand/descriptor/category, mixed case, blank and unmatched query, no article matches).
- Implement typed catalogue and source content in `src/lib/catalog.ts` and `src/lib/content.ts`.
- Verify search tests, then use the catalogue as the single source for listings and header results.

## Task 2 — shared shell and full homepage

- `src/components/site-header.tsx`: two-tier header, three-category Products menu, mobile menu, product-only search, active states and Escape handling.
- `src/components/site-footer.tsx`: shared enquiry banner, exact supplied footer copy, distinct header/footer LinkedIn destinations and corporate legal links.
- Homepage components: exactly five hero assets, timed/manual/pause/reduced-motion controls; intro and capabilities; help columns; 25-brand carousel; five markets; video placement; quality feature; news; FAQ.
- Pending article/product-inner/special-page actions use honest accessible information dialogs and a contact action rather than broken URLs or invented full pages.

## Task 3 — main page routes and interactions

- Root redirects to `/surfactants`; route group under `/surfactants` supplies the shared shell.
- Products archive: exactly Anionic, Cationic, Nonionic boxes; only shared-header search.
- Category pages: brand-led panels, three categories, descriptors where supplied. No invented grades or product-inner route.
- Product search results: URL query, matched brand/category/descriptor, clear empty and no-match states.
- Markets: five cards; confirmed Agrochemicals URL, unresolved destinations offer contact instead of guessed links.
- News: four category filters; known article previews and clearly labelled pending content.
- Contact: source fields, native validation and accessible consent; local-only review/download flow, explicitly no transmission.
- Metadata: exact Home and Markets title/description, draft pages noindex locally, robust 404.

## Task 4 — verify and leave localhost running

- Run unit tests, TypeScript, ESLint and production build.
- Start local Next.js server on an available port, bound to localhost. Keep it alive after handoff.
- Inspect rendered desktop/tablet/mobile via the in-app browser; test hero controls, menus, search, catalogue navigation, news filters, FAQ and contact validation/review.
- Save comparison screenshots, record design QA and remaining content dependencies. Run a fresh reviewer for material implementation issues.
- Return local URL, concise validation summary and pending-content limits. No push or deployment commands.

## Review focus

Search must never include news; all five heroes must use the correct supplied files; category ordering must be Anionic/Cationic/Nonionic; preserve SYMPARE and flagged source spellings in the editorial record; avoid inventing product-inner content or sending a contact enquiry; check long navigation labels and mobile overflow; hide autoplay motion under reduced motion and allow pause.
