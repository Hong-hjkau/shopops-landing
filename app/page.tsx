import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import CompanyHome from "@/components/CompanyHome";

const TITLE = "ShopOps — 度身訂造軟件 × 業務自動化｜Custom Software & Automation";
const DESCRIPTION =
  "SHOPOPS 係一隊軟件團隊:業務流程自動化、度身訂造軟件 / 系統、AI 與數據分析,以及即裝即用嘅自家產品(餐廳 POS 等)。零佣金、唔鎖數據。 SHOPOPS is a software team building business automation, custom software, AI/data tools and ready-made products.";

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
