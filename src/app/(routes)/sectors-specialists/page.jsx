import SSWrapper from "@/components/sector_specialists/SSWrapper";
import MainLayout from "@/src/layouts/MainLayout";
import Footer from "@/components/global/Footer";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Industrial & Logistics Sector Specialists | Horizon India",
  description:
    "Explore seasoned expertise across key sectors like automotive, e-commerce, and chemicals. We provide Grade A, sustainable industrial and logistics infrastructure.",
};

export default function Capabilitiesoverview() {
  return (
    <MainLayout>
      <JsonLd graph={simplePageGraph({ path: "/sectors-specialists", name: metadata.title, crumb: "Sector Specialists" })} />
      <SSWrapper />
      {/* <Footer /> */}
    </MainLayout>
  );
}
