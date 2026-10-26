import React from "react";
import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";
import ParksAbleWrapper from "../../../../components/parks-availability/ParksAbleWrapper";
import { fetchParksData } from "../../../../components/parks-availability/data/fetchParks";

export const metadata = {
  title: "Industrial and logistics parks in India - Horizon Industrial Parks",
  description:
    "Horizon Industrial Parks offers Grade A portfolios of high-quality, modern industrial and logistics parks across India",

  icons: {
    icon: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2024/09/favicon.ico",
    apple:
      "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2024/09/favicon.ico",
  },

  openGraph: {
    title: "Industrial and logistics parks in India - Horizon Industrial Parks",
    description:
      "Horizon Industrial Parks offers Grade A portfolios of high-quality, modern industrial and logistics parks across India",
    url: "https://hiparks.com/",
    images: [
      {
        url: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2024/10/og_img_home_pg.jpg",
      },
    ],
  },
};

export default async function Page() {
  const parksData = await fetchParksData();

  return (
    <>
      {/* JSON-LD Schema */}
      <JsonLd
        graph={simplePageGraph({
          path: "/parks-availability",
          name: metadata.title,
          crumb: "Parks Availability",
        })}
      />

      <ParksAbleWrapper parksData={parksData} />
      {/* <div
        className="flex items-center justify-center px-[20px]"
        style={{ height: "70vh" }}
      >
        <h1 className="text-center bw-m text-[24px] md:text-[36px]">
          Oops! Something went wrong on our end. <br></br>We&apos;re working on
          fixing it.
        </h1>
      </div> */}
    </>
  );
}
