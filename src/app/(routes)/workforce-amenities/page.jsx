import WorkWrapper from "../../../../components/workforce/WorkWrapper";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Workforce & Human-Centric Industrial Parks | Horizon",
  description:
    "Optimize operations with Horizon’s human-centric warehouse design and workforce facilities in industrial parks. We provide industrial skills training and safety.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/workforce-amenities", name: metadata.title, crumb: "Workforce Amenities" })} />
      <WorkWrapper />
    </div>
  );
};

export default page;
