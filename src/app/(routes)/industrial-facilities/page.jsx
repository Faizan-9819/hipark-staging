import FactoryMain from "@/components/Factory/FactoryMain";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Built-to-Suit Factories & In-plant Solutions | Horizon",
  description:
    "Scale your manufacturing with Horizon’s custom-built factories and in-plant solutions. We deliver high-quality, Grade A industrial infrastructure tailored for agility.",
};

const page = () => {
  return (
    <>
      <JsonLd graph={simplePageGraph({ path: "/industrial-facilities", name: metadata.title, crumb: "Industrial Facilities" })} />
      <FactoryMain />
    </>
  );
};

export default page;
