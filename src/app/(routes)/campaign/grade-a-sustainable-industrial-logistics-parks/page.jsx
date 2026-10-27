import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";
import CampaignWrapper from "@/components/sustainability_landing/CampaignWrapper";

export const metadata = {
  title: "Sustainable Grade-A Industrial Parks & Logistics | Horizon",
  description:
    "Explore sustainable Grade-A industrial and logistics parks with rooftop solar, water recycling systems, and green-certified infrastructure built for long-term ESG success.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/campaign/grade-a-sustainable-industrial-logistics-parks", name: metadata.title, description: metadata.description })} />
      <CampaignWrapper />
      {/* <h1>sgdg</h1> */}
    </div>
  );
};

export default page;
