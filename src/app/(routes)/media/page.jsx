import React from "react";
import InsightsWrapper from "@/components/insights/InsightsWrapper";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Industrial and Warehousing Blog - Horizon Industrial Parks",
  description:
    "Explore Horizon’s blog for comprehensive insights into the world of industrial and logistics real estate.",
};

const InsightsPage = () => {
  return (
    <>
      <JsonLd graph={simplePageGraph({ path: "/media", name: metadata.title, type: "CollectionPage", crumb: "Media" })} />
      <InsightsWrapper />
    </>
  );
};

export default InsightsPage;
