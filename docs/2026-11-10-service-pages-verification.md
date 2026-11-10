# Service pages verification

10 November 2026 — implementation on codex/surfactants-drive-content, baseline 76f2987.

## Delivered

- /surfactants/custom-manufacturing and /surfactants/pilot-plant use static Astro sections, the shared header/footer, existing typography/colour system and responsive layouts. The enquiry form remains a React island using the existing private intake.
- A constrained Service pages collection contains two fixed entries. Headings, copy, lists, statistics, reactor details, support imagery, project-form text and SEO are editable; native draft preview, publication, unpublication and revision restoration work.
- Hero slides 3/5 and footer quick links follow published service availability. Home content is not rewritten. Source-only hero photography remains reserved.
- All PDF sections/technical values and the five image-based Manufacturing support descriptions are represented. Both SEO titles/descriptions match the fetched source document. Source editorial/typographic treatment and asset hashes are documented in docs/2026-11-10-service-page-sources.md and docs/service-page-assets.json.

## Verification

- 22 unit/integration tests passed. The installer creates/publishes only new entries, preserves edited drafts/unpublished/trashed entries on rerun, leaves Home/brands untouched, and enforces fixed identities and safe images.
- Full browser suite: 48 passed, 24 intentional duplicate CMS/API skips outside desktop. It covers desktop/tablet/mobile source content, SEO, navigation, enquiry anchors, review/send/receipt, published/draft isolation, Editor preview/publication/revision restore/unpublication and route/new-entry restrictions.
- Astro type checking: 87 files, zero errors/warnings/hints. ESLint and final production Node build passed. The existing native admin bundle-size warning remains informational.
- Source PDF tiles and final desktop/mobile screenshots were visually inspected. The initial screenshot order was corrected to capture before anchor scrolling, so sticky headers appear at the top of full-page captures. No product change was needed for that artifact.

One independent read-only review found four Important issues: MCP slug-only updates and native duplicate paths bypassing beforeSave, nullable repeaters causing a 500, and cleared send labels losing their accessible name. It also identified advertised row fields without rendered output; that was regraded Important because client edits would silently do nothing. Each issue received a failing regression before its fix. The full suites passed afterward; no outstanding review findings remain.

Fixed-route guards cover REST and authenticated MCP slug/duplicate requests. MCP tests use the supported OAuth device flow and a scoped disposable Editor token; no real account or token is used. Null repeaters render as empty lists, blank/null/whitespace send labels fall back to “Send enquiry”, numbered rows render their optional labels/images, and technology/material schemas expose only the names their layouts display.

## Real local installation

The application was stopped before the private database/media snapshot .backups/pre-service-pages-2026-11-10. The native transactional installer reported imported:2. Both new entries are published; all original 43 entries retain their exact table fingerprints. There are now 45 published baselines across eight collections, with the original unpublished Sustainability revision intact.

All 17 protected table fingerprints match before/after, covering existing content, users, passkeys, token/authentication records and private enquiry storage. One real account and one credential remain. SQLite integrity check reports ok. No existing source entry, real enquiry, user or credential was changed.

The review server was restarted on localhost:4371. Both page routes and Home return 200. Live HTML assertions verified every source row title/description, supplied SEO, noindex, project enquiry anchors, and both hero/footer destinations. Automated enquiry submissions used disposable databases only.

## Decisions and limits

- The explicit Proceed instruction authorizes both pages and local review publication; no repeated design approval was requested.
- Dedicated fixed templates were chosen over service-only fields on the four archive Pages or an arbitrary block builder. Cost: future service layouts require agency template/schema work.
- No hero photograph was reused or new photo invented. Optional introduction images remain editable for later approved assets.
- Existing enquiry fields/consent/review/receipt are retained rather than introducing a second intake model. Cost: the wireframe's single Name becomes the existing First/Last Name fields and Country remains required.
- Supplied certification/licensing/chemical claims are retained as local review copy, pending final approval. This work does not independently certify those claims.
- Reviewer exclusions were resolved by source SEO comparison and executor-run real-state checks; external delivery and Cloudflare verification remain deferred.

External notifications are still unconfigured. The site stays noindex; hosting, final content approval and client Editor invitations remain separate tasks. No automatic remote push or deployment is part of this service-page change.
