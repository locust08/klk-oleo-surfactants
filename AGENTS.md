# Surfactants application

This is the separate Surfactants Astro + EmDash application. Keep changes inside this repository; adjacent KLK applications have independent data and configuration.

Before changing content, permissions or enquiries, read `docs/superpowers/specs/2026-11-10-surfactants-emdash-design.md` for the approved boundaries and administration model. Read `README.md` for local setup and data operations.

Public UI reads published EmDash content through `src/cms/published.ts`. Source snapshots in `src/lib/content.ts` and `src/lib/catalog.ts` are import inputs, never anonymous draft fallbacks. Keep test publication and authentication inside disposable databases.

Client Editors can self-publish content; Agency Admins alone can manage users, schema, plugins and the private enquiry inbox. Store enquiry data in private plugin storage, with receipt-only public responses.
