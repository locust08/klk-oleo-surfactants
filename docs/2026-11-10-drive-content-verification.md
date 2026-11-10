# Drive content verification

10 November 2026 — local Surfactants review application, baseline commit 358ba09.

- 19 unit/integration tests passed, including native revision import, additive schema upgrade, rerun preservation, all-entry preflight and deliberate unpublish → discardDraft preservation.
- 30 browser checks passed across desktop, tablet and mobile; 12 duplicate CMS/API checks intentionally skipped outside desktop. Century hero link/body/date/SEO, private Sustainability preview, public draft isolation, source artwork/icons, archive copy, responsive layout, permissions, publication/revisions and enquiry receipt/inbox behavior passed.
- Astro type checking, ESLint and Node production build passed. Existing native admin bundle size warning remains informational.
- One independent read-only review found an unpublished-status edge case. The regression failed before the fix and passed after the published-baseline guard; the whole unit/browser suites passed afterward. No outstanding Critical, Important or Minor findings.
- The first full browser startup timed out under concurrent host load. A diagnostic rerun started normally; a complex existing inbox check then exceeded its 30-second total budget while hydrating two native CMS sessions. Its budget is now 60 seconds, with every authorization assertion retained; the final full suite passed.

## Local application

Application writes were stopped before the required pre-import snapshot at .backups/pre-drive-materials-2026-11-10. The offline command applied three published revisions (Century, News archive Page, Home) and one unpublished Sustainability revision in a single SQLite transaction. No records were added or removed.

All 43 baseline entries remain published: Home 1, Brands 25, Markets 5, News 2, FAQs 5, Pages 4, Site content 1. Sustainability retains its old published summary with no live body/date and one new draft revision. Century's source date is 10 June 2026.

Before/after fingerprints for users, credentials and private plugin storage match exactly: one account, one credential, no stored enquiries. SQLite integrity check reports ok. No authentication helpers or automation credentials were used against the real database.

The development server was restarted at localhost:4371. Public HTTP checks confirmed Home, Century and News archive return 200; Sustainability detail returns 404. Live HTML checks confirmed the complete Century body/SEO, supplied archive introduction, four help icons, descriptive Shell artwork alt, noindex, and absence of the private Sustainability body. Mobile screenshot inspection confirmed the help grid and award section retain their layout.

## Decisions and limits

- “Proceed” authorizes the stated first Drive content integration priority; no repeated planning gate was added.
- Sustainability stays in a native draft until an explicit publication date is confirmed. Cost: its full article remains unavailable publicly meanwhile.
- Article photographs duplicate the hero-only images and remain unassigned. Cost: article detail has no featured image in this phase.
- Existing Home artwork/icons and wording are preserved. Supplied icon mapping uses original help-card titles; renamed titles require manual mapping. Cost: a changed homepage may require agency mapping before its first import.
- Review scope exclusions were independently checked by the implementer: source paragraphs match fetched Drive originals with zero omitted body lines, real private state fingerprints match, and the full responsive browser suite passed.
- The 60-second inbox test budget accommodates two fresh CMS hydrations; it may report a failure later than before.

Certification artwork/currency, FAQ adaptation, archive taxonomy/market filtering, Custom Manufacturing/Pilot Plant templates and gated Downloads remain separate work. Local publication is for editorial review; shared hosting, external notifications, client invitations and final launch approval remain pending. The existing local branch and checkout are retained; nothing was pushed or deployed.
