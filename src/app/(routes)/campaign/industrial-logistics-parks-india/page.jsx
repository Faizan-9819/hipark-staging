import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";
import CampaignWrapper from "@/components/enquiry_campaign/CampaignWrapper";

export const metadata = {
  title: "India's Largest Industrial & Logistics Platform | IGBC certified",
  description:
    "Expand your business with Horizon's Grade A industrial and logistics parks across India. IGBC-certified infrastructure, turnkey solutions and strategic locations.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/campaign/industrial-logistics-parks-india", name: metadata.title, description: metadata.description })} />
      <CampaignWrapper />
      {/* <h1>sgdg</h1> */}
    </div>
  );
};

export default page;
