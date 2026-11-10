# Surfactants Astro and EmDash application design

10 November 2026 · Asia/Kuala_Lumpur · Proposed implementation design

## Intent and accepted direction

Build the Surfactants site as one Astro application with its own EmDash administration interface. The user selected this approach after considering a shared Payload backend, separate EmDash instances, and a Next.js-to-EmDash API bridge. Surfactants is the first implementation; corporate and Agrochemical migration are later projects.

Retain the selected Corporate continuity design, supplied assets, public route structure, and source-content boundaries from `2026-11-06-surfactants-design.md`. The purpose of this change is to make the existing site manageable by client editors through a working CMS. A redesign is outside this change.

The stack and Surfactants-first scope are user decisions. The administration defaults, local runtime, content-model details, and enquiry boundary below are proposed implementation decisions for review.

## Approaches

| Approach | Trade-off | Decision |
| --- | --- | --- |
| Shared Payload backend with the existing Next.js frontend | Reuses KLK access controls but keeps the earlier CMS platform | Superseded by the user's EmDash choice |
| Next.js frontend with a separate EmDash service | Preserves framework code but adds an API, preview and cache integration | Not selected |
| One native Astro and EmDash application | Uses native content queries, administration and preview; requires porting the Next.js shell and routes | Selected by the user |

One instance represents Surfactants only. Do not add tenant permissions or a network administration interface. Future corporate and Agrochemical content will require a separate decision about shared editor access.

## Administration model

| Actor | EmDash role | Capabilities |
| --- | --- | --- |
| Agency maintainers | Admin | Site configuration, content schemas, plugins, accounts, backups, permanent deletion, content publication, and the private enquiry inbox |
| Client content team | Editor | Edit, publish, unpublish and trash Surfactants content; manage its media, taxonomies and menus; inspect revisions and previews |
| Visitors | Anonymous | Read published content and approved public media; submit validated enquiries when intake is enabled |

The proposed client role permits self-publication. It is not an agency-approval workflow. Stock EmDash Contributor/Author ownership rules do not supply an all-content, draft-only editor role, so do not promise that workflow without a separately designed extension. Editors are not limited to selected collections within this instance. Role checks must be enforced on the server, including direct API and MCP access; hidden navigation is not an access boundary.

Account signup is invite-only after initial setup. Use EmDash's supported passkey-first authentication. Real users and external invitations are not created or sent during local implementation. Document the human first-admin setup and subsequent Editor invitation steps. Local automated role tests use isolated accounts and an ephemeral test database, never production credentials or password resets.

Agency controls layout markup and styling in code. Clients edit constrained text, imagery, approved links, ordering within repeaters and approved content structures. Native EmDash menu/taxonomy controls remain available to Editors. This phase does not add an arbitrary visual layout builder or a custom admin shell.

## Application and routes

Use Astro server rendering with EmDash in the same application, database and media runtime. Keep React for existing interactive components where practical; replace Next-specific image, link, navigation, metadata and layout APIs. Keep established CSS and local Poppins/brand assets. Add EmDash field annotations where compatible to enable its native editing and preview experience.

Retain `/surfactants`, `/surfactants/products`, all three `/surfactants/products/{category}` listings, `/surfactants/our-markets`, `/surfactants/news-media`, `/surfactants/contact`, and `/surfactants/search?q=...`. `/` redirects to `/surfactants` during this standalone first phase. News detail routes may be added under `/surfactants/news-media/{slug}` for complete approved articles. Add a real thank-you route only for successfully persisted enquiries. Invalid category/article paths return 404.

Use the supported `/_emdash/admin/` and `/_emdash/api/` prefixes. Do not mount the CMS beneath `/surfactants` or assume its admin prefix can be reconfigured. Keep public canonical paths at `/surfactants` and prevent preview or admin URLs from becoming canonical content URLs.

## Content model

Use stable collection and field identifiers, generated TypeScript declarations, field validation and supported schema export/seed mechanisms. Group content clearly in the standard admin. Repeated content belongs in structured repeaters or relationships rather than arbitrary JSON text fields.

| Collection | Stored content and constraints |
| --- | --- |
| Home | One fixed-slug record for the existing homepage: three to five ordered hero slides; intro; statistics; capabilities; help cards; portfolio copy; market introduction; partner/video section; quality/award/certification content; news and FAQ introductions |
| Brands | The existing 25 provisional brand names, stable slug, exactly one category from Anionic/Cationic/Nonionic, optional descriptor and summary, order, optional approved image/file relationships and provenance |
| Markets | The five supplied markets, stable slug, title, description, approved overlay choice, order and optional confirmed destination |
| News | Title, stable slug, one of Exhibition/Product/Corporate/Sustainability, summary, optional image, approved publication date and structured article body |
| FAQs | Question, answer and display order |
| Pages | Fixed route identity, existing template, heading, introduction and SEO fields for archive, markets, news and contact pages |
| Site content | One fixed-slug record for shared CTA/footer copy, approved public contact details and links; no recipients, credentials or operational secrets |

Enforce singleton and fixed-route identities on the server so generic API/MCP calls cannot create competing Home/Site content records or change reserved public routes. Keep page layout templates in code. Require safe internal/anchor or HTTP(S) destinations; reject script and data URLs. Enforce practical field lengths and image/file MIME constraints on saves, not only in the browser.

Hero link kinds must distinguish article references, internal paths/anchors, external URLs and deferred destinations. Publishing a related record does not automatically publish an article or invent a pending destination. Render public links only where their required content and destination exist.

Product names remain brand-led. The archive retains three boxes without a second search interface; product-only header search queries published Brands and excludes news. Existing anchors and category order are preserved. Product-inner pages, technical grades, sample/cart flows, Custom Manufacturing and Pilot Plant remain deferred.

## Import and publication

Create a rerunnable import from the existing TypeScript content and versioned public assets, using stable source keys. Initial import creates draft CMS records and preserves editorial changes on reruns. Never fabricate article bodies/dates, product descriptions, certificate artwork or brochure files.

Ordinary public queries read only published records. Keep the current draft site noindex and preserve original metadata copy. Authenticated preview uses EmDash's draft preview flow; do not implement an anonymous fallback that exposes draft database records. Give reviewers a documented local preview/setup workflow. Use temporary published fixtures for automated public-route checks. Publishing source content and enabling production indexing require a later content review.

Preview-only placeholders can preserve the current layout where content is unavailable, but production links and download buttons require complete approved targets. Model missing optional media without a fabricated asset. Public upload URLs must not be treated as a private document access mechanism: only approved public marketing media belongs in CMS media storage for this phase.

## Enquiry intake and inbox

Replace the draft-download-only form with durable intake and an agency-only inbox, implemented through supported EmDash plugin facilities. Preserve the current form fields and requiredness: first name, last name, company, country, email and message required; job position and website optional. Preserve the message length checks and record the displayed consent wording, consent timestamp and optional published-brand context.

Store enquiries in private plugin storage, not ordinary searchable content collections. Each successful submission returns a non-sensitive receipt only after persistence. Enforce bounded request sizes, server-side validation, safe same-origin submission, a honeypot, durable throttling and an idempotency key. The endpoint accepts fixed, server-resolved routing only. Visitors and Editors cannot list, inspect, export or mutate enquiries through any UI, API or MCP path. Every inbox endpoint performs an Admin authorization check.

Local intake may persist an enquiry for manual agency handling without claiming that email was delivered. Show the receipt/thank-you state after successful storage; record notification state separately in the inbox. Implement local captured-notification verification and truthful failure states. Recipient, provider credentials and final consent wording are still missing, so external delivery stays disabled and is a later configuration/verification step. No real email, invitation, CRM sync or test enquiry to an external recipient is included.

## Runtime and delivery boundary

Build and verify locally with Astro's Node adapter, SQLite and local media storage. Pin compatible released dependencies and commit the lockfile during implementation. Keep databases, uploads, secrets and generated build output ignored. Use supported APIs and plugin extension points rather than editing EmDash internals.

Cloudflare Workers with D1/R2 remains the intended later hosting option, not a provisioned environment in this phase. Native plugin code, throttling and storage choices must avoid unnecessary Node-only dependencies; actual Worker build/deployment verification belongs to the later Cloudflare setup. Local success does not establish Cloudflare compatibility.

Use an isolated branch/worktree for the migration and retain the current Next.js revision for comparison. Do not alter the adjacent corporate/Agrochemical Payload application or its database. No remote push, deployment, DNS change, production import or external messaging is part of this implementation.

## Verification and acceptance

The implementation is complete when all current in-scope routes run in Astro, content comes from EmDash, the administration model is enforced, and the application has a documented local startup/setup path.

Verify the following through focused tests and browser checks:

1. Draft saves do not change public output; preview shows the draft; publication updates public output; revision restoration works.
2. Editor can edit/publish content but cannot change schemas/users/plugins/system settings, permanently delete entries, or access enquiries. Exercise direct endpoints as well as the UI.
3. Anonymous users cannot read drafts, revisions or enquiries; public search includes only published brands.
4. The importer preserves 25 brands, five markets, five hero slides, three category orderings and all established slugs, without overwriting later edits.
5. Valid enquiry persists once under retries; invalid/spam/oversize/rate-limited input is rejected; failed persistence never produces a success receipt; notification failures remain distinct from saved leads.
6. Desktop, tablet and mobile retain the current design, navigation, search, carousel controls, dialog/FAQ behaviour, accessible focus and reduced-motion handling.
7. Type checks, lint, meaningful tests and a production Node build pass; local database/media backup and restore is documented and exercised with disposable data.

## Builder discretion and approval

The implementer may choose compatible released versions, component boundaries, schema field spelling, local test fixtures, test tooling and internal view-model helpers. Preserve the user-visible behaviour and administration boundary above.

Review decisions: client Editors may self-publish across the Surfactants instance; the enquiry inbox is agency Admin-only; the first delivery is local Node/SQLite; external notification and Cloudflare deployment are later steps. These decisions require review before implementation.

## Primary references

- [Original Notion brief](https://app.notion.com/p/4104fcc4f70180b49090cb2d3822fedd)
- [EmDash architecture](https://docs.emdashcms.com/concepts/architecture/)
- [EmDash role and authentication model](https://docs.emdashcms.com/guides/authentication/)
- [Collections and fields](https://docs.emdashcms.com/concepts/collections/)
- [Preview and visual editing](https://docs.emdashcms.com/guides/preview/)
- [Existing Astro project setup](https://docs.emdashcms.com/existing-project/)
- [Private plugin storage](https://docs.emdashcms.com/plugins/creating-plugins/storage/)
- [Native admin extensions](https://docs.emdashcms.com/plugins/creating-native-plugins/react-admin/)
- [REST API and authorization](https://docs.emdashcms.com/reference/rest-api/)
- Repository research: `docs/research/2026-11-10-emdash-multisite-feasibility.md`.
