import PackWrapper from "@/components/packaging/PackWrapper";
import MainLayout from "@/src/layouts/MainLayout";
import Footer from "@/components/global/Footer";
import RelatedSectorLinks from "@/components/state/RelatedSectorLinks";
import JsonLd from "@/components/global/JsonLd";
import { sectorPageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Packaging Industrial Parks & Warehouse Solutions | Horizon",
  description:
    "Horizon provides Grade A industrial parks for packaging companies and aseptic manufacturing. Scale with sustainable, IGBC-certified infrastructure and logistics.",
};
export default function Ecommerce() {
  return (
    <MainLayout>
      <JsonLd graph={sectorPageGraph("/packaging", metadata.title)} />
      <PackWrapper />
      {/* <Footer /> */}
      {/* <RelatedSectorLinks
        basePath="/packaging"
        apiUrl="https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-json/wp/v2/packaging_micros"
      /> */}
    </MainLayout>
  );
}
