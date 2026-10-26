import React from "react";
import ResourcesWrapper from "@/components/resources/ResourcesWrapper";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Resources - Horizon Industrial Parks",
  description:
    "Explore Horizon’s client testimonials, case studies, events, blogs and guidebooks on industrial and logistics real estate.",
};

const ResourcesPage = () => {
  return (
    <>
      <JsonLd graph={simplePageGraph({ path: "/resources", name: metadata.title, type: "CollectionPage", crumb: "Resources" })} />
      <ResourcesWrapper />
    </>
  );
};

export default ResourcesPage;
