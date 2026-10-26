import SolutionMain from "@/components/solutions/SolutionMain";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Integrated Business & Logistics Solutions | Horizon",
  description:
    "Scale smarter with Horizon’s integrated business solutions. We provide comprehensive logistics infrastructure, Grade A warehouse solutions, and active asset management.",
};

const page = () => {
  return (
    <>
      <JsonLd graph={simplePageGraph({ path: "/integrated-solutions-overview", name: metadata.title, crumb: "Integrated Solutions" })} />
      <SolutionMain />
    </>
  );
};

export default page;
