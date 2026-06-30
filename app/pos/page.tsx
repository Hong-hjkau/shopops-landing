import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import PosLanding from "@/components/PosLanding";

const TITLE = "ShopOps POS — Edinburgh 餐廳點餐系統｜Restaurant POS";
const DESCRIPTION =
  "為 Edinburgh 細餐廳而設嘅點餐系統：QR 點餐、員工 POS、廚房看板、離線後備。Ordering for Edinburgh restaurants — QR, POS, kitchen board, offline.";
// 分享預覽（OG / Twitter）用英文 —— 主要對象係英國客
const OG_TITLE_EN = "ShopOps POS — Restaurant ordering for Edinburgh";
const OG_DESC_EN =
  "All-in-one ordering for small Edinburgh restaurants — QR self-ordering, staff POS, live kitchen board and offline backup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pos" },
  openGraph: {
    title: OG_TITLE_EN,
    description: OG_DESC_EN,
    url: `${SITE_URL}/pos`,
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

// JSON-LD:POS 產品 + 服務 Edinburgh,搬自原 root layout
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShopOps",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${SITE_URL}/pos`,
  description:
    "All-in-one ordering system for small Edinburgh restaurants — QR self-ordering, staff POS, live kitchen board and offline backup.",
  areaServed: { "@type": "City", name: "Edinburgh" },
  publisher: {
    "@type": "Organization",
    name: "ShopOps",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
};

export default function PosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PosLanding />
    </>
  );
}
