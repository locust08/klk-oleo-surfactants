# Drive content integration implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans task-by-task.

**Goal:** Integrate supplied articles, archive text and homepage assets into the local EmDash review site.

**Architecture:** An idempotent offline agency import stages native revisions with optimistic preconditions and publishes only source-complete entries. Additive schema fields feed the existing Astro templates.

**Tech Stack:** Astro, React, EmDash 1.4.0, SQLite, TypeScript, Playwright.

**Spec:** docs/superpowers/specs/2026-11-10-drive-content-design.md

## Global Constraints

- Preserve the existing design, slugs, 25 brands, five hero slides and private enquiry boundary.
- Publish Century with source date 2026-06-10. Keep Sustainability body/SEO in a draft revision without inventing a date or exposing it publicly.
- Back up real data; preserve users, credentials, enquiries, existing editor drafts and later changes on reruns.
- Retain local-only noindex. No external messages, deployment or credentials created.

## Review Focus

- A rerun preserves editorial changes and refuses pre-existing unpublished revisions.
- Native revisions keep Sustainability source text out of anonymous HTML/search.
- Additive schema changes preserve current content and media references.
- SEO and article links only use published data; missing source dates never become fabricated dates.
- Supplied assets retain layout fit, accurate alt text and safe static rendering.

## Task 1: Source manifest and safe revision import

Files: src/cms/drive-materials.json, src/cms/material-patches.ts, src/cms/material-import.ts, scripts/import-materials.ts, src/cms/seed.ts, tests/material-import.test.ts.

Interface: applyMaterials(db, patches) applies validated per-entry data via RevisionRepository.create, ContentRepository.replaceDraftRevision and native handleContentPublish; returns applied/skipped receipts. Refuse existing drafts; atomic staging must check current version. ensureMaterialSchema adds only the optional SEO/help image fields.

- [x] Add a disposable SQLite test: save two source bodies, publish Century, retain Sustainability live summary and stage its body, preserve revisions and skip later edits on rerun. A separate case refuses an existing editor draft.
- [x] Run and observe missing importer failures.
- [x] Implement native schema/revision import, source manifest and CLI with backup-before-write and no authentication helpers.
- [x] Run integration tests; verify date, body, public snapshot, unchanged record counts and rerun preservation.

## Task 2: Content rendering and supplied assets

Files: src/cms/types.ts, published.ts, seed.ts, src/components/home-page.tsx, news-cards.tsx, src/pages/surfactants/news-media/[slug].astro, src/styles/globals.css, public/images/quality/, public/images/icons/, tests/browser/materials.spec.ts.

- [x] Add failing browser assertions for Century article body/date/SEO and working hero link, missing-date Sustainability public 404 plus authorized full preview, published homepage artwork/icons and supplied archive introduction/metadata.
- [x] Wire optional SEO/help image fields, replace outdated pending-source wording, use source asset derivatives with provenance and accurate alt text.
- [x] Apply the same import to disposable browser fixtures; run the article/preview/media checks at desktop/tablet/mobile sizes.

## Task 3: Apply locally and verify handoff

- [x] Run full unit/browser suites, typecheck, lint and Node production build.
- [x] Stop real development writes, snapshot database/media, apply the tested import, restart localhost and verify real public output and draft isolation.
- [x] Request one fresh-context read-only review of this change range; fix important defects with regressions.
- [x] Update README and Notion integration status with precise remaining items and source links; preserve local account/session access.
