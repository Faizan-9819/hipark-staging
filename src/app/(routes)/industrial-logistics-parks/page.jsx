import IndMain from "@/components/industry/IndMain";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Grade A Industrial and Logistics Park in India",
  description:
    "Horizon Industrial Parks boasts India's top-tier Grade A portfolio of 17 modern industrial and logistics parks with 25 million sq ft development potential across 8 key markets.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/industrial-logistics-parks", name: metadata.title, crumb: "Industrial & Logistics Parks" })} />
      <IndMain />
    </div>
  );
};

export default page;
