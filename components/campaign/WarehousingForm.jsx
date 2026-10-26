"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Fulfillment_Form from "@/components/campaign/fulfillment_Form";

const WarehousingForm = () => {
  return (
    <>
      <div
        id="book-a-site-visit"
        className="h-[565px] gap-[20px] lg:h-auto lg:pt-0 w-full flex flex-col justify-start lg:justify-between bg-cover bg-center md:bg-bottom lg:bg-center bg-[url('/Campaign/fulfillment_mob_banner.png')] lg:bg-[url('/Campaign/hero-c.webp')]"
      >
        <div className="fix !my-[0px] lg:my-auto  pt-[30px] lg:pt-10">
          <div className="w-[323px] flex gap-[14px]">
            <Link href="/">
              <motion.img
                key={"Horizon_White"}
                className="max-w-full"
                src={"/nav/Horizon_White.svg"}
                alt="Hipark Logo"
              />
            </Link>
            <a href="https://www.blackstone.com/" target="_blank">
              <motion.img
                key={"blackstone_white"}
                className="max-w-full"
                src={"/nav/blackstone_white.svg"}
                alt="Blackstone Logo"
              />
            </a>
          </div>
        </div>

        <div className="fix !my-[0px] lg:my-auto  pb-20">
          <div className="flex flex-col pt-[20px] lg:pt-12 lg:flex-row items-end justify-end gap-12 lg:gap-8">
            {/* Left Section */}
            <div className="lg:w-[50%] flex flex-col justify-center gap-5 lg:gap-10 w-full lg:pb-6">
              <div className="flex flex-col gap-7">
                <h1 className="lg:text-[48px] text-[32px] bw-m leading-[35px] tracking-[-1.9px] lg:leading-[66px] text-white">
                  Grade-A Fulfillment Centers <br />
                  <div className="flex items-start flex-col lg:flex-row overflow-visible">
                    <span className="font-normal leading-[35px] tracking-[-1.9px] lg:leading-[50px] whitespace-nowrap">
                      Designed For Speed
                    </span>
                    <img
                      className="ml-0 pt-2 lg:pt-0 lg:ml-5 w-[80px] lg:w-[170px]! block lg:inline-block 2xl:w-[210px]! shrink-0 abstract_svg"
                      src={"/abstract_pattern.svg"}
                      alt=""
                    />
                  </div>
                </h1>
                <p className="lg:text-[24px] text-[18px] lg:max-w-[80%] text-[#fff]">
                  Built for e-commerce, retail, FMCG, and 3PL, Horizon's
                  fulfillment centres offer faster TAT, and operational
                  efficiency.
                </p>
              </div>
              <button className="flex justify-between lg:h-[56px] tracking-[2px] items-center gap-3 bg-none border-2 px-[10px] py-[5px] lg:p-2 mr-auto border-white lg:px-[20px] lg:py-[14px] text-white text-xl font-medium max-w-fit">
                <img
                  src="/Campaign/phone.svg"
                  className="lg:w-[26px] w-[20px]"
                  alt=""
                />
                <a
                  href="tel:+918879970705"
                  className="text-[14px] tracking-[2px] leading-[26px] lg:text-[20px]"
                >
                  CALL US : <span className="font-[700]!">8879970705</span>
                </a>
              </button>
            </div>

            {/* Desktop Right Section - Form */}
            <div className="w-full lg:w-[50%] campaigninput bg-white hidden lg:flex flex-col gap-7 p-[20px] md:p-[30px] items-start">
              <Fulfillment_Form />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Form Div */}
      <div className="w-full lg:w-[40%] campaigninput bg-white flex lg:hidden flex-col gap-[15px] md:gap-7 pt-[20px] pb-[40px] px-[20px] md:p-[30px] items-start">
        <Fulfillment_Form />
      </div>
    </>
  );
};

export default WarehousingForm;
