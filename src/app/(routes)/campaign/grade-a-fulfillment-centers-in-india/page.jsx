import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";
import CampaignWrapper from "@/components/campaign/CampaignWrapper";

export const metadata = {
  title:
    "Grade A Fulfillment Centers in India | Modern Warehousing & Logistics",
  description:
    "Looking for Grade A fulfillment centers in India? Horizon offers modern warehousing, built-to-suit facilities, and plug-and-play logistics spaces designed for efficiency, scalability, and faster distribution.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/campaign/grade-a-fulfillment-centers-in-india", name: metadata.title, description: metadata.description })} />
      <CampaignWrapper />
    </div>
  );
};

export default page;
