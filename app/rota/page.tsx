import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import RotaLanding from "@/components/RotaLanding";

const TITLE = "Rota — 員工排班 + 打卡｜Staff Scheduling & Clock-in";
const DESCRIPTION =
  "排班、出席、計工時一條龍,員工用 Telegram 定位打卡,自動匯出工時。Staff scheduling, Telegram location clock-in and automatic hours export.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/rota" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/rota`,
    type: "website",
    locale: "zh_HK",
    siteName: "ShopOps",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rota — Staff Scheduling & Telegram Clock-in",
    description:
      "Staff scheduling, location clock-in via Telegram, and automatic hours export — for any business.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Rota",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, Telegram",
  url: `${SITE_URL}/rota`,
  description:
    "Staff scheduling and attendance with Telegram location clock-in, shift swaps and automatic hours export, for any business.",
  publisher: {
    "@type": "Organization",
    name: "ShopOps",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
};

export default function RotaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RotaLanding />
    </>
  );
}
