import Built from "@/components/Environment/Built";
import EnvironmentM from "@/components/Environment/EnvironmentM";
import HeroEnv from "@/components/Environment/HeroEnv";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Sustainable Industrial & Logistics Parks | Horizon",
  description:
    "Discover sustainable growth through IGBC-certified industrial parks. We follow LEED and GRESB standards, using renewable energy and eco-friendly materials.",
};

const page = () => {
  return (
    <>
      <JsonLd graph={simplePageGraph({ path: "/environment", name: metadata.title, crumb: "Environment" })} />
      <HeroEnv />
      <Built />
      <EnvironmentM />
    </>
  );
};

export default page;
