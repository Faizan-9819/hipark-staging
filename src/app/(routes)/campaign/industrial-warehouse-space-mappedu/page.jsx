import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";
import CampaignMappeduWrapper from "@/components/mappedu_landing/CampaignMappeduWrapper";

export const metadata = {
  title: "Industrial & Warehouse Space for Lease in Mappedu | Horizon",
  description:
    "Explore Grade-A industrial and warehouse space for lease in Mappedu, Chennai. Ready-to-move and built-to-suit facilities with strategic connectivity.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/campaign/industrial-warehouse-space-mappedu", name: metadata.title, description: metadata.description })} />
      <CampaignMappeduWrapper />
      {/* <h1>sgdg</h1> */}
    </div>
  );
};

export default page;
