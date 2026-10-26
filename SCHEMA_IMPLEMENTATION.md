# Schema Markup Implementation Plan — hiparks.com

Source: *Schema Markup Audit & Implementation Specification — Horizon Industrial Parks* (Parashift, v1.0, 2026-10-06).
This file maps every module in that spec to the pages and files in this codebase, and says for each one whether its existing schema gets **replaced**, **removed**, or whether new schema gets **added**.

> **Status: implemented (2026-10-23).** Builders live in `src/lib/schema.js`; every page renders them through the server component `components/global/JsonLd.jsx` (one `<script type="application/ld+json">` with a single `@graph`). Verified with `next build` and by fetching the server HTML of each template.
>
> Differences from the plan below:
> - **Missing data is left out, not filled with placeholders.** There's no `foundingDate`. Logo is `/horizonlogo.png` and the org image is `/home/home_banner_desk.webp`. Park `amenityFeature` uses the fields the CMS actually has (land area, development potential, land usage, IGBC). Clear height, dock doors, fire and power aren't in the CMS. Parks have no street or PIN; in-city centres take theirs from `incity_park_address`.
> - **`makesOffer` is only added when the CMS park status is `active`**, and it leaves out `availability`.
> - **Articles credit `#organization` as author**, because WP posts are all under the generic "HIParks" user.
> - **Parks-availability pages** get WebPage + Breadcrumb only. Their CMS items aren't park pages, so there's no ItemList.
> - **Not added on purpose:** WebSite `SearchAction` (Google retired the sitelinks search box, and `/search` is client-rendered), campaign landing pages, noindex compliance pages, and the client-rendered `/news`, `/press-releases` and `/search` listings.
> - **Also added:** state hubs carry a `FAQPage` of their visible FAQs; press releases use `NewsArticle`; sector microblogs use `BlogPosting` (via `SectorMicroBlogDetail`); the Organization has a `hasOfferCatalog` that links to the sector `#service` nodes.
> - Not-found branches in the blog, press-release, state-microblog and sector-microblog pages now call `notFound()` (real 404) instead of rendering a 200 "not found" message.

---

## 0. Global rules (apply to every page)

1. **Server-render all JSON-LD.** Use a plain `<script type="application/ld+json">` in a server component. Do **not** use `next/script` with `strategy="afterInteractive"`, because that injects the block on the client and crawlers never see it.
2. **One `Organization`, one `WebSite`.** Define both on the homepage only. Every other page refers to them by `@id`.
3. **`@id` convention:** `{canonicalURL}#organization | #website | #webpage | #breadcrumb | #place | #article | #faqpage | #parklist | #service`. Always use `https://www.hiparks.com` with no tracking params.
4. **One script per page** with a single `@graph` array that holds all of that page's nodes.
5. **No placeholders in production.** Every `{{TOKEN}}` must be filled (see §10). Add a build check that fails if `{{` or `Your Site Name` appears in rendered output.
6. **Dependencies:** self-referencing canonicals must be live, and the not-found route must return HTTP 404 so it emits no schema.

Suggested shared helper: `src/lib/schema/` with `buildOrgGraph()`, `buildWebPage()`, `buildBreadcrumb()`, `buildPlace()`, `buildArticle()`, `buildFaqPage()`, and a `<JsonLd graph={[...]} />` server component that renders:

```jsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
/>
```

---

## 1. Page → action summary

| # | Page / template | Route file(s) | Current schema in code | Action | Module |
|---|---|---|---|---|---|
| 1 | **Root layout (all pages)** | `src/app/layout.js` | `LocalBusiness` via `next/script` `afterInteractive` (client-only, invalid props, on every page) | **REMOVE** | §13.2 |
| 2 | **Homepage** `/` | `src/app/page.js`, `components/home/HomeWrapperServer.jsx`, `components/home/ClientTestimonials/TestimonialsSchemaServer.jsx` | `ItemList` of `Review` with `siteName="Your Site Name"` | **REMOVE** Review block. **ADD** Organization + WebSite | A |
| 3 | Parks availability `/parks-availability` | `src/app/(routes)/parks-availability/page.jsx` | Duplicate `LocalBusiness` (`#localbusiness`) via `next/script` | **REPLACE** with WebPage + Breadcrumb (+ ItemList of parks) | B, D |
| 4 | `/parks-availability-north` | `src/app/(routes)/parks-availability-north/page.jsx` | Duplicate `LocalBusiness` | **REPLACE** (same as #3) | B, D |
| 5 | `/parks-availability-south` | `src/app/(routes)/parks-availability-south/page.jsx` | Duplicate `LocalBusiness` | **REPLACE** (same as #3) | B, D |
| 6 | `/parks-availability-west` | `src/app/(routes)/parks-availability-west/page.jsx` | Duplicate `LocalBusiness` | **REPLACE** (same as #3) | B, D |
| 7 | State hubs `/tamil-nadu`, `/maharashtra`, `/karnataka`, `/telangana`, `/haryana`, `/gujarat`, `/goa`, `/delhi` | `src/app/(routes)/[slug]/page.jsx` (state branch) | None | **ADD** CollectionPage + ItemList + Breadcrumb | D |
| 8 | Park pages: big-box `/industrial-and-warehousing-park-*`, Chennai/TN `/industrial-and-warehouse-park-*`, bare-city `/bhiwandi`, `/nashik`, `/hoskote` | `src/app/(routes)/[slug]/page.jsx` (park branch → `PDMain`) | None | **ADD** Place (+ Offer) + WebPage + Breadcrumb | C, B |
| 9 | In-city centres `/incity-centers/*` | `src/app/(routes)/incity-centers/[incityslug]/page.jsx` | None | **ADD** Place (+ Offer) + WebPage + Breadcrumb | C, B |
| 10 | In-city listing `/incity-centers` | `src/app/(routes)/incity-centers/page.jsx` | None | **ADD** CollectionPage + ItemList + Breadcrumb | D |
| 11 | Network overview `/network-overview` | `src/app/(routes)/network-overview/page.jsx` | None | **ADD** CollectionPage + ItemList (all parks or state hubs) | D |
| 12 | Blog `/blog/*` (62) | `src/app/(routes)/blog/[slug]/page.jsx` | None | **ADD** BlogPosting + WebPage + Breadcrumb | E, B |
| 13 | News `/news/*` (104) | `src/app/(routes)/news/[slug]/page.jsx` | None | **ADD** NewsArticle + WebPage + Breadcrumb | E, B |
| 14 | Case studies `/case-studies-and-client-testimonials/*` (19) | `src/app/(routes)/case-studies-and-client-testimonials/[slug]/page.jsx` | None | **ADD** Article + WebPage + Breadcrumb | E, B |
| 15 | State articles `/{state}/{article}` | `src/app/(routes)/[slug]/[stateslug]/page.jsx` | None | **ADD** BlogPosting (about → state + park) + WebPage + Breadcrumb | E, B |
| 16 | FAQs `/faqs` (48 Q&As) | `src/app/(routes)/faqs/page.jsx` (+ `FAQAccordion.jsx` data source) | None | **ADD** FAQPage + WebPage + Breadcrumb | F, B |
| 17 | About `/know-us` | `src/app/(routes)/know-us/page.jsx` | None | **ADD** AboutPage + Breadcrumb | G |
| 18 | Contact `/contact-us` | `src/app/(routes)/contact-us/page.jsx` | None | **ADD** ContactPage + Breadcrumb | G |
| 19 | Sector pages `/ecommerce`, `/automotive-&-auto-components`, `/logistics-&-supply-chain`, `/packaging`, `/chemicals`, `/renewable-energy`, `/engineering-&-aerospace`, `/fmcg-&-retail` | `src/app/(routes)/<sector>/page.jsx` | None | **ADD** Service + WebPage + Breadcrumb | G, B |
| 20 | All other indexable core pages (Sustainability, Capabilities, Media, Leadership, Governance, Culture, Guidebook, etc.) | respective `page.jsx` | None | **ADD** WebPage + Breadcrumb | B |
| 21 | Not-found / error routes | `[slug]/error.js`, `global-error.js`, `notFound()` paths | — | **Emit nothing**; must return HTTP 404 | §0 |

---

## 2. REMOVE — existing defective markup

### 2.1 Root layout `LocalBusiness` — `src/app/layout.js`

Currently renders on **every page** through `<Script id="local-business-schema" strategy="afterInteractive">`.

Defects:
- Client-side injected → not in server HTML.
- `LocalBusiness` is too narrow for a national developer (should be `Organization`).
- `address` is a plain string, not a `PostalAddress`.
- `latitude` / `longitude` are top-level (invalid); they belong inside `geo` → `GeoCoordinates`.
- `mainEntityOfPage` is an array of 8 state URLs (invalid).
- `image` is the logo SVG, not a photo.

**Action:** delete the `jsonLd` object and the `<Script id="local-business-schema">` from the layout. The data moves into the homepage Organization node (§3).

| Old (LocalBusiness) | New (Module A) |
|---|---|
| `@type: LocalBusiness` | `@type: Organization` |
| `address` (string) | `address` → `PostalAddress` |
| top-level `latitude` / `longitude` | drop (or a separate HQ `Place` with `geo` → `GeoCoordinates`) |
| `mainEntityOfPage` (state URLs) | remove; states go in `areaServed` |
| `image` = logo SVG | `logo` keeps the brand mark; `image` = real photo |
| `sameAs`, `telephone`, `email`, `areaServed` | carry over into Organization |

### 2.2 Homepage testimonial `ItemList` / `Review` — `components/home/HomeWrapperServer.jsx`

Defects:
- `publisher.name` is the literal `"Your Site Name"` on all reviews.
- `itemReviewed` points to client companies (KUVAG India, Gurit India, JEH Aerospace…) → reviews *of the clients*, not of Horizon.
- No `reviewRating` / `aggregateRating`; self-serving review markup risks a manual action.

**Action:** remove `<TestimonialsSchemaServer ... />` from `HomeWrapperServer.jsx` and delete `components/home/ClientTestimonials/TestimonialsSchemaServer.jsx`. Keep the testimonials as visible on-page content.

### 2.3 Duplicate `LocalBusiness` on parks-availability pages

Files:
- `src/app/(routes)/parks-availability/page.jsx`
- `src/app/(routes)/parks-availability-north/page.jsx`
- `src/app/(routes)/parks-availability-south/page.jsx`
- `src/app/(routes)/parks-availability-west/page.jsx`

Each redefines the company entity (`#localbusiness`) on a child page, which breaks the single-source rule, and has the same invalid props as §2.1.

**Action:** delete the `<Script id="localbusiness-schema">` block and replace it with Module B (WebPage + Breadcrumb) plus a Module D `ItemList` of the parks shown on that page.

---

## 3. Module A — Organization + WebSite (homepage only)

**Where:** `src/app/page.js` (or `HomeWrapperServer.jsx`), server-rendered.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.hiparks.com/#organization",
      "name": "Horizon Industrial Parks Ltd",
      "alternateName": "HiParks",
      "url": "https://www.hiparks.com/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.hiparks.com/#logo",
        "url": "https://www.hiparks.com/{{LOGO_RASTER_PNG}}",
        "caption": "Horizon Industrial Parks"
      },
      "image": { "@type": "ImageObject", "url": "https://www.hiparks.com/{{ORG_PHOTO}}" },
      "description": "Horizon Industrial Parks offers Grade A portfolios of high-quality, modern industrial and logistics parks across India.",
      "foundingDate": "{{FOUNDING_DATE}}",
      "parentOrganization": { "@type": "Organization", "name": "Blackstone", "url": "https://www.blackstone.com/" },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Floor 15, Tower 1, One World Center, Lower Parel",
        "addressLocality": "Mumbai",
        "addressRegion": "Maharashtra",
        "postalCode": "400013",
        "addressCountry": "IN"
      },
      "contactPoint": [{
        "@type": "ContactPoint",
        "telephone": "+91-22-4158-1000",
        "email": "contactus@hiparks.com",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["en", "hi"]
      }],
      "sameAs": [
        "https://in.linkedin.com/company/horizon-industrial-parks",
        "https://www.facebook.com/horizonindustrialparks/",
        "https://www.youtube.com/channel/UCOfvGN61RBCKY48sE8I6mJQ",
        "https://www.instagram.com/horizonindustrialparks/"
      ],
      "areaServed": [
        { "@type": "State", "name": "Tamil Nadu" },
        { "@type": "State", "name": "Maharashtra" },
        { "@type": "State", "name": "Karnataka" },
        { "@type": "State", "name": "Telangana" },
        { "@type": "State", "name": "Haryana" },
        { "@type": "State", "name": "Gujarat" },
        { "@type": "State", "name": "Goa" },
        { "@type": "AdministrativeArea", "name": "Delhi NCR" }
      ],
      "knowsAbout": [
        "Grade-A warehousing", "Built-to-suit manufacturing facilities",
        "Industrial parks", "Logistics parks", "Warehouse leasing", "In-city logistics"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.hiparks.com/#website",
      "url": "https://www.hiparks.com/",
      "name": "Horizon Industrial Parks",
      "publisher": { "@id": "https://www.hiparks.com/#organization" },
      "inLanguage": "en-IN"
    }
  ]
}
```

Notes:
- **SearchAction:** the codebase has `/search/[word]`. If that search is live and working, add to the WebSite node:
  ```json
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://www.hiparks.com/search/{search_term_string}" },
    "query-input": "required name=search_term_string"
  }
  ```
  Confirm it works before adding.
- `Organization` does not take `geo`.
- Provide a raster logo PNG (min 112px) for `{{LOGO_RASTER_PNG}}`; keep the SVG for on-page use.
- Optional (P3): `hasOfferCatalog` referencing the sector `#service` nodes (§9).

---

## 4. Module B — WebPage + BreadcrumbList (every page except homepage)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "{{PAGE_URL}}#webpage",
      "url": "{{PAGE_URL}}",
      "name": "{{PAGE_TITLE}}",
      "isPartOf": { "@id": "https://www.hiparks.com/#website" },
      "inLanguage": "en-IN",
      "primaryImageOfPage": { "@type": "ImageObject", "url": "{{PAGE_HERO_IMAGE}}" },
      "breadcrumb": { "@id": "{{PAGE_URL}}#breadcrumb" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "{{PAGE_URL}}#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.hiparks.com/" },
        { "@type": "ListItem", "position": 2, "name": "{{PARENT_NAME}}", "item": "{{PARENT_URL}}" },
        { "@type": "ListItem", "position": 3, "name": "{{PAGE_NAME}}", "item": "{{PAGE_URL}}" }
      ]
    }
  ]
}
```

Notes:
- Breadcrumb depth follows the URL path, e.g. Home > Tamil Nadu > Hosur Park; Home > Blog > {Article}; Home > In-City Centres > Virugambakkam.
- The last item is the current page and still carries its `item` URL.
- Two-level pages (state hubs, core pages): drop position 2 and make the page position 2.
- On park pages, add `"about": { "@id": "{{PARK_URL}}#place" }` to the WebPage.
- On article pages, the page type stays `WebPage`; the Article node points to it via `mainEntityOfPage`.

---

## 5. Module C — Park & in-city pages (Place + lease Offer)

**Where:**
- `src/app/(routes)/[slug]/page.jsx` — park branch (big-box, Chennai/TN, bare-city parks)
- `src/app/(routes)/incity-centers/[incityslug]/page.jsx`

Emit in the **same** `@graph` as Module B so `subjectOf` / `about` resolve. Breadcrumb: Home > {State} > {Park} (in-city: Home > In-City Centres > {Centre}).

```json
{
  "@type": "Place",
  "@id": "{{PARK_URL}}#place",
  "name": "{{PARK_NAME}}",
  "url": "{{PARK_URL}}",
  "description": "{{PARK_SHORT_DESCRIPTION}}",
  "image": ["{{PARK_PHOTO_1}}", "{{PARK_PHOTO_2}}"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{STREET}}",
    "addressLocality": "{{CITY}}",
    "addressRegion": "{{STATE}}",
    "postalCode": "{{PIN}}",
    "addressCountry": "IN"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "{{LAT}}", "longitude": "{{LNG}}" },
  "containedInPlace": {
    "@type": "City",
    "name": "{{CITY}}",
    "containedInPlace": { "@type": "State", "name": "{{STATE}}" }
  },
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Clear height", "value": "{{CLEAR_HEIGHT_M}}" },
    { "@type": "LocationFeatureSpecification", "name": "Dock doors", "value": "{{DOCK_DOORS}}" },
    { "@type": "LocationFeatureSpecification", "name": "Fire safety", "value": "{{FIRE_SPEC}}" },
    { "@type": "LocationFeatureSpecification", "name": "Power availability", "value": "{{POWER}}" }
  ],
  "subjectOf": { "@id": "{{PARK_URL}}#webpage" },
  "makesOffer": {
    "@type": "Offer",
    "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
    "offeredBy": { "@id": "https://www.hiparks.com/#organization" },
    "itemOffered": { "@type": "Product", "name": "Grade-A warehouse & built-to-suit space" },
    "areaServed": { "@type": "City", "name": "{{CITY}}" },
    "availability": "https://schema.org/InStock"
  }
}
```

Notes:
- `makesOffer` is optional; include only where leasing is genuinely marketable. Omit `availability` if no space is available.
- No `priceSpecification` unless a real rent figure is published.
- In-city centres may use `"@type": ["Place", "LocalBusiness"]` if staffed with opening hours.
- Source data from the WP `parks` / in-city CMS fields; only include `amenityFeature` entries that have real values.

---

## 6. Module D — State hubs & listing pages (CollectionPage + ItemList)

**Where:**
- `src/app/(routes)/[slug]/page.jsx` — state branch (`/tamil-nadu`, `/maharashtra`, `/karnataka`, `/telangana`, `/haryana`, `/gujarat`, `/goa`, `/delhi`)
- Same pattern for `/incity-centers`, `/network-overview`, and `/parks-availability*`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "{{STATE_URL}}#webpage",
      "url": "{{STATE_URL}}",
      "name": "{{STATE_PAGE_TITLE}}",
      "isPartOf": { "@id": "https://www.hiparks.com/#website" },
      "about": { "@id": "https://www.hiparks.com/#organization" },
      "mainEntity": { "@id": "{{STATE_URL}}#parklist" },
      "breadcrumb": { "@id": "{{STATE_URL}}#breadcrumb" }
    },
    {
      "@type": "ItemList",
      "@id": "{{STATE_URL}}#parklist",
      "name": "Horizon industrial & logistics parks in {{STATE}}",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "{{PARK_1_NAME}}", "item": "{{PARK_1_URL}}" },
        { "@type": "ListItem", "position": 2, "name": "{{PARK_2_NAME}}", "item": "{{PARK_2_URL}}" }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "{{STATE_URL}}#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.hiparks.com/" },
        { "@type": "ListItem", "position": 2, "name": "{{STATE}}", "item": "{{STATE_URL}}" }
      ]
    }
  ]
}
```

Notes:
- Generate `itemListElement` from the same park list that renders the on-page grid (`HorizonParks`), in display order, excluding `EXCLUDED_PARKS`.
- Several state hubs have no H1 — add one so the heading matches `CollectionPage.name`.

---

## 7. Module E — Blog, News, Case studies, State articles (Article family)

| Page | Route file | `@type` |
|---|---|---|
| `/blog/*` | `src/app/(routes)/blog/[slug]/page.jsx` | `BlogPosting` |
| `/news/*` | `src/app/(routes)/news/[slug]/page.jsx` | `NewsArticle` (Horizon's own announcements only) |
| `/case-studies-and-client-testimonials/*` | `src/app/(routes)/case-studies-and-client-testimonials/[slug]/page.jsx` | `Article` |
| `/{state}/{article}` | `src/app/(routes)/[slug]/[stateslug]/page.jsx` | `BlogPosting` |

Emit with Module B in the same `@graph`. Breadcrumb: Home > Blog / News / Case Studies / {State} > {Title}.

```json
{
  "@type": "BlogPosting",
  "@id": "{{PAGE_URL}}#article",
  "headline": "{{HEADLINE_MAX_110_CHARS}}",
  "description": "{{META_DESCRIPTION}}",
  "image": ["{{ARTICLE_IMAGE_1200w}}"],
  "datePublished": "{{YYYY-MM-DD}}",
  "dateModified": "{{YYYY-MM-DD}}",
  "author": { "@type": "Person", "name": "{{AUTHOR_NAME}}", "url": "{{AUTHOR_PROFILE_URL}}" },
  "publisher": { "@id": "https://www.hiparks.com/#organization" },
  "mainEntityOfPage": { "@id": "{{PAGE_URL}}#webpage" },
  "articleSection": "{{CATEGORY}}",
  "inLanguage": "en-IN",
  "about": [
    { "@type": "Thing", "name": "{{PRIMARY_TOPIC}}" }
  ],
  "mentions": [
    { "@id": "{{RELATED_PARK_URL}}#place" },
    { "@type": "Organization", "name": "{{CLIENT_NAME}}" }
  ]
}
```

Rules:
- `headline` ≤ 110 chars (truncate cleanly; several current titles exceed this).
- `datePublished` / `dateModified` = real ISO 8601 values from WP (`date`, `modified`), never build time.
- `author`: named `Person` if WP has one, otherwise `{ "@id": "https://www.hiparks.com/#organization" }`.
- Drop `about` / `mentions` entries that have no real value.

Variations:
- **News:** `@type: NewsArticle`. For third-party press coverage, prefer linking out; only mark up as `Article` with the external publication as author/publisher if the content is genuinely hosted there.
- **Case studies:** `@type: Article`; `about` → client `Organization`; `mentions` → delivering park `#place`.
- **State articles:** `BlogPosting`; `about` → the `State` and the relevant park `#place`. Resolve cannibalisation with the state hub first.
- **Gating:** roll out after the `/blog` vs `/news` consolidation so duplicate topics aren't marked up twice.

---

## 8. Module F — FAQ page (FAQPage)

**Where:** `src/app/(routes)/faqs/page.jsx`. Build `mainEntity` from the **same data** that feeds `FAQAccordion.jsx`, so all 48 Q&As stay in sync with the visible text.

```json
{
  "@type": "FAQPage",
  "@id": "https://www.hiparks.com/faqs#faqpage",
  "isPartOf": { "@id": "https://www.hiparks.com/#website" },
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{QUESTION_1}}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{ANSWER_1}}" }
    },
    {
      "@type": "Question",
      "name": "{{QUESTION_2}}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{ANSWER_2}}" }
    }
  ]
}
```

Notes:
- Only mark up questions visible on the page; answer text must match the visible answer.
- Expectation: Google limits FAQ rich results to government/health sites (Aug 2023), so no visible snippet is expected. The value is AEO / entity understanding.
- Reusable: park and state pages that render a FAQ block (e.g. `components/state/FAQSection`) can carry their own smaller `FAQPage` the same way.

---

## 9. Module G — About, Contact & Sector pages

### `/know-us` — `src/app/(routes)/know-us/page.jsx`

```json
{
  "@type": "AboutPage",
  "@id": "https://www.hiparks.com/know-us#webpage",
  "url": "https://www.hiparks.com/know-us",
  "name": "{{PAGE_TITLE}}",
  "isPartOf": { "@id": "https://www.hiparks.com/#website" },
  "mainEntity": { "@id": "https://www.hiparks.com/#organization" }
}
```

### `/contact-us` — `src/app/(routes)/contact-us/page.jsx`

```json
{
  "@type": "ContactPage",
  "@id": "https://www.hiparks.com/contact-us#webpage",
  "url": "https://www.hiparks.com/contact-us",
  "name": "{{PAGE_TITLE}}",
  "isPartOf": { "@id": "https://www.hiparks.com/#website" },
  "about": { "@id": "https://www.hiparks.com/#organization" }
}
```

Both also get a BreadcrumbList (Home > About Us / Contact Us) in the same `@graph`, and add `"breadcrumb": { "@id": "...#breadcrumb" }` to the page node.

### Sector pages — `Service`

Files: `src/app/(routes)/ecommerce/page.jsx`, `automotive-&-auto-components/page.jsx`, `logistics-&-supply-chain/page.jsx`, `packaging/page.jsx`, `chemicals/page.jsx`, `renewable-energy/page.jsx`, `engineering-&-aerospace/page.jsx`, `fmcg-&-retail/page.jsx`.

```json
{
  "@type": "Service",
  "@id": "{{SECTOR_URL}}#service",
  "name": "{{SECTOR_NAME}} industrial & logistics real estate",
  "serviceType": "Industrial and logistics park leasing and built-to-suit",
  "provider": { "@id": "https://www.hiparks.com/#organization" },
  "areaServed": { "@type": "Country", "name": "India" },
  "audience": { "@type": "BusinessAudience", "name": "{{SECTOR_NAME}} occupiers and manufacturers" }
}
```

Emit with Module B. Sector sub-pages (`/ecommerce/[ecomslug]` etc.) get Module B, plus Module E if they are article-style content.

---

## 10. Placeholder register

| Token | Used in | Owner / source |
|---|---|---|
| `{{FOUNDING_DATE}}`, `{{ORG_PHOTO}}`, `{{LOGO_RASTER_PNG}}` | Module A | SEO / Brand |
| `{{PAGE_URL}}`, `{{PAGE_TITLE}}`, `{{PAGE_HERO_IMAGE}}`, `{{PARENT_NAME}}`, `{{PARENT_URL}}` | Module B | Dev (from CMS / route) |
| `{{PARK_NAME}}`, `{{STREET}}`, `{{CITY}}`, `{{STATE}}`, `{{PIN}}`, `{{LAT}}`, `{{LNG}}` | Module C | SEO / Operations |
| `{{CLEAR_HEIGHT_M}}`, `{{DOCK_DOORS}}`, `{{FIRE_SPEC}}`, `{{POWER}}` | Module C | Operations / Leasing |
| `{{PARK_PHOTO_*}}` | Module C | Brand |
| `{{STATE_URL}}`, `{{PARK_n_NAME}}`, `{{PARK_n_URL}}` | Module D | Dev (from CMS) |
| `{{HEADLINE}}`, `{{AUTHOR_NAME}}`, `{{AUTHOR_PROFILE_URL}}`, `{{YYYY-MM-DD}}`, `{{CLIENT_NAME}}` | Module E | SEO / Editorial |
| `{{QUESTION_n}}`, `{{ANSWER_n}}` | Module F | Dev (from FAQ source) |
| `{{SECTOR_NAME}}`, `{{SECTOR_URL}}` | Module G | Dev / SEO |

If a value is not available, **omit the property** rather than shipping a token or an empty string.

---

## 11. Rollout order

| Priority | Item | Files | Effort |
|---|---|---|---|
| P1 | Remove `"Your Site Name"` Review/ItemList | `HomeWrapperServer.jsx`, `TestimonialsSchemaServer.jsx` | 1–2 hrs |
| P1 | Remove layout `LocalBusiness`; add server-rendered Organization + WebSite on homepage | `src/app/layout.js`, `src/app/page.js` | 0.5–1 day |
| P1 | Remove duplicate `LocalBusiness` on parks-availability pages | `parks-availability*/page.jsx` | 1 hr |
| P1 | Place (+ Offer) on all park & in-city pages | `[slug]/page.jsx`, `incity-centers/[incityslug]/page.jsx` | 2–3 days |
| P2 | FAQPage on `/faqs` | `faqs/page.jsx` | 2–4 hrs |
| P2 | WebPage + BreadcrumbList site-wide | all `page.jsx` | 1–2 days |
| P2 | CollectionPage + ItemList on state hubs & listings | `[slug]/page.jsx`, `incity-centers`, `network-overview`, `parks-availability*` | 1 day |
| P2 | Article family on blog / news / case studies / state articles | `blog/[slug]`, `news/[slug]`, `case-studies-…/[slug]`, `[slug]/[stateslug]` | 2–3 days |
| P3 | Entity links: `about` / `mentions`, `hasOfferCatalog` | shared helpers | 1–2 days |
| P3 | Sector `Service` nodes | sector `page.jsx` files | 0.5 day |
| P4 | AboutPage / ContactPage; raster logo; build-time placeholder check | `know-us`, `contact-us`, build script | 0.5 day |
| P4 | Validate every template (Rich Results Test + Schema.org validator) | — | ongoing |

---

## 12. Pre-publish QA checklist (per template)

- [ ] JSON-LD is in the **server-rendered** HTML (view-source / `curl`, not DevTools DOM).
- [ ] Zero errors in Google Rich Results Test and Schema.org validator.
- [ ] Exactly one `Organization` and one `WebSite` site-wide; child pages reference by `@id` only.
- [ ] No remaining `LocalBusiness` with `#localbusiness` anywhere (`grep -r "localbusiness" src components`).
- [ ] All `@id` / `url` values use `https://www.hiparks.com` and match the page canonical.
- [ ] No `{{...}}` tokens and no `Your Site Name` in output (build check).
- [ ] `geo` is inside `GeoCoordinates`; `address` is a `PostalAddress`.
- [ ] Schema text matches visible content (FAQ answers, breadcrumbs, article dates).
- [ ] Not-found route returns HTTP 404 and emits no page schema.
- [ ] Re-test in Rich Results Test after first production deploy of each template.
