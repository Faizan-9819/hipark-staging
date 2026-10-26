import ContactWrapper from "@/components/contact/ContactWrapper";
import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph, ORG_ID } from "@/src/lib/schema";

export const metadata = {
  title: "Contact Horizon Industrial Parks | Logistics & Industrial India",
  description:
    "Get in touch with Horizon Industrial Parks, India’s leading logistics infrastructure developer. Explore Grade A warehouse solutions and sustainable, built-to-suit industrial parks.",
};

const page = () => {
  return (
    <div>
      <JsonLd graph={simplePageGraph({ path: "/contact-us", name: metadata.title, type: "ContactPage", crumb: "Contact Us", about: { "@id": ORG_ID } })} />
      <ContactWrapper />
    </div>
  );
};

export default page;
