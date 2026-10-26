import { clean } from "@/src/lib/schema";

// Strings that must never reach production markup (unfilled template
// tokens, the old testimonial placeholder).
const FORBIDDEN = [/\{\{/, /Your Site Name/i];

/**
 * Server-rendered JSON-LD: one <script> per page holding a single @graph.
 * Pass the page's nodes (falsy entries are skipped).
 */
export default function JsonLd({ graph = [] }) {
  const nodes = clean(graph.filter(Boolean));
  if (!nodes) return null;

  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes,
  });

  const hit = FORBIDDEN.find((re) => re.test(json));
  if (hit) {
    const message = `JsonLd: placeholder ${hit} found in structured data`;
    // Fails `next build` for prerendered pages and surfaces in dev;
    // at production runtime the block is dropped instead of shipped.
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PHASE === "phase-production-build"
    ) {
      throw new Error(message);
    }
    console.error(message);
    return null;
  }

  return (
    <script
      type="application/ld+json"
      // Escape "<" so CMS content can't close the script tag
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
