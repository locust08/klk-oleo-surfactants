# Surfactants Astro and EmDash Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Preserve the Surfactants frontend in Astro, then provide EmDash editing and durable private enquiries under the approved administration model.

**Architecture:** One Astro SSR application with reusable React components, local SQLite/media and native EmDash integration. A server-side content adapter provides typed props to the UI. A private enquiry extension stores operational records outside public content.

**Tech Stack:** Astro, React, TypeScript, EmDash 1.4.0, Node, SQLite; Playwright for real browser checks.

**Spec:** `docs/superpowers/specs/2026-11-10-surfactants-emdash-design.md`, approved by the user's 10 November instruction to proceed with frontend migration followed by the proposed administration model.

## Global Constraints

- Preserve current design, public `/surfactants` routes, 25 brands, five markets and five hero slides.
- Exactly Anionic/Cationic/Nonionic; product-only header search; deferred content remains deferred.
- Agency Admin; client Editor can self-publish; enquiries Admin-only.
- Drafts are excluded from anonymous public queries. Seed/import is rerunnable without overwriting edits.
- Local Node/SQLite first. No remote push, deployment, live service changes, invitations or external email.
- Keep passwords, tokens, databases, uploads and build output out of Git.

## Review Focus

- Hydration retains hover/focus/reduced-motion pausing, keyboard dialogs and responsive navigation.
- Empty/malformed search and invalid category/article routes remain bounded and safe.
- A draft edit cannot leak through list queries, preview, media assumptions or UI fallbacks.
- Direct API/MCP requests enforce role boundaries as strongly as admin UI links.
- Retried enquiries persist once; failed storage never produces a success receipt; notifications have distinct state.

## Task 1: Astro frontend parity

**Files:** `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/layouts/`, `src/pages/`, `src/components/`, `tests/browser/`, `playwright.config.ts`.

**Interfaces:** Existing `Product`, `categories`, `searchProducts`, `productPath` remain the initial source. UI components accept serializable props when later connected to the CMS.

- [x] Capture baseline route/interaction expectations and desktop/mobile screenshots with the Next.js application.
- [x] Add browser assertions for all current routes, archive counts, search anchors, carousel/menu/dialog/FAQ interactions and local enquiry review; run against baseline.
- [x] Configure Astro SSR and React; port routes/layouts and replace Next-specific APIs, retaining assets/CSS.
- [x] Run the same checks in Astro; verify unknown routes return 404 and metadata/noindex remain correct.
- [x] Save the tested frontend milestone on the migration branch.

## Task 2: EmDash administration and content

**Files:** `src/cms/`, `.emdash/seed.json`, `scripts/import-content.ts`, `src/lib/cms-content.ts`, content-consuming routes/components, `tests/cms*.test.ts`.

**Interfaces:** `loadSiteContent()` produces the site's published view models; authenticated EmDash preview can supply staged content. `importSourceContent()` creates missing source-keyed drafts and preserves edits.

- [x] Write integration tests for source counts/slugs, rerun preservation, draft/public isolation, publication and revisions; observe missing-CMS failure.
- [x] Integrate released EmDash with SQLite/local media and typed schema/content queries.
- [x] Define Home, Brands, Markets, News, FAQs, Pages and Site content; enforce singleton/route identity and safe destination constraints.
- [x] Import supplied content as drafts and connect UI props to server-side content models without anonymous draft fallback.
- [x] Verify real agency Admin/client Editor roles through API and browser sessions, including denied administrative operations.
- [x] Verify preview, publish and revision restoration with disposable test content; save the CMS milestone.

## Task 3: Private enquiry intake and agency inbox

**Files:** `src/enquiries/`, `src/pages/api/enquiries.ts`, thank-you route, `src/components/contact-form.tsx`, `tests/enquiries*.test.ts`.

**Interfaces:** `acceptEnquiry(request)` validates and persists once; private inbox operations require an authenticated Admin. The public result exposes a receipt, not stored personal data or routing details.

- [x] Write failing tests for required fields, consent, idempotency, throttling, request size, origin checks, persistence failures and denied inbox reads.
- [x] Implement durable plugin storage, bounded same-origin intake, honeypot, server routing and separate notification state.
- [x] Connect the form to real intake and add truthful confirmation/error states; keep external email disabled.
- [x] Provide an Admin-only inbox in EmDash; test direct API and UI access with Admin, Editor and anonymous actors.
- [x] Run complete enquiry/role suite and save the intake milestone.

## Task 4: Final verification and handoff

**Files:** `README.md`, `.env.example`, local setup/backup scripts, verification evidence and progress ledger.

- [x] Run full tests, type checking, lint and production Node build.
- [x] Run desktop/tablet/mobile browser checks, including CMS publish/preview/revision and the complete enquiry path.
- [x] Exercise backup/restore using disposable local data; document first-admin setup and client invitation without sending invitations.
- [ ] Request one fresh whole-branch code review; fix material findings with regression tests.
- [ ] Report working local URLs, verification results, external-delivery/hosting dependencies and any material limitations.

## Execution rulings

- User explicitly approved execution and sequencing; execute directly without repeating the plan-approval question.
- Managed worktree creation did not return or create a checkout. Work on `codex/surfactants-astro-emdash` in the separate clone; baseline is `16c7b3b` and adjacent KLK applications remain untouched.
