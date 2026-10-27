"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Once every 5 days the popup gets a "popup visit": during that visit it opens
// on every page the visitor goes to (home, guidebook, ...).
// - STORAGE_KEY (localStorage) holds when the last popup visit started, and
//   survives closing the browser, so it's used for the 5-day gap.
// - SESSION_KEY (sessionStorage) marks the current visit as a popup visit, and
//   is cleared automatically when the tab/browser is closed.
// Closing the popup ends the popup visit and restarts the 5-day gap, so it
// won't open again on any page until 5 days have passed.
const STORAGE_KEY = "hiparks_gresb_popup_last_shown";
const SESSION_KEY = "hiparks_gresb_popup_session";
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
const OPEN_DELAY_MS = 1500;

// The design is an 800x800 artboard. Every size below is the pixel value from
// that artboard multiplied by --u, so the popup keeps the exact proportions of
// the design at any screen size and always fits the viewport (no scrollbar).
const POPUP_SIZE = "min(680px, 92vw, 88vh)";
const u = (px) => `calc(var(--u) * ${px})`;
// Same as u(), but never smaller than minPx so text stays readable on phones
const fontU = (px, minPx) => `max(${minPx}px, ${u(px)})`;

const INTER = "var(--font-inter), Inter, sans-serif";
const PURPLE = "#8A4BA8";

const stats = [
  { value: "99.2", label: "Development Assets", border: "#F7AE6B" },
  { value: "91.3", label: "Standing Investments", border: "#C79BD8" },
  { value: "5-STAR", label: "GRESB ratings", border: "#93DD93" },
];

// Returns true if the popup should open on the current page, and starts a new
// popup visit when 5 days have passed since the last one
const shouldShowOnThisPage = () => {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return true;

    const lastShown = Number(localStorage.getItem(STORAGE_KEY));
    if (lastShown && Date.now() - lastShown < FIVE_DAYS_MS) return false;

    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  } catch {
    // Storage blocked (private mode, etc.) - don't show rather than show forever
    return false;
  }
};

// Called when the visitor closes the popup: stop showing it on other pages and
// start the 5-day gap from now
const markDismissed = () => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Storage blocked - nothing to remember
  }
};

const GresbPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const close = () => {
    markDismissed();
    setIsOpen(false);
  };

  // Re-check on every page change, so during a popup visit it opens on each page
  useEffect(() => {
    setIsOpen(false);
    if (!shouldShowOnThisPage()) return;
    const timer = setTimeout(() => setIsOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Close on Escape and lock background scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && close();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/60"
          style={{ zIndex: 2147483647 }} // above the navbar's very large z-index values
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gresb-popup-title"
            className="relative overflow-hidden bg-white shadow-2xl"
            style={{
              "--u": `calc(${POPUP_SIZE} / 800)`,
              width: POPUP_SIZE,
              minHeight: POPUP_SIZE,
              padding: `${u(55)} ${u(39)} ${u(40)} ${u(40)}`,
              backgroundImage:
                "radial-gradient(circle at 0% 8%, rgba(214,204,240,0.35), transparent 22%), radial-gradient(circle at 18% 32%, rgba(200,236,200,0.35), transparent 30%), radial-gradient(circle at 88% 68%, rgba(222,212,240,0.45), transparent 30%)",
            }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close popup"
              onClick={close}
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                top: u(14),
                right: u(14),
                width: fontU(40, 28),
                height: fontU(40, 28),
              }}
            >
              {/* Same × glyph and size as the Enquiry form's close button */}
              <span className="text-black md:text-7xl font-[100] text-[50px] leading-none">
                &times;
              </span>
            </button>

            <h2
              id="gresb-popup-title"
              className="text-center text-black"
              style={{
                fontFamily: INTER,
                fontSize: fontU(56, 26),
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              RANKED #1
            </h2>

            <p
              className="flex items-center justify-center text-center text-white"
              style={{
                marginTop: u(10),
                marginLeft: u(25),
                marginRight: u(25),
                minHeight: u(105),
                padding: `${u(10)} ${u(44)}`,
                fontFamily: INTER,
                fontSize: fontU(20, 11),
                lineHeight: 1.3,
                fontWeight: 500,
                backgroundImage: "linear-gradient(90deg, #7F3F98 0%, #F47B20 100%)",
              }}
            >
              Horizon Industrial Parks has been recognised as a Global Sector
              Leader and Asia Regional Sector Leader in the 2026 GRESB Real
              Estate Assessment.
            </p>

            {/* GRESB logo - replace this file with the official GRESB artwork if available */}
            <img
              src="/gresb/gresb-sector-leader-2026.png"
              alt="GRESB Real Estate sector leader 2026"
              className="mx-auto block"
              style={{ marginTop: u(38), width: u(200), height: u(310) }}
            />

            <div
              className="grid grid-cols-3"
              style={{ marginTop: u(48), gap: u(10) }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border"
                  style={{
                    borderColor: stat.border,
                    minHeight: u(102),
                    padding: `${u(16)} ${u(8)} ${u(14)} ${u(21)}`,
                  }}
                >
                  <p
                    style={{
                      color: PURPLE,
                      fontFamily: INTER,
                      fontSize: fontU(38, 16),
                      lineHeight: 1.15,
                      fontWeight: 700,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-black"
                    style={{
                      marginTop: u(4),
                      fontFamily: INTER,
                      fontSize: fontU(18, 10),
                      lineHeight: 1.3,
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GresbPopup;
