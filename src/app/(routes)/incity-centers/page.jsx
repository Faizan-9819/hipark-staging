import Incity_Park_Wrapper from "@/components/incity_park/Incity_Park_Wrapper";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import {
  ORG_ID,
  absoluteUrl,
  breadcrumbNode,
  itemListNode,
  plainText,
  webPageNode,
} from "@/src/lib/schema";

export const metadata = {
  title: "In-City Logistics & Last Mile Warehousing | Horizon",
  description:
    "Scale your last mile logistics with Grade A in-city parks. Horizon provides urban warehousing, dark stores, and fulfillment centers for agile, sustainable growth.",
};

const PATH = "/incity-centers";

async function fetchIncityCentres() {
  try {
    const res = await fetch(
      "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-json/wp/v2/incity_parks?per_page=100&_fields=id,slug,title,acf.incity_park_name",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((p) => ({
      name: plainText(p.acf?.incity_park_name) || plainText(p.title?.rendered),
      path: `${PATH}/${p.slug}`,
    }));
  } catch {
    return [];
  }
}

const page = async () => {
  const centres = await fetchIncityCentres();

  return (
    <div>
      <JsonLd
        graph={[
          webPageNode({
            path: PATH,
            type: "CollectionPage",
            name: metadata.title,
            description: metadata.description,
            about: { "@id": ORG_ID },
            mainEntity: centres.length
              ? { "@id": `${absoluteUrl(PATH)}#parklist` }
              : undefined,
          }),
          centres.length &&
            itemListNode({
              path: PATH,
              name: "Horizon in-city centres",
              items: centres,
            }),
          breadcrumbNode(PATH, [{ name: "In-City Centres", path: PATH }]),
        ]}
      />
      <Incity_Park_Wrapper />
    </div>
  );
};

export default page;
