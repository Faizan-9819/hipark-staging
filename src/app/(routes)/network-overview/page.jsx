import NetworkWrapper from "@/components/network_overview/NetworkWrapper";
import MainLayout from "@/src/layouts/MainLayout";
import Footer from "@/components/global/Footer";
import JsonLd from "@/components/global/JsonLd";
import { STATE_HUB_ITEMS, collectionPageGraph } from "@/src/lib/schema";

export const metadata = {
  title: "Industrial & Logistics Park Network | Pan-India | Horizon",
  description:
    "Explore Horizon’s national footprint of 46 industrial and logistics parks across 10 markets. We offer 60 million sq ft of sustainable, Grade A infrastructure.",
};

export default function Ecommerce() {
  return (
    <MainLayout>
      <JsonLd
        graph={collectionPageGraph({
          path: "/network-overview",
          name: metadata.title,
          description: metadata.description,
          crumb: "Network Overview",
          listName: "Horizon state hubs",
          items: STATE_HUB_ITEMS,
        })}
      />
      <NetworkWrapper />
      {/* <Footer /> */}
    </MainLayout>
  );
}
