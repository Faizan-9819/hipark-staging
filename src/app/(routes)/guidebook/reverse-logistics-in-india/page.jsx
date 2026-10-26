import White_PaperWrapper from "@/components/White-Paper/White_PaperWrapper";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  guidebook_date: "2024-01-01",
  title: "Reverse Logistics in India Supply Chain Insights | Horizon",
  description:
    "Explore Horizon’s white paper on reverse logistics in India. Learn how logistics infrastructure and supply chain optimization drive efficiency for global leaders.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/guidebook/reverse-logistics-in-india", name: metadata.title, crumb: "Reverse Logistics in India" })} />
      <White_PaperWrapper />
    </div>
  );
};

export default page;
