import HomeWrapper from "./HomeWrapper";
import { fetchTestimonials } from "@/src/lib/fetchTestimonials";
import JsonLd from "@/components/global/JsonLd";
import { organizationNode, websiteNode } from "@/src/lib/schema";

export default async function HomeWrapperServer() {
  // ✅ FETCH HERE
  const testimonials = await fetchTestimonials();

  return (
    <>
      {/* ✅ Site entity hub: the only Organization + WebSite definition */}
      <JsonLd graph={[organizationNode(), websiteNode()]} />
      {/* ✅ Pass testimonials down to HomeWrapper */}
      <HomeWrapper testimonials={testimonials} />
    </>
  );
}
