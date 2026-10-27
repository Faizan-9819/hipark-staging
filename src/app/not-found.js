// Same 404 UI Next.js shows by default; this file only exists so 404 pages
// don't inherit the root layout's self-referencing canonical tag.
import NotFound from "next/dist/client/components/builtin/not-found";

export const metadata = {
  alternates: { canonical: null },
};

export default NotFound;
