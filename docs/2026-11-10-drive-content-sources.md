# Surfactants Drive content integration

Source snapshot reviewed 10 November 2026. The bounded implementation uses the existing content records and public routes. Supplied marketing claims are retained for local editorial review; all pages remain noindex.

| Content | Source | Local treatment |
| --- | --- | --- |
| Century | [Article document](https://docs.google.com/document/d/1CpPLdeaDBM8_TPUUYuLt7PnETYUk5NkM/edit) | Full body, supplied title/SEO and explicit post date 10 June 2026; publish locally |
| Sustainability | [Article document](https://docs.google.com/document/d/1VA5oZB8RhHrdcQ2M1dbHTf9veHOgXNbO/edit) | Full body/title/SEO staged as a native draft revision; source has no explicit publication date, so the public summary remains unchanged and detail route returns 404 |
| News archive | [Copy and metadata](https://docs.google.com/document/d/1huAw2bdZ3ei2hg-JjlqCsgQ3YY98ehTF/edit) | Supplied introduction and SEO in existing News & Media Page |
| Shell artwork | [Supplied JPG](https://drive.google.com/file/d/1Qpt6_rXoKNqM6v5OzlNgf4yj6KxXVE1m/view) | Original file at public/images/quality/shell-mvps-2025.jpg; alt text identifies the Shell Chemicals and Refining 2025 MVPs Awards programme. The artwork itself does not establish a Gold award |
| Help icons | [Source folder](https://drive.google.com/drive/folders/13l9Dex4MyDGflEvr4qkwTHAPePpOUe8I) | Four supplied green SVG variants converted with sharp to transparent PNGs, maximum 192 × 192 pixels, original aspect ratio and colour retained. Optional CMS image fields let editors replace them |

The source's joined word “Surfactantsis” is corrected where present; otherwise supplied article prose and claims are preserved. Article photographs remain unassigned because they duplicate the hero-only images. Existing Home copy and any already assigned artwork/icons are retained. Renamed help-card headings require manual mapping before import.

The source manifest is src/cms/drive-materials.json. Assets and source/output SHA-256 hashes are recorded in docs/drive-content-assets.json. No authenticated temporary download URLs are retained.

Still pending: Sustainability date, final certification artwork/currency, FAQ adaptation, news category/market-filter reconciliation, Custom Manufacturing/Pilot Plant templates, and the gated multi-document Downloads workflow. This integration does not extend those scopes.
