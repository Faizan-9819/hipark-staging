import LogiWrapper from "@/components/Logistics/LogiWrapper";
import MainLayout from "@/src/layouts/MainLayout";
import Footer from "@/components/global/Footer";
import RelatedSectorLinks from "@/components/state/RelatedSectorLinks";
import JsonLd from "@/components/global/JsonLd";
import { sectorPageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Grade A Logistics Parks & Supply Chain Solutions | Horizon",
  description:
    "Scale with Horizon's Grade A logistics parks and infrastructure. We offer sustainable, IGBC-certified warehousing solutions with seamless connectivity.",
};
export default function Ecommerce() {
  return (
    <MainLayout>
      <JsonLd graph={sectorPageGraph("/logistics-&-supply-chain", metadata.title)} />
      <LogiWrapper />
      {/* <Footer /> */}
      <RelatedSectorLinks
        basePath="/logistics-&-supply-chain"
        apiUrl="https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-json/wp/v2/logistics_micro"
      />
    </MainLayout>
  );
}
