import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";
import CampaignWrapper from "@/components/chengalpattu_landing/CampaignWrapper";

export const metadata = {
  title: "Grade-A Industrial Park near South Chennai | Chengalpattu",
  description:
    "Lease Grade-A industrial and warehousing space near South Chennai in Chengalpattu. Strategically located with seamless NH32 access and built-to-suit facilities.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/campaign/grade-a-industrial-park-in-chengalpattu", name: metadata.title, description: metadata.description })} />
      <CampaignWrapper />
      {/* <h1>sgdg</h1> */}
    </div>
  );
};

export default page;
