import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";
import CampaignWrapper from "@/components/bts_campaign/CampaignWrapper";

export const metadata = {
  title: "Built to Suit Warehouses & Manufacturing Facilities | Horizon",
  description:
    "Discover built-to-suit warehouses and manufacturing facilities with customized layouts, flexible leasing, and expansion-ready infrastructure across India.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/campaign/built-to-suit-facilities", name: metadata.title, description: metadata.description })} />
      <CampaignWrapper />
      {/* <h1>sgdg</h1> */}
    </div>
  );
};

export default page;
