import SMain from "@/components/sustainability/SMain";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Green Warehouse: Horizon's Sustainable Solutions for a Better Future",
  description:
    "Explore Horizon's commitment to sustainability, with Green Warehouses driving eco-friendly practices, social inclusion, and ethical governance for a better tomorrow.",
};
const page = () => {
  return (
    <>
      <JsonLd graph={simplePageGraph({ path: "/sustainability-overview", name: metadata.title, crumb: "Sustainability" })} />
      <SMain />
    </>
  );
};

export default page;
