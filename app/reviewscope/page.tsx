import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import ReviewscopeLanding from "@/components/ReviewscopeLanding";

const TITLE = "Reviewscope — 餐廳評價監察｜Restaurant Review Monitoring";
const DESCRIPTION =
  "跨平台監察餐廳評價(Google、TripAdvisor),AI 分析差評,即時 Telegram 通知。Cross-platform review monitoring with AI and instant alerts.";
// 分享預覽（OG / Twitter）用英文 —— 主要對象係英國客
const OG_TITLE_EN = "Reviewscope — Restaurant Review Monitoring";
const OG_DESC_EN =
  "Monitor reviews across platforms with AI analysis and instant bad-review alerts on Telegram.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/reviewscope" },
  openGraph: {
    title: OG_TITLE_EN,
    description: OG_DESC_EN,
    url: `${SITE_URL}/reviewscope`,
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Reviewscope",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${SITE_URL}/reviewscope`,
  description:
    "Cross-platform restaurant review monitoring with AI sentiment/topic analysis and instant Telegram bad-review alerts.",
  publisher: {
    "@type": "Organization",
    name: "ShopOps",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
};

export default function ReviewscopePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReviewscopeLanding />
    </>
  );
}
