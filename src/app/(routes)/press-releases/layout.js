import JsonLd from "@/components/global/JsonLd";
import { simplePageGraph } from "@/src/lib/schema";

// The page itself is a client component, so its schema is rendered here
export default function PressReleasesLayout({ children }) {
  return (
    <>
      <JsonLd
        graph={simplePageGraph({
          path: "/press-releases",
          name: "Press Releases - Horizon Industrial Parks",
          type: "CollectionPage",
          crumb: "Press Releases",
        })}
      />
      {children}
    </>
  );
}
