import FulfillmentWrapper from "@/components/fulfillment_center/FulfillmentWrapper";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Fulfillment Center & Logistics Park Solutions | Horizon",
  description:
    "Horizon offers Grade A fulfillment centers and logistics park solutions. Scale with sustainable, IGBC-certified infrastructure and seamless connectivity.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/fulfilment-centers", name: metadata.title, crumb: "Fulfilment Centers" })} />
      <FulfillmentWrapper />
    </div>
  );
};

export default page;
