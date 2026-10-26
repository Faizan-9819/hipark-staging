import CultureWrapper from "@/components/culture/CultureWrapper";
import MainLayout from "@/src/layouts/MainLayout";
import Footer from "@/components/global/Footer";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Culture at Horizon Industrial Parks | Agile & Sustainable",
  description:
    "Explore a culture of agility and seamless teamwork. We focus on good governance and sustainable growth to power India's logistics and industrial progress.",
};

export default function Culture() {
  return (
    <MainLayout>
      <JsonLd graph={simplePageGraph({ path: "/culture", name: metadata.title, crumb: "Culture" })} />
      <CultureWrapper />
      {/* <Footer /> */}
    </MainLayout>
  );
}
