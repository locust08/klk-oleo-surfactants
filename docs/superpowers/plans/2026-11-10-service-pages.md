# Service pages implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline, with one fresh-context final review.

**Goal:** Build source-complete, EmDash-editable Custom Manufacturing and Pilot Plant pages.
**Architecture:** One fixed Service pages collection, native publication/preview, two Astro templates sharing section components, existing enquiry island and published-only navigation availability.
**Tech Stack:** Astro, EmDash 1.4.0, React ContactForm, SQLite, TypeScript, Playwright.
**Spec:** docs/superpowers/specs/2026-11-10-service-pages-design.md

## Global constraints

- Preserve the existing design, route structure and five hero-only images; no invented copy/claims/photos.
- Preserve real Admin/passkey/enquiries and the private inbox boundary; back up before installation.
- Editors self-publish constrained content; layouts/schema/routes remain agency controlled.
- Publish only newly imported service entries locally. Reruns preserve later edits and unpublished/trash states. Existing Home/Sustainability data remain untouched.
- Keep noindex, no external delivery/deployment/automatic push.

## Review focus

- Import reruns after editorial draft/unpublish/trash must not replace or republish records.
- Native preview and unpublication must behave consistently for detail routes and hero/footer links.
- Fixed service identities must be protected on new records, data route changes, slug-only REST writes and native publication.
- All source sections, technical values and image-based Manufacturing support text must survive editable rendering.
- Embedded forms must retain existing consent, review, persistence, receipt and private inbox behavior.

## Task 1: Source, constrained schema and safe installation

Files: src/cms/service-content.json, service-seed.ts, service-import.ts; scripts/import-services.ts; seed.ts, content-policy.ts, plugin.ts, middleware.ts; tests/services.test.ts; source/asset provenance docs.

Interface: buildServiceSeed() supplies one collection and two source drafts; installServicePages(db,{publishNew:true}) uses native applySeed/content publish in one transaction and skips existing source keys. CLI requires a fresh backup path.

- [x] Write tests for two constrained editable drafts, fixed-route/new-entry denial, source values, native installation/publication and rerun preservation after edits/unpublish/trash. Run and observe RED.
- [x] Implement source manifest, schema, importer, policies and raw-asset derivatives. Expected: only two service entries added; existing content/private state untouched.
- [x] Run npm test; expected full unit suite green.

## Task 2: Astro pages, published navigation and embedded enquiry

Files: dynamic service route, service section/template components/styles; published.ts/types.ts; hero-slider.tsx/site-footer.tsx; ContactForm optional project copy; tests/browser/services.spec.ts; test-server fixture.

Interface: SiteData.servicePages holds published route/title pairs only; page route obtains native getEmDashEntry(service_pages,slug). Structured sections use ServicePageData. ContactForm adds optional initialMessage/submitLabel while preserving its shared API flow.

- [x] Add failing browser assertions for source sections/SEO, working hero/footer anchors and form review/send/receipt, mobile layout, Editor preview/publication/restoration, unpublished 404/link removal and reserved route denial. Observe missing routes RED.
- [x] Implement static Astro sections using existing visual tokens and only the enquiry React island. Add published availability mapping to existing hero/footer without mutating Home.
- [x] Run focused browser checks on desktop/tablet/mobile; expected green, then inspect screenshots.

## Task 3: Verify, apply and document

- [x] Run complete unit/browser suites, typecheck, lint and production Node build; expected all green.
- [x] Get one fresh read-only review of the whole change from baseline 76f2987. Fix important findings with RED→GREEN regressions.
- [x] Stop real server, fingerprint protected tables/content, snapshot and install two local pages, restart and verify public routes/assets/navigation plus unchanged protected state.
- [x] Update README/provenance/verification/Notion; commit on current local branch and leave review site running.
