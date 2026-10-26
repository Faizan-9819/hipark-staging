import CommunityPrograms from "@/components/social/Community";
import Community from "@/components/social/Community";
import Progress from "@/components/social/Progress";
import SocialTabs from "@/components/social/SocialTabSection";
import Spotlight from "@/components/social/Spotlight";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Social Responsibility & Human-Centric Parks | Horizon",
  description:
    "Discover Horizon’s commitment to social impact and human-centric industrial park design. We prioritize workforce well-being and sustainable growth across India.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/social", name: metadata.title, crumb: "Social" })} />
      <Spotlight />
      <Progress />
      <SocialTabs />
      <CommunityPrograms />
    </div>
  );
};

export default page;
