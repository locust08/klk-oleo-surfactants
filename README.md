# KLK OLEO Surfactants — Astro + EmDash

One Astro SSR application with React islands and EmDash 1.4.0. The migration preserves the supplied Surfactants design, responsive navigation, five hero slides, 25 brands across three categories, product search, markets, news filters, FAQs and contact review. SQLite and uploaded media are local; other KLK applications are independent.

## Local setup

Use Node 24.13+ or 26 and npm. Node's built-in SQLite is used by backup utilities.

```sh
npm ci
cp .env.example .env
npm run cms:seed
npm run dev
```

Open [Surfactants](http://localhost:4371/surfactants) and [EmDash administration](http://localhost:4371/_emdash/admin/). Use this exact localhost origin: passkeys require a domain rather than an IP address. The configured site URL also controls same-origin enquiry validation and authentication links. `/` redirects to `/surfactants`.

The importer creates **43 drafts**: Home (1), Brands (25), Markets (5), News (2), FAQs (5), Pages (4), Site content (1). Anonymous visitors only see published content, so a new installation initially shows an awaiting-publication message. Review and publish the imported entries in EmDash to make the design/content visible. Preview drafts from EmDash before publishing. The browser suite publishes its own disposable fixture; it never publishes the local editorial database.

`npm run cms:seed` matches immutable import source keys before using `--on-conflict skip`; rerunning preserves editorial changes even after a brand, market or article slug is renamed. Source snapshots in `src/lib/content.ts` and `src/lib/catalog.ts` are import inputs. They are never public draft fallbacks. Schema changes after initial installation require a reviewed EmDash schema migration; rerunning the seed is not a schema update or a backup.

## Supplied Drive content

After reviewing/publishing the baseline, stop the application and apply the bounded source update:

```sh
npx astro dev stop
npm run cms:materials -- --backup .backups/NEW-PRE-MATERIALS-SNAPSHOT
npm run dev
```

This local SQLite command creates the required database/media backup, adds optional News SEO and Home help-card image fields, and updates existing records through native EmDash revisions in one transaction. It publishes the Century body with the supplied 10 June 2026 date, the News archive introduction/SEO, and supplied homepage artwork/icons. Sustainability's full body/title/SEO stay in an unpublished revision until its date is confirmed; its existing public summary stays live and its detail route returns 404. Review that draft from **News → Sustainability → Preview**, then set the approved date before publishing.

The import refuses pre-existing editorial drafts and does not create accounts or change enquiries. Completed source versions are skipped on reruns, preserving later changes. It requires the established entry slugs; renamed entries or help-card headings require agency mapping before the first materials import. Existing assigned Home artwork/icons are preserved. Keep the application stopped during the command; a new backup directory is required on every invocation. If any entry fails, all schema/content/receipt changes roll back together; the backup remains available.

Source references, asset treatment and deferred content decisions are recorded in [Drive content sources](docs/2026-11-10-drive-content-sources.md). These are local review publications, pending final content approval.

## Administration

Complete EmDash's first-site setup as the agency owner: enter the site title, keep “Sample content” to retain the imported drafts, then create the agency account and register a passkey. Keep the development server bound to loopback; EmDash includes development-only authentication helpers, used solely with disposable automated fixtures in this repository. Production builds disable those helpers.

- **Agency Admin:** native Admin role; full content, users, schema, plugins/settings and private enquiry inbox.
- **Client Editor:** native Editor role; edit, preview, publish and restore revisions for all Surfactants content; no users, schema, plugins/settings or enquiry records.

After the agency account is configured, create/invite the client with **Editor** in the native Users screen. An actual invitation, email delivery setup and passkey enrollment are deliberate account setup steps; this migration sends no invitations or external email. Roles apply to this entire instance. Future KLK main/agrochemical applications need separate instances or a separately designed shared administration model.

Home, Brands, Markets, News, FAQs, Pages and Site content appear under Surfactants. The importer owns Home, Site content and the four fixed Pages. Save policies reject extra entries and identity changes; route guards reject slug edits and publication checks also protect native programmatic writes. Page SEO, optional approved PDFs/artwork, destinations, CTA/footer and consent text are editable. Brand preview aliases render category previews; normal brand URLs redirect to the corresponding category anchor. Article URLs become public when published content includes an approved body and date.

The **Enquiries** plugin page is accessible to Admins. EmDash may display its navigation item to Editors, but both the page and direct API enforce denial; personal data is never loaded for Editors. No enquiry MCP tools or public content collections are registered.

## Enquiries

The contact flow validates → reviews → sends → shows a verified receipt. It stores enquiries durably in private EmDash plugin storage, with product context and the exact published consent text. Same-intent retries return one receipt; changed payloads cannot reuse it. Intake enforces same-origin requests, size/field limits, a honeypot and a persistent ten-per-ten-minute IP throttle. Storage failure never produces a success confirmation. Public receipts expose existence only, with no contact details.

The agency handles the private inbox manually. Each record includes a plain-text notification preview and `notificationStatus: not-configured`. Email/CRM delivery is **not connected**, and the thank-you page confirms storage only. A reverse proxy must supply trustworthy client IP information according to EmDash's trusted-proxy configuration before internet deployment; do not blindly trust forwarded headers.

## Verification

```sh
npm test
npm run typecheck
npm run lint
npm run test:browser
npm run build
npm audit --omit=dev
```

Browser tests use a separate temporary SQLite database, genuine Admin/Editor sessions and synthetic enquiries. They cover desktop/tablet/mobile interactions, draft isolation, preview/publish/revision restoration, denied Editor administration, duplicate intake, inbox authorization and receipt verification. Google Chrome is used by default; set `PLAYWRIGHT_CHANNEL` to another installed Playwright browser channel if needed. Local test sessions/screenshots stay in ignored `.superpowers/`.

`npm start` runs the built standalone Node server. Configure `EMDASH_DATABASE_URL`, `EMDASH_UPLOADS_DIR` and `EMDASH_SITE_URL` **before building**; the Astro integration embeds adapter configuration. Start the server with the same working directory and writable persistent database/uploads locations. Build output does not contain a database or uploads. The local Node implementation is complete; a Cloudflare adapter/storage migration is separate work.

EmDash pins an older Zod transitively. The package override selects compatible patched Zod 4.6.7; the production dependency audit is clean with this lockfile. Keep that override reviewed during upgrades.

## Backup and restore

Backups include the entire SQLite database (content/revisions, accounts/authentication and private enquiries), uploaded files, and a checksum manifest. Versioned original assets remain in `public/`. Treat snapshots as confidential; store an encrypted off-device copy and keep environment secrets separately. Filesystem session storage is not included; users may need to sign in again after restoration.

Stop application writes first so database and media represent the same editorial point. In development, stop an Astro daemon with `npx astro dev stop`; stop a foreground server with Ctrl+C. Then:

```sh
mkdir -p .backups
npm run cms:backup -- .backups/NEW-SNAPSHOT-NAME
npm run cms:restore -- .backups/NEW-SNAPSHOT-NAME .backups/NEW-RESTORE-NAME
```

Both destination directories must be new. Restore validates checksums and SQLite integrity and creates `data.db` plus `uploads/` in the new directory; it does not replace the running application's files. To test recovery, configure a separate `.env`/checkout to use those restored absolute paths, build/start it on a loopback port, and verify content, media and Admin inbox before any deliberate cutover. Never restore over the active database or copy a live WAL database with a plain file copy.

## Content and launch boundaries

Custom Manufacturing/Pilot Plant source PDFs and metadata are supplied, but their templates/routes remain deferred. Detailed product grades, approved brochures, Sustainability's publication date, brand-film footage, unconfirmed market/Career destinations and enquiry recipients remain pending. FAQ adaptation, archive category/market filters and gated multi-document Downloads need separate decisions. Supplied certification assets require currency/applicability approval; certification names remain text references. All pages remain `noindex,nofollow` pending content/legal/production SEO review. No push, deployment, real invitations, CRM changes or external email were performed.

Approved implementation scope: `docs/superpowers/specs/2026-11-10-surfactants-emdash-design.md`. Original design/content record: `docs/superpowers/specs/2026-11-06-surfactants-design.md`.
