import { usePathname } from "next/navigation";

// On Vercel, ISR regeneration renders the homepage through its output path
// "/index", so usePathname() is "/index" on the server but "/" in the browser.
// Anything rendered from it (classNames, img src, inline styles, hidden input
// values) then mismatches during hydration, and React keeps the server value.
export function useNormalizedPathname() {
  const pathname = usePathname();
  return pathname === "/index" ? "/" : pathname;
}
