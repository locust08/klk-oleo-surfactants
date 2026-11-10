# Cloudflare deployment

Account: Eason CF Main (`e7c515dde995479daacd82ad79dfc3e8`).
Worker: `klk-oleo-surfactants`.
URL: https://klk-oleo-surfactants.easondev.workers.dev/surfactants

Deployed application source: `2235c45`.
Cloudflare version: `528df596-36d4-4611-acad-b63d47a6e0e5`.
Deployed 10 November 2026; 100% traffic on this version.

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
