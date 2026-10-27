import BrandJrnyWrapper from "@/components/brandjourney/BrandJrnyWrapper";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph, ORG_REF } from "@/src/lib/schema";

export const metadata = {
  title: "India's Premier Grade A Industrial and Logistics Parks",
  description:
    "Discover India's top-tier Grade A industrial and logistics parks, strategically located across 8 key markets.",
};

export default function BrandJourney() {
  return (
    <>
      <JsonLd graph={simplePageGraph({ path: "/know-us", name: metadata.title, type: "AboutPage", crumb: "About Us", mainEntity: ORG_REF })} />
      <BrandJrnyWrapper />
    </>
  );
}
