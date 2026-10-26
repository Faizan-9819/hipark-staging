import Cap_overviewWrapper from "@/components/Capabilitiesoverview/Cap_overviewWrapper";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Industrial & Logistics Infrastructure Capabilities | Horizon",
  description:
    "Discover Horizon’s integrated development and asset management capabilities. We provide sustainable, Grade A industrial and logistics infrastructure across India.",
};

export default function Capabilitiesoverview() {
  return (
    <>
      <JsonLd graph={simplePageGraph({ path: "/capabilities-overview", name: metadata.title, crumb: "Capabilities Overview" })} />
      <Cap_overviewWrapper />
    </>
  );
}
