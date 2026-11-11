# Cloudflare deployment

Account: Eason CF Main (`e7c515dde995479daacd82ad79dfc3e8`).
Worker: `klk-oleo-surfactants`.
URL: https://klk-oleo-surfactants.easondev.workers.dev/surfactants

Deployed application source: `9e0cc46`.
Cloudflare version: `2a657d83-13c2-4a57-88c0-61bc4455c42e`.
Deployed 11 November 2026; 100% traffic on this version.

## Commands

```sh
npm ci
npm run lint
npm test
npm run build:worker
npx wrangler deploy --dry-run
npm run deploy
```

Run `npm run preview:worker` to serve the existing Worker build locally, or `npm run dev` for normal Next.js development. Generated bundles, bindings types, local secrets and screenshots are ignored by Git.

## Verification

Lint, type checking, 4 tests, Worker build and deployment dry run passed. Live HTTP checks passed for the root redirect, Home, Products, all 3 category pages, Markets, News, Contact, product search and image optimisation. Browser verification found no broken images, horizontal overflow or console errors on Home.

## Review scope

The site remains noindex/nofollow. Contact requests use the existing draft/download flow and do not send email. Deferred special landing pages and remaining content approvals are still pending. No custom domain or existing main-site Worker was changed.

The dependency audit reports transitive build-tool advisories in glob/minimatch and ESLint dependency chains. The current supported OpenNext adapter is retained; npm's suggested adapter downgrade was not applied.

The banner article update imports both supplied Google Docs into static editorial pages. Live checks passed for both article routes, banner and related-reading navigation, complete source paragraph counts and unknown-article HTTP 404 handling. Desktop and mobile layouts passed without overflow.


Pilot Plant landing page deployed from application commit `37630d5`. Live HTTP 200 and browser checks passed at `/surfactants/pilot-plant`; homepage and footer links resolve to the page. PDF content includes all seven reaction families, ten licensed raw-material entries, all four reactor specifications and qualified Kosher/Halal wording. Local draft review, desktop and mobile layouts verified. Lint, typecheck, four tests and final Worker build passed.


Custom Manufacturing landing page deployed from application commit `91dccfa` in version `7d5aa2b2-0b48-48cf-ad85-9c8d9eb03f23`. Live homepage slide three navigation and route HTTP 200 passed; supplied icon instances loaded without failures and the exact supplied description is present. Desktop/mobile overflow checks, enquiry draft review, lint, type checking, four tests and Worker build passed. Both manufacturing pages now use metadata from the supplied Drive document.


Pilot Plant reference-motion refinement deployed from `2235c45` as `528df596-36d4-4611-acad-b63d47a6e0e5`. Eight interactive cards use vertical panel reveals and staggered entrance; project support matches the centred Oriental Biotech process treatment. Live expanded card state, revealed description, eight-card count, centred support and no horizontal overflow verified. Mobile keyboard/pointer behavior, source wording, lint, typecheck, four tests and Worker build passed. Local development server restarted after production build.


Portfolio autoplay and category heading update deployed from `ce813c9` as `da5de557-c682-4ec1-b43f-e45adce7841f`. Autoplay no longer pauses on pointer hover; keyboard focus and reduced-motion preferences remain respected. Live Products headings verified as Anionic, Cationic and Nonionic with identical 410px top positions and 50px heading boxes at the review viewport. Lint, typecheck, four tests and Worker build passed.


Homepage FAQ update deployed from `31413db` as `d27ed641-0bdd-46a4-9fc4-548c4aadb556` on 11 November 2026. User confirmed use of the supplied document despite its Agrochemicals title. Live readback verified all eight question texts and 21 answer paragraphs in source order, native accordion interaction and no horizontal overflow. Mobile wrapping, lint, typecheck, four tests and Worker build passed.


News dual filters deployed from `9e0cc46` as `2a657d83-13c2-4a57-88c0-61bc4455c42e`. Live verification confirmed exact category/market options, Articles -> one result, combined Agrochemicals -> empty state, and reset -> four updates. Existing posts have no confirmed market tags and are therefore visible only under All markets. Mobile layout, six tests, lint, typecheck and Worker build passed.
