/* ------------------------------------------------------------------
   JSON-LD schema builders (see SCHEMA_IMPLEMENTATION.md)

   One connected @id graph: the homepage defines #organization and
   #website, every other page references them by @id only.
------------------------------------------------------------------- */

export const SITE_URL = "https://www.hiparks.com";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ORG_NAME = "Horizon Industrial Parks Ltd";
export const LOGO_URL = `${SITE_URL}/horizonlogo-square.png`;

// References to the homepage's Organization / WebSite nodes. Validators read
// each page on its own and never follow an @id to another URL, so a bare
// { "@id" } leaves e.g. an article's author and publisher without a name
// (Google flags that). Carry the same @id plus the identifying fields;
// the full node is still defined only on the homepage.
export const ORG_REF = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: ORG_NAME,
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: LOGO_URL },
};
export const WEBSITE_REF = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Horizon Industrial Parks",
  url: `${SITE_URL}/`,
};

/* -------------------------- HELPERS -------------------------- */

// "/know-us" → "https://www.hiparks.com/know-us"; absolute URLs pass through
export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl === "/") return `${SITE_URL}/`;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  // Upper-case percent-escapes (%e2 → %E2) to match the canonical tag
  return `${SITE_URL}${path.replace(/\/+$/, "").replace(/%[0-9a-f]{2}/gi, (m) => m.toUpperCase())}`;
}

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  hellip: "…",
};

export function decodeEntities(str) {
  if (!str) return "";
  return String(str)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

// Plain text from CMS HTML (titles, names)
export function plainText(html) {
  if (!html) return "";
  return decodeEntities(String(html).replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text, max) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

const pad = (n) => String(n).padStart(2, "0");

/**
 * ISO 8601 date from CMS values. Accepts WP GMT timestamps
 * ("2026-10-22T12:02:07"), ISO strings and display dates
 * ("24 September 2026"). Returns undefined when unparseable.
 */
export function toIsoDate(value, { gmt = false } = {}) {
  if (!value || typeof value !== "string") return undefined;
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return gmt ? `${trimmed}Z` : trimmed;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed;
  // ACF date pickers return "20260924"
  if (/^\d{8}$/.test(trimmed)) {
    return `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

/**
 * CMS coordinates → { latitude, longitude }. Handles "12.98, 77.88",
 * "15.36 N, 73.94 E", "19.18° N, 73.12° E" and DMS like
 * 19°05'12.8"N 72°52'53.4"E.
 */
export function parseCoordinates(value) {
  if (!value || typeof value !== "string") return null;
  const dms =
    /(\d+(?:\.\d+)?)\s*°\s*(\d+(?:\.\d+)?)\s*['′]\s*(\d+(?:\.\d+)?)\s*["″]?\s*([NSEW])/gi;
  const dmsParts = [...value.matchAll(dms)];

  let latitude;
  let longitude;
  if (dmsParts.length >= 2) {
    const toDecimal = ([, d, m, s, hemi]) => {
      const num = Number(d) + Number(m) / 60 + Number(s) / 3600;
      return /[SW]/i.test(hemi) ? -num : num;
    };
    latitude = toDecimal(dmsParts[0]);
    longitude = toDecimal(dmsParts[1]);
  } else {
    const parts = value.match(/-?\d+(?:\.\d+)?\s*°?\s*[NSEW]?/gi);
    if (!parts || parts.length < 2) return null;
    const toNumber = (part) => {
      const num = parseFloat(part);
      return /[SW]/i.test(part) ? -Math.abs(num) : num;
    };
    latitude = toNumber(parts[0]);
    longitude = toNumber(parts[1]);
  }

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
  latitude = Number(latitude.toFixed(6));
  longitude = Number(longitude.toFixed(6));
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return { latitude, longitude };
}

// Drop undefined / null / "" / empty arrays & objects so missing CMS data
// never ships as an empty property.
export function clean(value) {
  if (Array.isArray(value)) {
    const arr = value.map(clean).filter((v) => v !== undefined);
    return arr.length ? arr : undefined;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([k, v]) => [k, clean(v)])
      .filter(([, v]) => v !== undefined);
    if (!entries.length) return undefined;
    // An object holding only its @type carries no information
    if (entries.length === 1 && entries[0][0] === "@type") return undefined;
    return Object.fromEntries(entries);
  }
  if (value === null || value === "") return undefined;
  if (typeof value === "string" && !value.trim()) return undefined;
  return value;
}

/* -------------------------- STATES -------------------------- */

// State hub slug → display name
export const STATES = {
  "tamil-nadu": "Tamil Nadu",
  maharashtra: "Maharashtra",
  karnataka: "Karnataka",
  telangana: "Telangana",
  haryana: "Haryana",
  gujarat: "Gujarat",
  goa: "Goa",
  delhi: "Delhi",
};

// WP category id on /parks → state hub slug
export const PARK_CATEGORY_STATE = {
  61: "delhi",
  60: "gujarat",
  57: "maharashtra",
  5: "goa",
  58: "telangana",
  56: "karnataka",
  59: "tamil-nadu",
  55: "haryana",
};

// WP category id on /incity_parks → state hub slug (2 = NCR, no single state)
export const INCITY_CATEGORY_STATE = {
  3: "gujarat",
  5: "goa",
  6: "telangana",
  55: "haryana",
  56: "karnataka",
  57: "maharashtra",
  59: "tamil-nadu",
};

export function stateSlugFromName(name) {
  if (!name) return undefined;
  const key = plainText(name).toLowerCase();
  return Object.keys(STATES).find(
    (slug) => STATES[slug].toLowerCase() === key || slug === key,
  );
}

export function stateSlugFromCategories(categories = [], map = PARK_CATEGORY_STATE) {
  const id = categories.find((c) => map[c]);
  return id ? map[id] : undefined;
}

const REGION_NAMES = [...Object.values(STATES), "Uttar Pradesh"];

// First state / UT name mentioned in free text (e.g. a postal address)
export function stateNameInText(text) {
  const plain = plainText(text).toLowerCase();
  if (!plain) return undefined;
  return REGION_NAMES.find((name) =>
    new RegExp(`\\b${name.toLowerCase()}\\b`).test(plain),
  );
}

// Indian 6-digit PIN at the end of an address ("400070", "110 040")
export function postalCodeInText(text) {
  const matches = [...plainText(text).matchAll(/\b(\d{3})\s?(\d{3})\b/g)];
  const last = matches[matches.length - 1];
  return last ? `${last[1]}${last[2]}` : undefined;
}

/* -------------------------- MODULE A -------------------------- */

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    alternateName: "HiParks",
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: LOGO_URL,
      width: 512,
      height: 512,
      caption: "Horizon Industrial Parks",
    },
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/home/home_banner_desk.webp`,
    },
    description:
      "Horizon Industrial Parks offers Grade A portfolios of high-quality, modern industrial and logistics parks across India.",
    parentOrganization: {
      "@type": "Organization",
      name: "Blackstone",
      url: "https://www.blackstone.com/",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Floor 15, Tower 1, One World Center, Lower Parel",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400013",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-22-4158-1000",
        email: "contactus@hiparks.com",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    sameAs: [
      "https://in.linkedin.com/company/horizon-industrial-parks",
      "https://www.facebook.com/horizonindustrialparks/",
      "https://www.youtube.com/channel/UCOfvGN61RBCKY48sE8I6mJQ",
      "https://www.instagram.com/horizonindustrialparks/",
    ],
    areaServed: [
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "State", name: "Maharashtra" },
      { "@type": "State", name: "Karnataka" },
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Haryana" },
      { "@type": "State", name: "Gujarat" },
      { "@type": "State", name: "Goa" },
      { "@type": "AdministrativeArea", name: "Delhi NCR" },
    ],
    knowsAbout: [
      "Grade-A warehousing",
      "Built-to-suit manufacturing facilities",
      "Industrial parks",
      "Logistics parks",
      "Warehouse leasing",
      "In-city logistics",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Sector solutions",
      itemListElement: SECTORS.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": `${absoluteUrl(s.path)}#service`,
          name: `${s.name} industrial & logistics real estate`,
          url: absoluteUrl(s.path),
        },
      })),
    },
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: "Horizon Industrial Parks",
    // The full Organization sits in the same graph here, so a bare @id resolves
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

/* -------------------------- MODULE B -------------------------- */

/**
 * WebPage node. `type` lets callers use CollectionPage / AboutPage /
 * ContactPage. `extra` merges additional properties (about, mainEntity…).
 */
export function webPageNode({
  path,
  name,
  type = "WebPage",
  description,
  image,
  breadcrumb = true,
  ...extra
}) {
  const url = absoluteUrl(path);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: plainText(name),
    description: plainText(description),
    isPartOf: WEBSITE_REF,
    inLanguage: "en-IN",
    primaryImageOfPage: image ? { "@type": "ImageObject", url: image } : undefined,
    breadcrumb: breadcrumb ? { "@id": `${url}#breadcrumb` } : undefined,
    ...extra,
  };
}

/**
 * BreadcrumbList for `path`. `trail` excludes Home and must end with the
 * current page: [{ name, path }, …]
 */
export function breadcrumbNode(path, trail = []) {
  const url = absoluteUrl(path);
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: plainText(item.name),
      item: absoluteUrl(item.path),
    })),
  };
}

// WebPage + BreadcrumbList for a simple page directly under Home
export function simplePageGraph({ path, name, crumb, trail, ...rest }) {
  return [
    webPageNode({ path, name, ...rest }),
    breadcrumbNode(path, trail || [{ name: crumb || name, path }]),
  ];
}

/* -------------------------- MODULE C -------------------------- */

export function placeNode({
  path,
  name,
  description,
  images = [],
  address = {},
  coordinates,
  city,
  state,
  features = [],
  offer = true,
  types = "Place",
}) {
  const url = absoluteUrl(path);
  const geo = parseCoordinates(coordinates);
  const stateNode = state ? { "@type": "State", name: state } : undefined;

  const place = {
    "@type": types,
    "@id": `${url}#place`,
    name: plainText(name),
    url,
    description: truncate(plainText(description), 300),
    image: images.filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: plainText(address.street),
      addressLocality: plainText(city),
      addressRegion: state,
      postalCode: address.postalCode,
      addressCountry: "IN",
    },
    geo: geo ? { "@type": "GeoCoordinates", ...geo } : undefined,
    containedInPlace: city
      ? { "@type": "City", name: plainText(city), containedInPlace: stateNode }
      : stateNode,
    amenityFeature: features
      .filter((f) => f && plainText(f.value))
      .map((f) => ({
        "@type": "LocationFeatureSpecification",
        name: f.name,
        value: plainText(f.value),
      })),
    subjectOf: { "@id": `${url}#webpage` },
  };

  // Place has no makesOffer property (only Organization / Person do), so the
  // lease offer is its own node that points back at the Place.
  const offerNode = offer
    ? {
        "@type": "Offer",
        "@id": `${url}#offer`,
        businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
        offeredBy: ORG_REF,
        // Service, not Product: Google validates any Product as a
        // product snippet and errors without a price, review or rating
        itemOffered: {
          "@type": "Service",
          name: "Grade-A warehouse & built-to-suit space",
        },
        availableAtOrFrom: { "@id": `${url}#place` },
        areaServed: city ? { "@type": "City", name: plainText(city) } : stateNode,
      }
    : null;

  return [place, offerNode];
}

/* -------------------------- MODULE D -------------------------- */

// items: [{ name, path }]
export function itemListNode({ path, id = "parklist", name, items = [] }) {
  const url = absoluteUrl(path);
  return {
    "@type": "ItemList",
    "@id": `${url}#${id}`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: plainText(item.name),
      item: absoluteUrl(item.path),
    })),
  };
}

/* -------------------------- MODULE E -------------------------- */

export function articleNode({
  path,
  type = "BlogPosting",
  headline,
  description,
  images = [],
  datePublished,
  dateModified,
  author,
  section,
  keywords,
  about = [],
  mentions = [],
  ...extra
}) {
  const url = absoluteUrl(path);
  return {
    "@type": type,
    "@id": `${url}#article`,
    headline: truncate(plainText(headline), 110),
    description: plainText(description),
    image: images.filter(Boolean),
    datePublished,
    dateModified: dateModified || datePublished,
    // CMS posts are published under the generic "HIParks" WP user,
    // so the company is the author unless a named person is supplied.
    author: author || ORG_REF,
    publisher: ORG_REF,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    articleSection: plainText(section),
    keywords: plainText(keywords),
    inLanguage: "en-IN",
    about,
    mentions,
    ...extra,
  };
}

/* -------------------------- MODULE F -------------------------- */

// faqs: [{ question, answer }] — answer may contain HTML
export function faqPageNode({ path, faqs = [], id = "faqpage" }) {
  const url = absoluteUrl(path);
  const mainEntity = faqs
    .filter((f) => plainText(f.question) && plainText(f.answer))
    .map((f) => ({
      "@type": "Question",
      name: plainText(f.question),
      acceptedAnswer: { "@type": "Answer", text: String(f.answer).trim() },
    }));
  if (!mainEntity.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${url}#${id}`,
    isPartOf: WEBSITE_REF,
    mainEntity,
  };
}

/* -------------------------- MODULE G -------------------------- */

export const SECTORS = [
  { path: "/ecommerce", name: "E-Commerce" },
  { path: "/automotive-&-auto-components", name: "Automotive & Auto Components" },
  { path: "/logistics-&-supply-chain", name: "Logistics & Supply Chain" },
  { path: "/packaging", name: "Packaging" },
  { path: "/chemicals", name: "Chemicals" },
  { path: "/renewable-energy", name: "Renewable Energy" },
  { path: "/engineering-&-aerospace", name: "Engineering & Aerospace" },
  { path: "/fmcg-&-retail", name: "FMCG & Retail" },
];

export function serviceNode(path) {
  const sector = SECTORS.find((s) => s.path === path);
  const url = absoluteUrl(path);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: `${sector.name} industrial & logistics real estate`,
    serviceType: "Industrial and logistics park leasing and built-to-suit",
    provider: ORG_REF,
    areaServed: { "@type": "Country", name: "India" },
    audience: {
      "@type": "BusinessAudience",
      name: `${sector.name} occupiers and manufacturers`,
    },
    url,
    subjectOf: { "@id": `${url}#webpage` },
  };
}

// WebPage + BreadcrumbList + Service for a sector landing page
export function sectorPageGraph(path, title) {
  const sector = SECTORS.find((s) => s.path === path);
  return [
    webPageNode({ path, name: title, about: { "@id": `${absoluteUrl(path)}#service` } }),
    breadcrumbNode(path, [{ name: sector.name, path }]),
    serviceNode(path),
  ];
}

/* -------------------------- CMS MAPPERS -------------------------- */

const isActive = (status) => (status || "").toString().toLowerCase() === "active";

const certification = (value) => {
  const text = plainText(value);
  return text && !/in progress/i.test(text) ? text : undefined;
};

export function parkDisplayName(park) {
  const name = plainText(park?.acf?.park_name) || plainText(park?.title?.rendered);
  return /horizon|park/i.test(name) ? name : `Horizon Industrial Park ${name}`;
}

/** Industrial / logistics park page (/[slug]) — Module C + B */
export function parkPageGraph(park) {
  const acf = park.acf || {};
  const path = `/${park.slug}`;
  const name = parkDisplayName(park);
  const stateSlug =
    stateSlugFromName(acf.state_name) || stateSlugFromCategories(park.categories);
  const stateName = stateSlug ? STATES[stateSlug] : undefined;
  const photos = Array.isArray(acf.photo) ? acf.photo.slice(0, 3) : [];
  const image = acf.park_spotlight_new_image || acf.park_spotlight_image;

  return [
    webPageNode({
      path,
      name: acf.meta_title || name,
      description: acf.meta_description,
      image,
      about: { "@id": `${absoluteUrl(path)}#place` },
    }),
    breadcrumbNode(
      path,
      [stateSlug && { name: stateName, path: `/${stateSlug}` }, { name, path }].filter(Boolean),
    ),
    ...placeNode({
      path,
      name,
      description: acf.park_hd_para || acf.meta_description,
      images: [image, ...photos],
      coordinates: acf.coordinates_no,
      state: stateName,
      features: [
        { name: "Land area", value: acf.land_area },
        { name: "Development potential", value: acf.development_potential },
        { name: "Land usage", value: acf.land_usage },
        { name: "Green building certification", value: certification(acf.igbc_status) },
      ],
      offer: isActive(acf.park_status),
    }),
  ];
}

/** In-city centre page (/incity-centers/[slug]) — Module C + B */
export function incityPageGraph(park) {
  const acf = park.acf || {};
  const path = `/incity-centers/${park.slug}`;
  const title = plainText(park.title?.rendered);
  const name = plainText(acf.incity_park_name) || title;
  const address = plainText(acf.incity_park_address);
  // Titles read "InCity Kurla, Mumbai" — the part after the comma is the city
  const titleCity = title.includes(",") ? title.split(",").pop().trim() : "";
  const city = titleCity && !/ncr/i.test(titleCity) ? titleCity : undefined;
  const stateSlug = stateSlugFromCategories(park.categories, INCITY_CATEGORY_STATE);
  const state = stateNameInText(address) || (stateSlug ? STATES[stateSlug] : undefined);
  const image = acf.incity_spotlight_image;

  return [
    webPageNode({
      path,
      name: acf.incity_meta_title || name,
      description: acf.incity_meta_description,
      image: typeof image === "string" ? image : image?.url,
      about: { "@id": `${absoluteUrl(path)}#place` },
    }),
    breadcrumbNode(path, [
      { name: "In-City Centres", path: "/incity-centers" },
      { name, path },
    ]),
    ...placeNode({
      path,
      name,
      description: acf.incity_para1 || acf.incity_hd_para,
      images: [typeof image === "string" ? image : image?.url, acf.incity_masterplan_image],
      address: { street: address, postalCode: postalCodeInText(address) },
      coordinates: acf.incity_coordinates_no,
      city,
      state,
      features: [
        { name: "Land area", value: acf.incity_land_area },
        { name: "Development potential", value: acf.incity_development_potential },
        { name: "Space availability", value: acf.incity_park_availability },
        { name: "Land usage", value: acf.incity_land_usage },
        { name: "Green building certification", value: certification(acf.incity_igbc_status) },
      ],
      offer: isActive(acf.incity_park_status),
    }),
  ];
}

/** State hub (/[slug]) — Module D, plus the hub's visible FAQs */
export function stateHubGraph({ slug, stateData, parks = [] }) {
  const path = `/${slug}`;
  const stateName = plainText(stateData.hero?.name) || STATES[slug] || slug;
  const faqs = [...(stateData.faqs || []), ...(stateData.faqs2 || [])].map((f) => ({
    question: f.title,
    answer: f.desc,
  }));

  return [
    webPageNode({
      path,
      type: "CollectionPage",
      name: stateData.meta?.title || stateName,
      description: stateData.meta?.description,
      image: stateData.hero?.image,
      about: ORG_REF,
      mainEntity: { "@id": `${absoluteUrl(path)}#parklist` },
    }),
    itemListNode({
      path,
      name: `Horizon industrial & logistics parks in ${stateName}`,
      items: parks,
    }),
    breadcrumbNode(path, [{ name: stateName, path }]),
    faqPageNode({ path, faqs }),
  ];
}

/** CollectionPage + ItemList + BreadcrumbList for a listing page */
export function collectionPageGraph({ path, name, description, crumb, listName, items = [] }) {
  return [
    webPageNode({
      path,
      type: "CollectionPage",
      name,
      description,
      about: ORG_REF,
      mainEntity: items.length ? { "@id": `${absoluteUrl(path)}#parklist` } : undefined,
    }),
    items.length ? itemListNode({ path, name: listName, items }) : null,
    breadcrumbNode(path, [{ name: crumb || name, path }]),
  ];
}

export const STATE_HUB_ITEMS = Object.entries(STATES).map(([slug, name]) => ({
  name: `Industrial & logistics parks in ${name}`,
  path: `/${slug}`,
}));

/* -------------------------- LINKED ENTITIES -------------------------- */

const WP_API = "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-json/wp/v2";

/**
 * Paths of every page that carries a Place node (parks + in-city centres),
 * e.g. "/oragadam", "/incity-centers/vashi". Cached for an hour.
 */
export async function fetchPlacePaths() {
  const paths = async (type, prefix) => {
    try {
      const res = await fetch(`${WP_API}/${type}?per_page=100&_fields=slug`, {
        next: { revalidate: 3600 },
      });
      return res.ok ? (await res.json()).map((p) => `${prefix}${p.slug}`) : [];
    } catch {
      return [];
    }
  };
  const [parks, incity] = await Promise.all([
    paths("parks", "/"),
    paths("incity_parks", "/incity-centers/"),
  ]);
  return new Set([...parks, ...incity]);
}

// All HTML of a WP post: body plus every string ACF field
const postHtml = (post) =>
  [post?.content?.rendered, ...Object.values(post?.acf || {})]
    .filter((v) => typeof v === "string")
    .join(" ");

/**
 * Parks / in-city centres / state hubs that an article links to, for
 * `mentions`. Only real links count, so the schema matches the page.
 */
export function linkedEntities(html, placePaths = new Set()) {
  const seen = new Set();
  const out = [];
  for (const [, href] of String(html || "").matchAll(/href=["']([^"']+)["']/g)) {
    let path;
    try {
      const u = new URL(href, SITE_URL);
      if (!/(^|\.)hiparks\.com$/i.test(u.hostname)) continue;
      path = decodeURI(u.pathname).replace(/\/+$/, "") || "/";
    } catch {
      continue;
    }
    if (seen.has(path)) continue;
    seen.add(path);
    if (placePaths.has(path)) {
      // The Place node lives on the park's own page; carry its URL so the
      // reference still identifies something when this page is read alone
      out.push({ "@type": "Place", "@id": `${absoluteUrl(path)}#place`, url: absoluteUrl(path) });
    } else if (STATES[path.slice(1)]) {
      out.push({ "@type": "State", name: STATES[path.slice(1)] });
    }
  }
  return out;
}

/* -------------------------- ARTICLE MAPPERS -------------------------- */

const imageUrl = (img) => (typeof img === "string" ? img : img?.url);

// WP post dates: prefer the GMT fields so the offset is explicit
const wpPublished = (post) =>
  toIsoDate(post?.date_gmt, { gmt: true }) || toIsoDate(post?.date);
const wpModified = (post) =>
  toIsoDate(post?.modified_gmt, { gmt: true }) || toIsoDate(post?.modified);

function articlePageGraph({ path, type, title, metaTitle, description, image, parent, ...article }) {
  return [
    webPageNode({ path, name: metaTitle || title, description, image }),
    breadcrumbNode(path, [parent, { name: title, path }].filter(Boolean)),
    articleNode({ path, type, headline: title, description, images: [image], ...article }),
  ];
}

/** /blog/[slug] — BlogPosting */
export function blogPostGraph(blog, placePaths) {
  const acf = blog.acf || {};
  const category = blog._embedded?.["wp:term"]?.[0]?.[0]?.name || acf.category_id;
  return articlePageGraph({
    path: `/blog/${blog.slug}`,
    type: "BlogPosting",
    title: blog.title?.rendered,
    metaTitle: acf.meta_title,
    description: acf.meta_description,
    image: imageUrl(acf.blog_image) || imageUrl(acf.featured_slider_image),
    parent: { name: "Blog", path: "/media" },
    datePublished: toIsoDate(acf.blog_publish_date) || wpPublished(blog),
    dateModified: wpModified(blog),
    section: category,
    keywords: acf.meta_keyword,
    about: category ? [{ "@type": "Thing", name: plainText(category) }] : [],
    mentions: linkedEntities(postHtml(blog), placePaths),
  });
}

// Drop utm_* params from an external URL
function stripTracking(href) {
  try {
    const u = new URL(href);
    [...u.searchParams.keys()]
      .filter((k) => k.startsWith("utm_"))
      .forEach((k) => u.searchParams.delete(k));
    return u.toString();
  } catch {
    return href;
  }
}

/**
 * /news/[slug]. Third-party coverage of Horizon is an Article that cites
 * the external source via isBasedOn; Horizon's own items stay NewsArticle.
 */
export function newsGraph(news, placePaths) {
  const acf = news.acf || {};
  const external = acf.m_news_link && !acf.m_news_link.includes("hiparks.com");
  return articlePageGraph({
    path: `/news/${news.slug}`,
    type: external ? "Article" : "NewsArticle",
    title: news.title?.rendered,
    metaTitle: acf.m_news_meta_title,
    description: acf.m_news_meta_description || truncate(plainText(acf.m_news_description), 300),
    image: imageUrl(acf.m_news_image),
    parent: { name: "News", path: "/media" },
    datePublished: toIsoDate(acf.m_news_publish_date) || wpPublished(news),
    dateModified: wpModified(news),
    keywords: acf.m_news_meta_keywords,
    // Each item is coverage of Horizon
    about: [ORG_REF],
    mentions: linkedEntities(postHtml(news), placePaths),
    isBasedOn: external
      ? {
          "@type": "CreativeWork",
          url: stripTracking(acf.m_news_link),
          publisher: acf.m_news_platform
            ? { "@type": "Organization", name: plainText(acf.m_news_platform) }
            : undefined,
        }
      : undefined,
  });
}

/** /press-release/[slug] — Horizon's own announcements: NewsArticle */
export function pressReleaseGraph(pr, placePaths) {
  const acf = pr.acf || {};
  return articlePageGraph({
    path: `/press-release/${pr.slug}`,
    type: "NewsArticle",
    title: pr.title?.rendered,
    metaTitle: acf.meta_title,
    description: acf.meta_description,
    image: imageUrl(acf.pr_spotlight_image),
    parent: { name: "Press Release", path: "/media" },
    datePublished: toIsoDate(acf.pr_publish_date) || wpPublished(pr),
    dateModified: wpModified(pr),
    about: [ORG_REF],
    mentions: linkedEntities(postHtml(pr), placePaths),
  });
}

/** /case-studies-and-client-testimonials/[slug] — Article */
export function caseStudyGraph(cs, placePaths) {
  const acf = cs.acf || {};
  return articlePageGraph({
    path: `/case-studies-and-client-testimonials/${cs.slug}`,
    type: "Article",
    title: cs.title?.rendered,
    metaTitle: acf.meta_title,
    description: acf.meta_description || acf.small_description,
    image: imageUrl(acf.client_stories_image),
    parent: { name: "Case Studies", path: "/case-studies-and-client-testimonials" },
    datePublished: wpPublished(cs),
    dateModified: wpModified(cs),
    section: acf.industry,
    about: acf.industry ? [{ "@type": "Thing", name: plainText(acf.industry) }] : [],
    mentions: linkedEntities(postHtml(cs), placePaths),
  });
}

/** /[state]/[article] — state microblog: BlogPosting about the state */
export function stateMicroblogGraph({ stateSlug, post, stateLabel, fallbackImage, placePaths }) {
  const stateName = STATES[stateSlug] || stateLabel;
  const acfImage = Object.entries(post.acf || {}).find(([k]) =>
    k.endsWith("_micro_blog_image"),
  )?.[1];
  return articlePageGraph({
    path: `/${stateSlug}/${post.slug}`,
    type: "BlogPosting",
    title: post.title?.rendered,
    description: Object.entries(post.acf || {}).find(([k]) =>
      k.endsWith("_micro_blog_meta_description"),
    )?.[1],
    // The post's own image when the CMS has one, else the state hub image
    image: imageUrl(acfImage) || fallbackImage,
    parent: { name: stateName, path: `/${stateSlug}` },
    datePublished: wpPublished(post),
    dateModified: wpModified(post),
    about: [{ "@type": "State", name: stateName }],
    mentions: linkedEntities(postHtml(post), placePaths),
    isPartOf: {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(`/${stateSlug}`)}#webpage`,
      url: absoluteUrl(`/${stateSlug}`),
    },
  });
}

/** Sector microblog (/ecommerce/[slug] etc.) — BlogPosting */
export function sectorMicroblogGraph({ post, sectorPath }) {
  const sector = SECTORS.find((s) => s.path === sectorPath);
  const acf = post.acf || {};
  return articlePageGraph({
    path: `${sectorPath}/${post.slug}`,
    type: "BlogPosting",
    title: post.title?.rendered,
    metaTitle: acf.sector_micro_blog_meta_title,
    description: acf.sector_micro_blog_meta_description,
    parent: sector ? { name: sector.name, path: sectorPath } : undefined,
    datePublished: wpPublished(post),
    dateModified: wpModified(post),
    keywords: acf.sector_micro_blog_meta_keyword,
    about: sector ? [{ "@id": `${absoluteUrl(sectorPath)}#service` }] : [],
  });
}
