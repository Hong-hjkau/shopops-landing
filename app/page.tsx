import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import CompanyHome from "@/components/CompanyHome";

const TITLE = "ShopOps — 度身訂造軟件與業務自動化｜Custom Software";
const DESCRIPTION =
  "業務流程自動化、度身訂造軟件、AI 數據分析同即裝即用產品(POS 等)。Software team: automation, custom software, AI & data and ready-made products.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    type: "website",
    locale: "zh_HK",
    siteName: "ShopOps",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopOps — Custom Software & Business Automation",
    description:
      "A software team: business process automation, custom software & systems, AI/data analysis, and ready-made products.",
  },
};

// JSON-LD:公司導向 Organization(不綁地區)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShopOps",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Software team building business process automation, custom software and systems, AI/data analysis, and ready-made products.",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompanyHome />
    </>
  );
}
