import GovernShowcase from "@/components/governance/GovernShowcase";
import GovernStructure from "@/components/governance/GovernStructure";
import GrowSection from "@/components/governance/GrowSection";
import MaterialSection from "@/components/governance/MaterialSection";
import MobileStructure from "@/components/governance/MobileStructure";
import GovernSpot from "@/components/governance/Spotlight";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Governance & Ethical Compliance | Horizon Industrial Parks",
  description:
    "Discover Horizon’s commitment to good governance and compliance practices across India. We follow global standards to ensure ethical growth in our industrial parks.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/governance", name: metadata.title, crumb: "Governance" })} />
      <GovernSpot />
      <GrowSection />
      <GovernShowcase />
      {/* <MaterialSection /> */}
      <GovernStructure />
      <MobileStructure />
    </div>
  );
};

export default page;
