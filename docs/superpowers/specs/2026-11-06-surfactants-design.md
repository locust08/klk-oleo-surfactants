# KLK OLEO Surfactants — minisite design and content plan

Design-stage draft · 6 November 2026 · Asia/Kuala_Lumpur

Status: user selected final displayed **option 3 (Corporate continuity)** on 6 November 2026. Detailed page-layout drafts follow this direction. This is a planning and design deliverable, not an implemented or published website. Special Landing Pages are deferred. Product-inner content and structure require client clarification.

## 1. Intent and source precedence

Create a coherent KLK OLEO division minisite that helps formulation and procurement teams understand surfactant capabilities, browse products by category and brand, explore five markets, and contact the team.

The user's direct instructions and subsequent answers control scope. The supplied slide PDF and Markets document supply content and design references; their embedded notes are treated as source requirements to reconcile, not independent permission to publish, invent claims, submit forms, or expand scope. Proposed decisions are labelled below. Nothing here approves final scientific claims or missing copy.

Sources inspected:

- `Surfactants SiteMap and Content R1.pptx.pdf`, 29 pages, supplied local PDF. Text extracted throughout; visually reviewed layout-specific slides. Rendered pages and extracted text are in `design-reference/`.
- Supplied sitemap PNG; used alongside PDF page 4, not as the only source.
- Five supplied photographs: reserved exclusively for the five homepage hero slides per the user's clarification. No reuse as section or inner-page images is assumed.
- [Agrochemicals](https://www.klkoleo.com/agrochemicals): header, hero, product structure, Contact page, and footer inspected.
- [Approved global prototype Products](https://klk-oleo-main.easondev.workers.dev/products), its Anionic listing, homepage, and News & Events page inspected.
- [Live corporate site](https://www.klkoleo.com/): corporate identity reference, previously inspected.
- [Our Markets document](https://docs.google.com/document/d/11tddVrFdAId9Zf4Q1bsaAlka3NBvW58b/edit): successfully fetched through Google Drive. It is a stored DOCX file; content below preserves its text.
- The slide's old Figma design reference is explicitly superseded on slide 23 by “SKIP FOLLOW KLK MAIN SITE FORMAT”; it is not an additional design dependency.

## 2. Fixed direction and approaches

The mandated combination is the Agrochemicals shell with the approved global prototype's colour system and product presentation. A new brand direction or the Agrochemicals filter-heavy catalogue would contradict the brief.

Within that shell, three homepage studies explore hierarchy only:

1. Corporate continuity: photographic hero, centred introduction, clear statistics and compact capability columns.
2. Editorial expertise: the same five-slide hero, a split introduction and lighter dividers, with more emphasis on readable technical narrative.
3. Integrated capability: the same shell and hero sequence with stronger mint and green section grouping and a clearer portfolio entry point.

Selected direction: Corporate continuity, chosen by the user as final displayed option 3. Any carousel artwork in an early study is illustrative: the exact five hero assets and the confirmed product-only header search remain mandatory. Detailed copy and the full section sequence in this document override omissions or paraphrases in raster visual studies.

The earlier concept files are saved in `design-concepts/` in displayed order: 01 = Editorial expertise, 02 = Integrated capability, 03 = Corporate continuity. The user selected 03; do not reinterpret that as the third approach in the exploratory list above. Detailed selected-direction screens are in `design-concepts/selected-03/`. The developed upper-homepage screen replaces the earlier concept's extra-dot control with five numbered selectors and restores the capability statements and portfolio introduction. Raster copies are review illustrations, not source assets or approved final copy.

## 3. Site architecture and scope

Base URL: `https://www.klkoleo.com/surfactants`.

| Destination | Proposed path / target | Current scope |
|---|---|---|
| Home | `/surfactants` | Full design, all sections below |
| Products archive | `/surfactants/products` | Exactly 3 category boxes |
| Anionic listing | `/surfactants/products/anionic` | Brand-led listing template |
| Cationic listing | `/surfactants/products/cationic` | Same template |
| Nonionic listing | `/surfactants/products/nonionic` | Same template |
| Brand detail | `/surfactants/products/{category}/{brand}` | Main-site visual reference only; structure/content pending client |
| Our Markets | `/surfactants/our-markets` | Five market boxes and supplied copy |
| Sustainability | `https://www.klkoleo.com/sustainability-principled-by-integrity/` | External corporate destination, no duplicate page |
| News & Media | `/surfactants/news-media` | Archive and article design templates |
| Contact Us | `/surfactants/contact` | Agrochemicals contact layout adapted to Surfactants |
| Header product search | `/surfactants/search?q=…` | Proposed results route; product-only scope confirmed |
| Custom Manufacturing | Target pending later brief | Deferred Special Landing Page |
| Pilot Plant | Target pending later brief | Deferred Special Landing Page |
| Career | Destination pending | Footer link only; no new career page assumed |

Route names beyond `/surfactants` are proposals, not client-approved redirects. Do not derive current destinations by guessing URLs.

Home navigation proposal: Home, Products, Our Markets, Sustainability, News & Media, Contact Us. The original sitemap supplies these sections. The Agrochemicals “About Us” navigation item is not copied as a new page: About Us remains a homepage section unless requested otherwise.

Market cards point to relevant market landing pages. Only Agrochemicals has a confirmed destination. Other market landing-page builds are not silently included; final destination mapping is required.

## 4. Shared header

Use the Agrochemicals two-tier structure, proportions, alignment, and behaviour, adapted to the longer Surfactants menu.

- Top corporate strip: deep green, official white KLK OLEO logo linking to `https://www.klkoleo.com/`; LinkedIn icon at right linking to `https://www.linkedin.com/company/klkberhad/`.
- Main row: pale translucent background over the hero; solid readable background when needed on scroll. Division label `KLK OLEO | Surfactants`. Per PDF page 2, KLK OLEO links to the global site and Surfactants links to the minisite homepage; use two real links, not one ambiguous clickable label.
- Products menu can expose the three categories. Preserve the brief's order: Anionic, Cationic, Nonionic.
- **Confirmed by user:** shared header search searches products only. Visible label or placeholder: “Search products”. Search stays in the header on the Products archive; there is no separate archive search block or filter panel.
- Proposed search matching: approved brand names and approved product descriptors, not news or site-wide content. Search results show category, brand, descriptor and a relevant destination. Empty, no-match, keyboard and mobile states require design and implementation checks. Do not invent technical search facets.
- No commerce checkout is authorised. Agrochemicals has a request-cart icon; retain its header visual language but omit a cart from the proposed Surfactants design until a sample/request workflow is confirmed. This is a proposed scope choice, not an instruction to remove an existing feature.
- Mobile: collapse menu to labelled menu button; search remains available in the expanded panel or as a labelled trigger. Keep all six destinations reachable; test the longer menu rather than compressing it into illegible desktop text.

## 5. Visual system

Use the approved global prototype as the controlling colour reference. The live main site's `#166936` is close but is not the final controlling green for this brief.

| Token | Value | Use |
|---|---|---|
| Primary | `#016836` | Brand, headings, main actions |
| Primary hover / active | `#015E31` / `#01532B` | Interaction states |
| Dark | `#014E29` | Dark panels |
| Deep | `#002F18` | Hero contrast, footer family |
| Lime | `#79B829` | Restrained arrows and highlights |
| Mint | `#E6F0EB` | Product panels and quiet section backgrounds |
| Subtle mint | `#D9E8E1` | Secondary grouping |
| Border | `#B0D0C1` | Dividers and fields |
| Teal | `#008995` | Secondary brand accent |
| Pink | `#E11282` | Existing brand accent only, used sparingly if needed |
| Main text / secondary | `#212529` / `#414141` | Readable body copy |
| White | `#FFFFFF` | Main surface and inverse text |

Typography: Poppins throughout, matching Agrochemicals and the approved prototype. Do not mix Open Sans from the older live site into the new division design. Proposed desktop hierarchy: hero 56–64 px, page title 48 px, section title 36–44 px, brand title 28–32 px, body 16 px with 1.6–1.8 line height, labels 12–14 px. Mobile: hero 32–40 px, section titles 28–32 px, body 16 px. Actual wrapping must be checked with the longest labels and real copy.

Use real official logos, separate approved market photography, and supplied hero photographs. No invented seals, chemistry diagrams, product packs, or certification artwork. Rounded images about 15 px follow Agrochemicals; product mint panels use restrained 8–12 px corners. Normal text groups use spacing and dividers rather than nested cards. Keep photography recognisable under green contrast overlays.

Desktop design target 1440 px wide; also plan 768 px tablet and 390 px mobile. Proposed content gutters 48–60 px desktop / 20–24 px mobile, with comfortable line lengths and 64–88 px major section spacing. These are designer proposals, not measurements from a formal brand manual.

## 6. Homepage: complete section sequence

### 6.1 Hero slider — exactly five supplied images

All five JPGs are homepage hero assets, in this exact order. They are not supporting section photographs. Preserve the sharp original pilot-plant image; the blurred preview in the PDF does not authorise blurring the supplied photo.

| Slide | Heading | Supporting copy | Asset | Destination |
|---|---|---|---|---|
| 1 | 100 YEARS | A Century of Surfactant Excellence. | `1. 100 years together.jpg` | Article “1. A Century of surfactant excellence.docx” — file not yet supplied |
| 2 | SUSTAINABILITY IN ACTION | 20% more capacity and 30% less CO₂ emissions. | `2. Sustainability in action.jpg` | Article “2. SUSTAINABILITY IN ACTION 20% more capacity and 30% less CO₂.docx” — not yet supplied |
| 3 | CUSTOM MANUFACTURING THAT BRINGS YOUR IDEAS TO LIFE | Scale-up, quality, and long-term capacity built around your needs. | `3. Custom manufacturing.jpg` | Deferred Custom Manufacturing Special Landing Page |
| 4 | OUR MARKETS | High-impact surfactants for every market we serve. Designed for performance, built for reliable scale-up. | `4. Our markets.jpg` | Homepage `#markets-we-serve`, not the Markets archive |
| 5 | FROM LAB IDEA TO 1,000 KG BATCH | Our pilot plant bridges the gap between R&D and full-scale production. | `5. FROM IDEA TO 1 ,OOO KG BATCH.jpg` | Deferred Pilot Plant Special Landing Page |

Use readable white copy with a dark green local overlay for slides 1, 2 and 5. Slide 3 needs a stronger text-side overlay over reflective tanks; slide 4 naturally has light negative space at left and can use green copy. Plan individual mobile focal points: protect the historic subject, globe at right, tank detail, product cluster and plant footprint. If image and text cannot coexist clearly on mobile, stack copy on a solid brand surface rather than hide the image subject.

Five visible selectors, previous/next, clear current position and pause control. Proposed auto-advance 7 seconds, paused on hover/focus; reduced-motion users get manual movement. All copy remains selectable HTML in eventual implementation, not text baked into the photos. Reserve CTA destinations in the content model; no dead public links or fabricated pages. CTA visibility for unavailable destinations is a launch content decision.

### 6.2 About Us — Global Surfactant Manufacturer and Supplier

Use the corrected heading spelling “Manufacturer”; the slide contains a typo. Supplied body:

> Oleo-based, synthetic, and biodegradable surfactant solutions for customers worldwide, backed by 100 years of expertise, integrated oleochemical strength, and manufacturing in Europe and Asia.

Page 11's visual content adds details that text extraction partly misses:

- 100+ — Years of surfactant expertise.
- 100+ — Countries supplied.
- 7 — Surfactants manufacturing sites in Europe and Asia.
- Global manufacturing — Produced in Switzerland, the Netherlands, Belgium and Malaysia.
- Scale-up support — From lab trials to industrial production.
- Custom manufacturing — Tailored surfactants and customer-specific solutions.
- Sustainable choices — Oleo-based options, RSPO and ISCC PLUS certifications.

Plan a short introductory block, three numerical proof points and four supporting capability statements. Treat all figures and certification statements as supplied draft claims needing client validation before launch, not independently verified facts.

### 6.3 How Can We Help

Four columns on desktop, two on tablet, stacked on mobile; use consistent sourced/library icons.

1. **Improve supply flexibility** — with production in Europe and Asia and efficient regional logistics.
2. **Reduce scale-up risk** — with application support from first lab trials to industrial production.
3. **Speed up approvals and audits** — with responsible sourcing, certifications, and documentation support.
4. **Avoid supply risk** — with diversified manufacturing capacity across Europe and Asia or Malaysia.

The last wording is unresolved in the slide: “Asia or Malaysia” is visibly a draft alternative. Proposed client-facing revision: “across Europe and Asia”; keep the original in the change register until confirmed.

### 6.4 What We Produce — Surfactants Portfolio

> KLK OLEO Surfactants supplies global customers with non-ionic, anionic, and cationic surfactants, including ethoxylated and alkoxylated surfactants, tailored specialty surfactants, and custom chemical manufacturing solutions.
>
> Use our Product Explorer to navigate our diverse portfolio and identify the best fit for your application.

Follow PDF page 13's horizontal brand-card carousel. Each card: line 1 category, line 2 **brand name**, line 3 approved descriptor. Retain all 25 rows from page 14 (inventory below), even though a visual study only previews a few. Desktop shows approximately 3–5 cards with next/previous; mobile shows one main card and a visible next edge. Navigation and keyboard access must expose every brand. Include a clear Products link. “Product Explorer” is the supplied label, not permission to build a new faceted application.

### 6.5 Markets We Serve

> Oleo-based and synthetic solutions for key industries where performance and reliability matter. Functions include wetting, foaming, emulsifying, cleaning, dispersion, and stability, designed to deliver consistent results at scale.

Five boxes in the sitemap's order: Home Care and I&I Cleaning; Beauty & Personal Care; Agrochemicals; Lubricants & Metalworking Fluids; Textile & Leather. Preserve all five. Use separate market images to be sourced, not the five hero JPGs. For each card use the supplied description in section 9. Link Agrochemicals to the confirmed minisite and mark other market URLs pending. Homepage slide 4 scrolls to this section.

### 6.6 Your Partner of Choice for Surfactants

> KLK OLEO is one of the worlds' largest vertically integrated oleochemicals manufacturers, giving you direct access to oleochemical and its derivative products, raw material security, global production capacity, and consistent supply.

Propose grammatical corrections “world's” and “oleochemicals and their derivatives” for client review. Full-width rectangular video area per PDF, within the content grid, proposed 16:9. Source note asks for a dummy video first and suggests Florian and someone from the Malaysian team. For design, show an explicitly labelled video placement; do not imply a working video exists or select unrelated footage. Final film, poster, captions and transcript are missing.

### 6.7 Quality and Compliance — High Standard, High Trust

Supplied line:

> Our ISO-certified quality systems and full documentation support make suits and approvals straightforward for our customers.

“suits” appears to be a typo; propose “audits” for client review. Feature panel:

**Shell Gold Award for Operational Excellence**

> We are proud to be recognised for award-winning operations, with 24-hour responsiveness, proactive supply reliability, and co-created solutions, back by ISO-certified management systems and a Platinum EcoVadis rating.

Propose “backed” correction. Below it, a rotating certification-logo banner as explicitly shown on page 17. The source artwork includes RSPO (1116058), ISCC, EcoVadis, ISO (50001, 14001, 9001, 45001), Kosher, Halal, COSMOS ORGANIC, COSMOS APPROVED, and Certified Natural & Organic Cosmetic imagery. Preserve these as requested content candidates; obtain official logos, certificate owners, sites, scopes, validity and permission to display. Do not suggest every product holds every certification. Award image on slide appears to read Shell Chemicals and Refining 2025 MVP Awards; exact award title/artwork and “Gold” wording need confirmation.

### 6.8 Release — Latest News

> Stay informed with the latest announcements, exhibitions, and milestones from KLK OLEO Surfactants. Explore how we continue to advance innovation and sustainability across our business.

Use the prototype's image/category/date/title/excerpt/action hierarchy, with four visible items in the desktop carousel per PDF. Categories required by the PDF: **Exhibition, Product, Corporate, Sustainability**. Use singular “Product” in this minisite even though the global prototype currently uses “Products”. Include “View all news”. Real article content, dates and category assignments are required; the two hero articles are content dependencies, not supplied full articles.

### 6.9 FAQ

Eyebrow “FAQ”, heading “Frequently Asked Questions”. Accordion with keyboard controls and visible expanded state. The separate FAQ document is referenced but not attached; however, page 19 contains five readable question-and-answer previews embedded in its image. These were visually inspected at enlarged resolution and transcribed below. Use them as supplied draft copy, subject to comparison with the final FAQ file; do not invent further answers, regulatory statements or eligibility for search rich results. Any structured data must reflect the final visible content and applicable platform rules.

**What does KLK OLEO Surfactants manufacture?**

KLK OLEO Surfactants manufactures industrial and specialty surfactants for a wide range of applications. Our portfolio includes nonionic, anionic, and cationic surfactants, as well as tailored customer-specific solutions designed for performance, consistency, and reliable supply.

**Is KLK OLEO Surfactants part of an oleochemical manufacturing group?**

Yes. KLK OLEO Surfactants is part of KLK OLEO, one of the world’s largest vertically integrated oleochemical groups. This integration supports raw material security, supply continuity, and the development of oleo-based surfactant solutions for global markets. Nevertheless, we also supply surfactants based on synthetic fatty alcohols.

**How does KLK OLEO Surfactants support industrial chemical supply?**

We support reliable industrial chemical supply through integrated oleochemical sourcing, diversified manufacturing, technical documentation, and global supply capabilities.

**Does KLK OLEO Surfactants offer custom chemical manufacturing?**

Yes. We provide custom chemical manufacturing and tailored production support for customers who need specific performance profiles, blends, or manufacturing routes. Our teams support projects from product selection and development through to industrial production.

**Can KLK OLEO Surfactants support scale-up from lab trials to industrial production?**

Yes. KLK OLEO Surfactants supports scale-up from early development through to full industrial production. We help reduce scale-up risk with technical support, process know-how, and manufacturing capabilities designed to move formulations forward efficiently.

### 6.10 Shared footer 1 — Discuss Your Needs

Same structure and visual language as Agrochemicals, with Surfactants text from PDF page 20:

**How can we support your next formulation?**

> From surfactant selection to industrial scale-up of a customised product, KLK OLEO Surfactants helps you achieve reliable performance, consistent quality, and global supply.

Action: Contact Us → `/surfactants/contact`. Apply to all minisite pages. Keep this exact Surfactants message rather than copying the Agrochemicals FAQ-related headline.

### 6.11 Shared footer 2

Use Agrochemicals structure and format, recoloured to approved global green family. Brand column: official logo, `KLK OLEO | Surfactants`, and:

> KLK OLEO Surfactants is your global partner for surfactants. We combine quality, dependable capacity, and technical support to help you achieve results from development to full scale production.

Quick links exactly as source: Products; Custom Manufacturing; Pilot Plant; Sustainability; News & Media; Career. Deferred links remain tracked, not implemented as empty pages. Markets: Home Care and I&I Cleaning; Beauty & Personal Care; Agrochemicals; Lubricants; Textile and Leather. Proposed consistent long labels may be used after content review; source variations remain recorded.

**Footer LinkedIn is different from the header:** `https://www.linkedin.com/company/klk-oleo-surfactants/`.

Retain corporate legal links from Agrochemicals: Disclaimer, Personal Data Notice Statement, Privacy Notice, Cookie Notice. Use confirmed destinations and current legal wording. Surfactants contact email/phone and any company registration line need confirmation; do not copy `agrochem@klkoleo.com` into Surfactants.

## 7. Products archive design

Follow the approved global Products archive: shared shell, breadcrumb, photographic introduction, title and body, and category boxes. Unlike the original broad corporate archive, show **exactly three boxes in this order**:

1. Anionic Surfactants → Anionic brand listing.
2. Cationic Surfactants → Cationic brand listing.
3. Nonionic Surfactants → Nonionic brand listing.

Three equal desktop boxes, one column on mobile. Deep green translucent or solid panels, white titles, subtle dividers and lime arrow action, matching approved prototype. Separate approved archive photograph required. No local search hero, filter sidebar, chips or extra categories. The shared header's product-only search remains.

Supplied archive copy, PDF page 24:

**Our Products**

**Enriching Performance Across Industries**

> From personal care formulations to industrial cleaning solutions.
> From crop protection to metalworking excellence.
> From textile processing to leather finishing.
>
> KLK OLEO Surfactants delivers high-performance surfactant solutions that support a wide range of industries around the world.
>
> Our portfolio serves customers across Beauty & Personal Care, Home Care and Institutional & Industrial Cleaning, Agrochemicals, Lubricants & Metalworking Fluids, and Textile & Leather applications. Backed by integrated oleochemical sourcing, technical expertise, and reliable global supply capabilities, we partner closely with customers to develop effective, sustainable, and market-driven solutions.

Do not replace this with the global corporate archive's “Enriching Human Lives” copy. Copy length must be tested for contrast and readability over photography.

## 8. Category listings and product-inner boundary

Reference: approved global Anionic listing. Layout: shared header; green/teal/lime breadcrumb strip; wide Products banner; desktop green category sidebar (only Anionic, Cationic, Nonionic); white main column; green category heading; pale mint brand panels with separators.

Each listing entry's primary name is the **brand**, e.g. **PALMOSALT**. “Soap Noodles” is a separate descriptor, not the primary product name. Each entry can show approved summary and Learn More, with Request Brochure only where a real brochure exists. Do not make brochure actions or technical descriptions up. In line with the no-search archive direction, propose no additional sidebar search on category pages; shared header search is sufficient. This adapts the reference without copying its eight corporate categories.

On mobile, categories become an accessible selector/accordion above the list. Display all brands; proposed pagination only if the approved list grows enough to need it.

Inner page: preserve shared shell, breadcrumb and main-site visual styling only. Specifications tables, grades, functional attributes, downloads, sample requests, document access, related products and enquiry actions remain undecided. No final inner-page fields, technical data or commercial workflow is designed as approved. The category → brand destination is recorded but depends on the client's brief.

### Full page-14 inventory (25 rows)

“Pending” below represents literal “Dummy text” in the source; it must not ship as public copy. Draft corrections are not silently approved.

| # | Category | Brand as page 14 | Descriptor as supplied | Review |
|---|---|---|---|---|
| 1 | Anionic | PALMOSALT | Soap Noodles | — |
| 2 | Anionic | PALMFONATE | Methyl Ester Sulphonates | — |
| 3 | Anionic | SERMUL | Pending | Descriptor needed |
| 4 | Anionic | SERVO | Pending | Descriptor needed |
| 5 | Anionic | SERVOXYL | Pending | Descriptor needed |
| 6 | Anionic | SERWET | Pending | Descriptor needed |
| 7 | Anionic | SYMPARE | Methyl Ester Sulphonates | Missing from sitemap; retain pending confirmation |
| 8 | Anionic | TENSAFIN | Pending | Descriptor needed |
| 9 | Anionic | TENSAGEX | Alcohol Ether Sulphates | — |
| 10 | Anionic | TENSARYLY | Linear Alkylbenzene Sulphonates & Sulphonic Acids | Sitemap and global prototype say TENSARYL; propose TENSARYL |
| 11 | Anionic | TENSOMILD | Sulphosuccinates | — |
| 12 | Anionic | TENSOPOL | Alcohol Sulphates | — |
| 13 | Cationic | SERVAMINE | Pending | Descriptor needed |
| 14 | Nonionic | AIDIGRO | Agrochemcials | Sitemap says AIDOGRO; propose AIDIGRO / Agrochemicals |
| 15 | Nonionic | GREENBENTIN | Ethoxylates & Alkoxylates | — |
| 16 | Nonionic | HEDICOL | Pending | Descriptor needed |
| 17 | Nonionic | HEDILUB | Alkoxylates & Ester | Confirm singular Ester |
| 18 | Nonionic | HEDIPIN | Alkoxylates, Triglyceride Ethoxylates & Esters | — |
| 19 | Nonionic | HEDJUVAN | Polysorbates, Sorbitan Esters & Polyethylene Glycols | — |
| 20 | Nonionic | IMBENTIN | Ethoxylates & Alkoxylates | — |
| 21 | Nonionic | KOTILEN | Sorbitan Ester Ethoxylates (Polysorbates) | — |
| 22 | Nonionic | SERDAS | Pending | Descriptor needed |
| 23 | Nonionic | SERDOS | Pending | Descriptor needed |
| 24 | Nonionic | SERVIROX | Pending | Descriptor needed |
| 25 | Nonionic | SYMPATENS | Fatty Alcohol & Fatty Acid Ethoxylates, Triglyceride Ethoxylates | — |

Provisional totals: 12 Anionic, 1 Cationic, 12 Nonionic. Source classification is retained; no scientific reclassification is inferred.

## 9. Our Markets archive

Same shared shell; proposed photographic banner with Our Markets title, introductory breathing space and five substantial linked boxes, 3+2 on desktop and one column on mobile. Use the Google document's supplied descriptions and metadata. Homepage ordering follows the sitemap; document ordering differs and is not an extra market.

| Supplied document label | Exact supplied description | Destination |
|---|---|---|
| Beauty & Personal Care | Surfactants and blends for mild cleansing, solubilising, and formulation stability, with well-balanced sensory performance. | Pending |
| Home Care and I&I Cleaning | Surfactants for detergency, wetting, degreasing, and low-foam cleaning systems. | Pending |
| Agriculture | Surfactants for emulsifying, dispersing, wetting, penetrating, defoaming, and formulation stability in conventional, biological crop protection and related application. | `https://www.klkoleo.com/agrochemicals` |
| Lubricants & Metalworking Fluids | Surfactant solutions for emulsification, system stability, and robust process performance. | Pending |
| Textile and Leather | Surfactants for pretreatment, scouring, dyeing support and consistent finishing results in the textile industry, as well as for tanning and beamhouse processes in leather production. | Pending |

Naming conflict: sitemap/homepage say Agrochemicals while document says Agriculture; propose “Agrochemicals” consistently, retaining document body. “Textile & Leather” vs “Textile and Leather” and “Lubricants” footer shorthand also need an editorial decision. Do not treat Agriculture as a sixth market.

## 10. News & Media templates

Use approved prototype's breadcrumb, photographic page banner, introductory block, featured stories and subsequent archive grid with category selection. Adapt title to **News & Media**, not News & Events. Four categories: Exhibition, Product, Corporate, Sustainability. Proposed two featured stories desktop and one on mobile; later cards align image ratios, title space, category/date and Read More. Dates must be real publication dates, not fabricated sample freshness.

Article design proposal: breadcrumb, category/date, title, featured image, readable long-form body, optional caption and source attachments, back-to-news link, shared footer. The supplied hero article files are missing. Their presence in the plan does not mean full article text has been received.

## 11. Contact template

Follow Agrochemicals: photographic Contact Us banner; Get in Touch with Our Team introduction; direct contact method; labelled enquiry form; shared enquiry banner and footer. Proposed two-column form on desktop and one on mobile.

Reference fields observed: First Name, Last Name, Company Name, Job Position, Country, Email, Company Website, Message, consent checkbox, Submit. Preserve this structure as the starting design. Required/optional status, Surfactants recipient address, routing, approved consent copy, privacy destination, anti-spam provider, success and failure messages remain implementation/content decisions. Do not send test enquiries to real recipients during design review.

## 12. Metadata

Homepage exact user-supplied title:

`Global Oleochemicals & Surfactant Manufacturer | KLK OLEO Surfactants`

Homepage exact user-supplied description:

`KLK OLEO Surfactants is a surfactant manufacturer & supplier, providing specialty surfactants, custom chemical manufacturing, and sustainable solutions. Contact us.`

Our Markets title from supplied document:

`KLK OLEO Surfactants for Key Industries`

Our Markets description from supplied document:

`Explore KLK OLEO surfactants for personal care, home care, agriculture, and more. High performance, compliant, and sustainable solutions`

Do not silently shorten supplied metadata. Other page titles/descriptions, canonical paths and sharing images remain to be drafted after route/copy approval. Proposed canonical base is the supplied `/surfactants`; prototype URLs must not become public canonical URLs. Use real headings and links; final FAQ structured data only if applicable and supported by visible approved answers.

## 13. Deferred material and decisions

### Deferred by user

- Custom Manufacturing and Pilot Plant Special Landing Pages: later briefing. Preserve hero/footer entry points and dependencies only.
- Product-inner structure and content: client clarification, while retaining main-site visual reference.

### Needed before implementation or launch, not blocking design studies

1. Confirm brand inventory, SYMPARE inclusion, spelling variants, all 10 missing descriptors and final summaries.
2. Supply the two hero-linked article DOCX files and separate FAQ document; compare the latter with the five transcribed previews on page 19 and confirm article slugs and dates.
3. Supply brand/award/certification logo files, valid claims and scope evidence; clarify the Shell award title and imagery.
4. Supply video, approved poster, captions/transcript; any design placeholder must remain labelled.
5. Confirm four unprovided market destinations and Career target; provide separate supporting images for inner pages and market sections.
6. Confirm Surfactants contact details, form delivery and legal wording.
7. Confirm whether a request cart/sample workflow is wanted. Proposed first scope omits it rather than assuming e-commerce.
8. Confirm editorial corrections: “suits” → “audits”, “back” → “backed”, “worlds'” → “world's”, “Asia or Malaysia” → “Europe and Asia”, and market label consistency.

Resolved: product-only header search retained; no standalone archive search; all five JPGs belong to the homepage hero slider.

## 14. Proposed delivery sequence after design selection

1. Select a homepage visual direction and resolve visible refinements; incorporate the confirmed header search and hero-only asset usage.
2. Finalise the shared header/footer and responsive designs, then Products archive, the three category listings, Markets, News and Contact using this plan.
3. Obtain client product-inner brief, missing copy and destination mapping. Keep deferred Special Landing Pages in a separate later scope.
4. Agree implementation environment and CMS/content management needs; no framework, hosting service or backend has been selected by the user in this phase.
5. Implement only the approved scope. Validate all 25 provisional brands and five markets; prevent accidental extra categories or duplicate search panels.
6. Review desktop/tablet/mobile, search product-only boundaries and empty states, carousel keyboard/pause behaviour, form validation and legal text, long titles, contrast, image crops, metadata and all links.
7. Content approval and deployment are later steps. No publication is included in this design handoff.

## 15. Source coverage checklist

| PDF pages / source | Detail captured |
|---|---|
| 1–3 | Minisite identity, URL, header/logo links, colour theme, LinkedIn, search question resolved by user, exact home metadata |
| 4 | All top-level destinations, homepage sections, five markets, three categories and brand hierarchy |
| 5–10 | Homepage scope and five hero images, exact copy and link intentions |
| 11–12 | Intro, 100+/100+/7 proof points, four supporting capabilities and four help blocks |
| 13–14 | Portfolio carousel, 25 brand rows, descriptors and inconsistencies |
| 15 | Five markets, overview copy, descriptions and linked-box intention |
| 16 | Partner statement and full-width video placement |
| 17 | Quality copy, Shell highlight, rotating certification banner and scope questions |
| 18–19 | News carousel, four categories, five visually transcribed FAQ previews and separate FAQ document dependency |
| 20–21 | Shared two-part footer, supplied CTA/brand copy, quick links, market links, distinct footer LinkedIn |
| 22–24 | Main-site archive override, exactly three boxes, full archive text; inner-page boundary from direct user instruction |
| 25–26 + Markets document | Markets archive, full descriptions, supplied metadata and destination dependencies |
| 27 | Corporate sustainability URL |
| 28 | Prototype-format News & Media |
| 29 | Agrochemicals-format Contact |
| Later user answers | Product-only header search; five supplied images are homepage hero-slide assets |

This plan records all provided details. Unavailable content is explicitly listed; no final technical product information, Special Landing Page content or article body has been fabricated.
