import { notFound } from "next/navigation";
import HeroSection from "@/components/state/HeroSection";
import MakeIndia from "@/components/state/MakeIndia";
import HorizonParks from "@/components/state/HorizonParks";
import FAQSection from "@/components/state/FAQSection";
import RelatedLinks from "@/components/state/RelatedLinks";
import HorizonRegion from "@/components/state/HorizonRegion";
import PDMain from "@/components/parkdetial/PDMain";
import IndustrialLandScape from "@/components/state/IndustrialLandScape";
import IndicatorsF from "@/components/state/IndicatorsF";
import { formatStatePage } from "@/src/utils/formatters/formatStatePage";
import { formatMediaUrl } from "@/src/utils/formatMediaUrl";
import JsonLd from "@/components/global/JsonLd";
import {
  parkDisplayName,
  parkPageGraph,
  plainText,
  stateHubGraph,
} from "@/src/lib/schema";

const EXCLUDED_PARKS = new Set([
  // "oragadam-ii",
  "warehousing-park-naraspura",
  // "xsio-parks-one-north",
  // "verna",
]);

/* -------------------------- FETCH ALL PARKS -------------------------- */
async function fetchAllParks() {
  const baseUrl =
    "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-json/wp/v2/parks";
  let allParks = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await fetch(`${baseUrl}?per_page=100&page=${page}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(
        `fetchAllParks failed: Status ${res.status} ${res.statusText}, page ${page}`,
      );
      throw new Error(`Failed to fetch parks (page ${page})`);
    }
    const data = await res.json();
    allParks = [...allParks, ...data];
    totalPages = parseInt(res.headers.get("X-WP-TotalPages")) || 1;
    page++;
  } while (page <= totalPages);
  return allParks;
}

/* ---------------------- PARKS LISTED ON A STATE HUB ---------------------- */
// Mirrors components/state/ParkSliderF so the schema ItemList matches the
// on-page park grid (same categories, same exclusions, same order).
const STATE_PARK_CATEGORY = {
  delhi: 61,
  gujarat: 60,
  maharashtra: 57,
  goa: 5,
  telangana: 58,
  karnataka: 56,
  "tamil-nadu": 59,
  haryana: 55,
};
const STATE_INCITY_CATEGORY = {
  delhi: 2,
  maharashtra: 57,
  gujarat: 3,
  karnataka: 56,
  telangana: 6,
  "tamil-nadu": 59,
  goa: 5,
};
const SLIDER_EXCLUDED = new Set([
  "warehousing-park-delhi-i",
  "warehousing-park-delhi-ii",
]);

async function fetchStateParkList(slug) {
  const WP = "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-json/wp/v2";
  const get = async (url) => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  };

  const [parks, incity] = await Promise.all([
    STATE_PARK_CATEGORY[slug]
      ? get(`${WP}/parks?categories=${STATE_PARK_CATEGORY[slug]}`)
      : [],
    STATE_INCITY_CATEGORY[slug]
      ? get(`${WP}/incity_parks?categories=${STATE_INCITY_CATEGORY[slug]}`)
      : [],
  ]);

  const seen = new Set();
  return [
    ...parks.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: parkDisplayName(p),
      path: `/${p.slug}`,
    })),
    ...incity.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: plainText(p.acf?.incity_park_name) || plainText(p.title?.rendered),
      path: `/incity-centers/${p.slug}`,
    })),
  ].filter((p) => {
    if (seen.has(p.id) || SLIDER_EXCLUDED.has(p.slug)) return false;
    seen.add(p.id);
    return true;
  });
}

/* -------------------------- FETCH STATE PAGE -------------------------- */
const BASE =
  "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-json/wp/v2";
async function fetchState(slug) {
  try {
    const res = await fetch(`${BASE}/states?slug=${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch state");
    const json = await res.json();
    if (!json?.length) return null;
    const match = json.find((item) => item.slug === slug);
    if (!match) return null;
    return formatStatePage(match);
  } catch (err) {
    console.error("fetchState error:", err);
    return null;
  }
}

/* ------------------------------------------------------------------
   :star: DYNAMIC SEO FOR STATE / PARK
------------------------------------------------------------------- */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (EXCLUDED_PARKS.has(slug)) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  // :one: Check state first
  const stateData = await fetchState(slug);
  if (stateData) {
    return {
      title: stateData.meta?.title || stateData.hero?.title || slug,
      description:
        stateData.meta?.description ||
        stateData.hero?.description ||
        "State Industrial Information",
      openGraph: {
        images: stateData.hero?.image
          ? formatMediaUrl(stateData.hero.image)
          : undefined,
      },
    };
  }
  // :two: If not state → check parks
  const allParks = await fetchAllParks();
  const park = allParks.find((p) => p.slug === slug);
  if (park) {
    return {
      title: park.acf?.meta_title || park.title?.rendered || slug,
      description:
        park.acf?.meta_description ||
        park.acf?.short_description ||
        "Industrial Park Information",
      openGraph: {
        images: park.acf?.park_spotlight_new_image
          ? formatMediaUrl(park.acf.park_spotlight_new_image)
          : undefined,
      },
    };
  }
  // :three: Nothing found → 404 meta
  return {
    title: "Not Found",
    description: "The page you are looking for does not exist.",
  };
}

/* ------------------------------------------------------------------
   MAIN PAGE COMPONENT (UNCHANGED FUNCTIONALITY)
------------------------------------------------------------------- */
export default async function CombinedPage({ params }) {
  const { slug } = await params;

  if (EXCLUDED_PARKS.has(slug)) {
    notFound();
  }

  // Try to fetch as a state first
  const stateData = await fetchState(slug);
  if (stateData) {
    const stateParks = await fetchStateParkList(slug);
    return (
      <main>
        <JsonLd graph={stateHubGraph({ slug, stateData, parks: stateParks })} />
        {/* ZAID */}
        {/* <HeroSection data={stateData.hero} /> */}
        <HorizonParks data={stateData.parks} />
        <MakeIndia data={stateData.makeindia} />
        <IndustrialLandScape
          data={stateData.industrialLandscape}
          arrow={stateData}
        />
        <IndicatorsF data={stateData.indicators} />
        <FAQSection data2={stateData.faqs2} data={stateData.faqs} />
        <HorizonRegion data={stateData.regionSlider} />
        <RelatedLinks slug={slug} />
      </main>
    );
  }
  // If not a state, try fetching all parks
  const allParks = await fetchAllParks();
  const park = allParks.find((p) => p.slug === slug);
  if (park) {
    return (
      <>
        <JsonLd graph={parkPageGraph(park)} />
        <PDMain allParks={allParks} park={park} />
      </>
    );
  }
  // Neither → 404
  notFound();
}
