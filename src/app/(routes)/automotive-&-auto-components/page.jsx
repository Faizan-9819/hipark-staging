import AutoWrapper from "@/components/Automotive/AutoWrapper";
import MainLayout from "@/src/layouts/MainLayout";
import Footer from "@/components/global/Footer";
import RelatedSectorLinks from "@/components/state/RelatedSectorLinks";
import JsonLd from "@/components/global/JsonLd";
import { sectorPageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Automotive Manufacturing & Logistics Solutions | Horizon",
  description:
    "Horizon provides Grade A industrial parks for auto component manufacturing and logistics solutions. Scale with sustainable infrastructure and seamless connectivity.",
};
export default function Ecommerce() {
  return (
    <MainLayout>
      <JsonLd graph={sectorPageGraph("/automotive-&-auto-components", metadata.title)} />
      <AutoWrapper />
      {/* <Footer /> */}
      <RelatedSectorLinks />
    </MainLayout>
  );
}
