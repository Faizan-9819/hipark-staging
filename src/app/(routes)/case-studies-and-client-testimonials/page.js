import CaseStudiesWrapper from "@/components/case-studies/CaseStudiesWrapper";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "We Partner with Leading Brands to Drive Business Excellence",
  description:
    "Discover our case studies to see the exceptional outcomes we've accomplished through partnerships with prominent brands.",
};

const CaseStudiesPage = () => {
  return (
    <>
      <JsonLd graph={simplePageGraph({ path: "/case-studies-and-client-testimonials", name: metadata.title, type: "CollectionPage", crumb: "Case Studies" })} />
      <CaseStudiesWrapper />
    </>
  );
};
// skibidi
export default CaseStudiesPage;
