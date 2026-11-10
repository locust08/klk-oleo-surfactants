# Surfactants migration verification — 10 November 2026

The separate Surfactants clone now runs as one Astro + EmDash application on branch `codex/surfactants-astro-emdash`. The baseline Next.js revision remains `16c7b3b`; adjacent KLK applications were not changed. No remote push or deployment was performed.

## Evidence

- Unit/integration suite: **15 passed**. Includes real SQLite seed imports, editor-change and slug-rename preservation, `.env` selection through the actual CLI, URL/structured-content validation, native media resolution, enquiry concurrency/idempotency/throttling/storage failures, and database/media backup recovery.
- Browser suite: **21 passed**, **12 intentional skips**. Public interactions run at desktop, tablet and mobile sizes; CMS/API workflows run once on desktop rather than repeating identical operations per viewport.
- Real Editor workflows verify draft isolation, signed preview, publication, revision restoration, native media uploads, published image/PDF rendering, denied schema/users operations, fixed-page creation/identity/slug restrictions and denied private inbox access.
- Enquiry tests verify persistent storage, duplicate protection, invalid origins/oversize input, Admin inbox UI, Editor/API denial, exact consent capture, notification preview and verified receipts.
- Astro check: **0 errors, warnings or hints**. ESLint and standalone Node production build passed.
- Production dependency audit: **0 vulnerabilities** after applying the compatible Zod 4.6.7 override. This statement covers production dependencies.
- Production HTTP checks: Surfactants 200; invalid category/article 404; development login 403; anonymous private inbox 401. Draft source records are absent from public HTML.
- Original desktop/mobile screenshots were captured before migration and compared with Astro. The preserved design uses the existing CSS, fonts and versioned assets.

The final local database contains 43 source drafts, zero real accounts and zero enquiries. Publication remains a human content-review step. Browser test publication/accounts/enquiries are confined to temporary databases.

## Independent review and fixes

One fresh-context whole-branch review identified five Important findings. All five were addressed in one fix pass; no Critical or Minor findings were reported.

1. Normalized local media has no `src`. Added storage-key/id resolution through EmDash's public-media resolver, with actual image/PDF upload → save → publish → public-render tests. The browser test failed before the fix and passed afterward.
2. Native repeater choices require top-level `options`; nested size/MIME rules are incomplete. Corrected the supported field shape and added server validation, including server-verified local MIME types. Invalid structured saves failed the regression test before the fix and are now rejected.
3. Native `unique` field metadata does not enforce singleton identities. Reserved Home/Site/Pages creation is restricted to import; identities/source keys are immutable in save policy; REST slug-only writes are guarded; publication policy protects fixed canonical slugs. Direct Editor regression tests cover the boundaries.
4. Import previously ignored `.env`. Configuration loading now honors `.env` and explicit environment overrides. The actual import command was tested against an alternate database.
5. Native seed matching uses mutable slugs. Import now recognizes persisted source keys before native conflict handling. Brand/news rename-and-rerun tests preserve both count and editorial changes.

A browser navigation race was also exposed during the full run: the test started a second navigation before its preceding category link finished loading. The test now waits for that navigation; the final full suite passed.

## Decisions and their costs

- The managed worktree operation did not complete. Work continued on a dedicated migration branch inside the separately cloned repository. Cost: isolation is provided by that clone/branch, rather than another worktree.
- Execution continued inline under the user's explicit approval, with one final independent review. Cost: there were no intermediate approval checkpoints.
- Country labels use a deterministic snapshot because Node and Chrome returned different Intl names. Cost: labels require deliberate updates rather than automatically following runtime locale data.
- React controls briefly disable until hydration completes. Cost: a short initial disabled state avoids lost early clicks.
- Brand preview aliases redirect ordinary requests to category anchors because EmDash URL patterns do not interpolate arbitrary category fields. Cost: those aliases add a redirect and need consideration in the eventual production SEO review.
- EmDash has no per-page role option for plugin navigation. Editor access is denied before loading enquiry data at both page and API layers. Cost: an inaccessible Enquiries navigation item may remain visible to Editors.
- Draft-only development databases were preserved under ignored `.backups/` before importing corrected schemas, after verifying there were no accounts, enquiries or publications. Cost: retained local recovery snapshots consume disk space; no editorial data was overwritten.
- Zod is overridden to compatible patched 4.6.7 because EmDash 1.4.0 pins vulnerable 4.5.4. Cost: future dependency upgrades must reverify this override.
- Fixed templates are managed through import and server policies rather than relying on unenforced unique-field metadata. Cost: adding another fixed page/template requires agency code/schema work.
- Native programmatic slug-only writes do not invoke EmDash's data-save hook. REST guards reject fixed-route slug edits; native publication checks reject changed canonical slugs, and public Home/Site selection uses immutable identity. Cost: a programmatic draft rename must be corrected before publication.

## Delivery boundaries

Cloudflare hosting, external email/CRM delivery, final content/legal/indexing approval, real agency account enrollment and client invitations remain deliberately outside this local implementation. Enquiries are stored for manual agency handling, with notification status `not-configured`. First-admin passkey setup, source draft review/publication and eventual delivery/hosting configuration are documented in `README.md`.
