import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import PosLanding from "@/components/PosLanding";

const TITLE = "ShopOps — Restaurant POS & QR Ordering for Edinburgh｜餐廳點餐管理系統";
const DESCRIPTION =
  "All-in-one ordering system for small Edinburgh restaurants — QR self-ordering, staff POS, live kitchen board, and offline backup so you keep trading when the cloud goes down. 為 Edinburgh 小型餐廳而設嘅一站式點餐系統：客人 scan QR 自助落單、員工 POS、即時廚房看板，仲有離線後備，斷網都照做生意。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pos" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/pos`,
    type: "website",
    locale: "zh_HK",
    siteName: "ShopOps",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopOps — Restaurant POS, QR ordering & kitchen board for Edinburgh",
    description:
      "All-in-one ordering system for small Edinburgh restaurants. QR self-ordering, staff POS, live kitchen board, and offline backup so you keep trading when the cloud goes down.",
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
