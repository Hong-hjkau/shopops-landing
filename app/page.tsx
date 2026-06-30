import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import CompanyHome from "@/components/CompanyHome";

const TITLE = "ShopOps — 度身訂造軟件與業務自動化｜Custom Software";
const DESCRIPTION =
  "業務流程自動化、度身訂造軟件、AI 數據分析同即裝即用產品(POS 等)。Software team: automation, custom software, AI & data and ready-made products.";
// 分享預覽（OG / Twitter）用英文 —— 主要對象係英國客
const OG_TITLE_EN = "ShopOps — Custom Software & Business Automation";
const OG_DESC_EN =
  "A software team: business process automation, custom software & systems, AI/data analysis, and ready-made products.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: OG_TITLE_EN,
    description: OG_DESC_EN,
    url: SITE_URL,
    type: "website",
    locale: "en_GB",
    siteName: "ShopOps",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE_EN,
    description: OG_DESC_EN,
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
