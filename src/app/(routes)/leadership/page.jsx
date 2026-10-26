import React from "react";
import TeamSec from "./Components/TeamSec";
import TeamSecF from "./Components/TeamSecF";
import Footer from "../../../../components/global/Footer";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Leadership & Governance | Horizon Industrial Parks India",
  description:
    "Meet the seasoned leadership driving India’s largest logistics platform. We combine expert project management with a commitment to good governance and ESG.",
};

const page = () => {
  return (
    <>
      <JsonLd graph={simplePageGraph({ path: "/leadership", name: metadata.title, crumb: "Leadership" })} />
      <div className="overflow-hidden">
        <TeamSecF />
      </div>
    </>
  );
};

export default page;
