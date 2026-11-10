# Cloudflare deployment

Account: Eason CF Main (`e7c515dde995479daacd82ad79dfc3e8`).
Worker: `klk-oleo-surfactants`.
URL: https://klk-oleo-surfactants.easondev.workers.dev/surfactants

Deployed application source: `718ca80f71e55c07ce355a871efb76eed51978af`.
Cloudflare version: `8462f3e9-1e4a-41d9-b7f3-7a83fff4eefc`.
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
