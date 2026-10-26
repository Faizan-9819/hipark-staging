import EnabAgile from "../../../../components/enabling_agile/EnabAgile";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Agile Industrial & Logistics Operations | Horizon Industrial Parks",
  description:
    "Scale with confidence through agile industrial and logistics infrastructure. We provide Grade A facilities and integrated solutions for future-ready operations.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/enabling-agile-growth", name: metadata.title, crumb: "Enabling Agile Growth" })} />
      <EnabAgile />
    </div>
  );
};

export default page;
