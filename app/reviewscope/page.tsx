import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import ReviewscopeLanding from "@/components/ReviewscopeLanding";

const TITLE =
  "Reviewscope — 餐廳評價監察｜Restaurant Review Monitoring & Bad-Review Alerts";
const DESCRIPTION =
  "跨平台監察餐廳評價(Google / TripAdvisor 等),AI 分析情緒同主題,差評即時 Telegram 通知。Monitor your restaurant's reviews across platforms, with AI analysis and instant bad-review alerts on Telegram.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/reviewscope" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/reviewscope`,
    type: "website",
    locale: "zh_HK",
    siteName: "ShopOps",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reviewscope — Restaurant Review Monitoring & Bad-Review Alerts",
    description:
      "Monitor your restaurant's reviews across platforms, with AI sentiment analysis and instant bad-review alerts on Telegram.",
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
