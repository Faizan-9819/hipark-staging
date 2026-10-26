"use client";
import React from "react";
import Btn from "@/components/global/Btn";

const C_info_data = [
  {
    title: "AGM Notice & Annual Report 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "8th September 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLAGMNoticeandAR.pdf",
  },
  {
    title:
      "Communication to the Shareholders of AGM Notice & Annual Report 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "8th September 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLIntiSEComtoSH.pdf",
  },
  {
    title:
      "Reconciliation of Share Capital Audit Report for the quarter ended September 30, 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "22nd October 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPL_Reg76_signed.pdf",
  },
  {
    title:
      "Notice of Board Meeting to consider the Unaudited Standalone and Consolidated Financial Results for the quarter and half year ended 30th September, 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "21th October 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPL_SE_Intimation_dt_21_10_2026_signed.pdf",
  },
  {
    title:
      "Invitation for the investor to attend conference call scheduled 21st  October, 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "21th October 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPL_SE_Intimation_dt_21_10_2026_signed.pdf",
  },
  {
    title: "Shareholding Pattern - September 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "13th October 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPl_SHP_September_2026.pdf",
  },
  {
    title:
      "Certificate under Regulation 74(5) of the SEBI (Depositories and Participants) Regulation, 2018 for the quarter ended September 30, 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "08th October 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPL_Intimation74(5).pdf",
  },
  {
    title: "Transcript of the 17th AGM of Horizon Industrial Parks Limited",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/Transcript_of_17th_AGM.pdf",
  },
  {
    title: "AGM2026 Video Recording",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "",
    pdf: "https://vimeo.com/reviews/b006665b-0288-4374-9ba0-914881b43ad1/videos/1231557307",
  },
  {
    title:
      "Regulation 44(3) of the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015 - Details of Voting Results of the 17th Annual General Meeting (AGM) of the Company",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "01st October, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLSEVRANDSR.pdf",
  },
  {
    title:
      "Proceedings of the 17th Annual General Meeting of the Company held on September 30, 2026.",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "30th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLSEsAGMProceedings.pdf",
  },
  {
    title:
      "Intimation regarding change of Corporate Identification Number (CIN) of Horizon Industrial Parks Limited (the “Company”)",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "30th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLSECIN.pdf",
  },
  {
    title:
      "Intimation of Closure of Trading Window under SEBI (Prohibition of Insider Trading) Regulations, 2015 for the quarter ended September 30, 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "29th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLSECTW.pdf",
  },
  {
    title:
      "Transcript of Investors / Analysts Conference Call on Q1 FY27 Financial Results of Horizon Industrial Parks Limited held on September 11, 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "	13th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/SEIntimationInvestorTranscript.pdf",
  },
  {
    title: "Outcome of the Board meeting of Horizon Industrial Parks Limited",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "	11th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/SEIntimationFSQ1sd.pdf",
  },
  {
    title:
      "Press Release and Presentation on the Unaudited Financial Results for the quarter ended June 30, 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "	11th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/SEIntimationPRPPTsd.pdf",
  },
  {
    title:
      "Submission of the Newspaper Publication - Information regarding 17th Annual General Meeting (“AGM”)",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "	9th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPL_Submission_of_Copy_of_Newspaper_Publication_9.9.2026.pdf",
  },
  {
    title: "Copy of Invitation to the Investors to attend the Conference Call",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "	9th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLConferenceCallDetails.pdf",
  },
  {
    title: "AGM Notice 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "",
    pdf: "https://phpstack-725513-4957654.cloudwaysapps.com/corporate-governance/stock_exchange_pdf/AGM-Notice-2026.pdf",
  },
  {
    title: "Outcome of the Board meeting of Horizon Industrial Parks Limited",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "	8th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLOutcomeofBMdt.pdf",
  },
  {
    title:
      "Notice of Board Meeting to consider the Unaudited Standalone and Consolidated Financial Results for the quarter ended 30th June, 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "	7th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLIntimationtoSEforQ1BM.pdf",
  },
  {
    title: "Closure of Trading Window",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "24th August 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPL_Closure of Trading Window.pdf",
  },
  {
    title:
      "Intimation under Regulation 8(2) of the Securities Exchange Board of India (Prohibition of Insider Trading) Regulations, 2015",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "24th August 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLIntitoSEsReg8(2).pdf",
  },
  {
    title:
      "Intimation under Regulation 30(5) of the Securities and Exchange Board of India (Listing Obligations and Disclosure Requirements) Regulations, 2015",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "24th August 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/HIPLIntitoSEsReg30(5).pdf",
  },
  {
    title:
      "Newspaper Publication of Unaudited Financial Results for the quarter ended 30th June, 2026",
    download_img: "/download_icon.svg",
    mark_img: "/Invester/orange_mark.svg",
    pdf_date: "12th September, 2026",
    pdf: "https://phpstack-725513-2688800.cloudwaysapps.com/cms/wp-content/uploads/2025/12/corporate-governance/stock_exchange_pdf/Financial-express-September-12-2026-Navshakti-September-12-2026.pdf",
  },
];

const Stock_exchange_sec = () => {
  return (
    <div className="w-full bg-[#EBEBEB]">
      <div className="fix relative w-full lg:pt-[70px] lg:pb-[86px] pt-[45px] pb-[45px]">
        <div className="flex gap-[5px] lg:gap-[50px] 1280:gap-[40px] 1440:gap-[10px] justify-between flex-col lg:flex-row">
          <div className="w-[312px] md:w-[240px] 1280:w-[318px] 1440:w-[370px] mb-[15px] lg:mb-[0px] relative">
            <h1 className="1280:text-[48px] 1280:leading-[58px] 1440:text-[56px] 1440:leading-[66px] 1280:tracking-[-3.04px] lg:text-[37px] lg:leading-[43px] lg:tracking-[-2.04px]  text-[30px] leading-[36px] tracking-[-1px]  bw-r">
              Stock Exchange<br></br>
              <span className="bw-r">Intimations </span>
            </h1>
          </div>
          <div className="md:w-[auto] lg:w-[700px] 1280:w-[898px]">
            <div className="flex flex-wrap md:gap-[26px] gap-[16px]">
              {C_info_data.map((info_data, index) => (
                // <a
                //   href={info_data.pdf}
                //   key={index}
                //   target="_blank"
                //   className="flex justify-between items-center 1280:w-[48%] md:w-[48%] lg:w-[47%] w-[100%] h-[65px] md:h-[85px] lg:h-[70px] 1280:h-[110px] bg-[#F7C99B] bw-r text-[17px] md:text-[17px] md:leading-[23px] 1440:text-[22px] 1440:leading-[30px] 1366:text-[23px] 1280:text-[20px] 1280:leading-[25px] leading-[23px] tracking-[-1.04px] md:py-[20px] md:px-[15px] py-[22px] px-[26px] 1280:px-[31px] relative overflow-hidden"
                // >
                //   {info_data.title}
                //   <br></br>
                //   {info_data.pdf_date}

                //   <img
                //     src={info_data.download_img}
                //     className="lg:w-[30px] w-[30px] 1280:w-[40px]"
                //   ></img>
                //   <img
                //     className="absolute left-0 1280:w-[85px] 1366:w-[85px] w-[60px] bottom-[-5px]"
                //     src={info_data.mark_img}
                //   ></img>
                // </a>
                <a
                  href={info_data.pdf}
                  key={index}
                  target="_blank"
                  className="flex justify-between items-center 1280:w-[48%] md:w-[100%] lg:w-[47%] w-[100%] h-[auto] md:h-[110px] lg:h-[120px] 1280:h-[120px] bg-[#F7C99B] bw-r text-[17px] md:text-[17px] md:leading-[23px] lg:text-[15px] lg:leading-[19px] 1440:text-[16px] 1440:leading-[22px] 1366:text-[16px] 1280:text-[15px] 1280:leading-[21px] leading-[25px] tracking-[-1.04px] md:py-[20px] md:px-[30px] py-[22px] px-[26px] 1280:px-[37px] relative overflow-hidden"
                >
                  {info_data.title}
                  <br></br>
                  {info_data.pdf_date}

                  <img
                    src={info_data.download_img}
                    className="lg:w-[30px] w-[30px] 1280:w-[40px]"
                  ></img>
                  <img
                    className="absolute left-0 1280:w-[85px] 1366:w-[85px] w-[60px] bottom-[-5px]"
                    src={info_data.mark_img}
                  ></img>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock_exchange_sec;
