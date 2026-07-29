import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import CompanyHome from "@/components/CompanyHome";

const TITLE = "ShopOps POS — Bilingual Restaurant POS for UK Restaurants";
const DESCRIPTION =
  "Bilingual restaurant POS for UK independent restaurants, with QR ordering, staff POS, live kitchen screens and offline backup.";
const OG_TITLE_EN = "ShopOps POS — Bilingual Restaurant POS for UK Restaurants";
const OG_DESC_EN =
  "QR ordering, staff POS, live kitchen screens and offline backup for independent UK restaurants.";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShopOps",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "ShopOps builds bilingual restaurant POS software for independent UK restaurants, alongside custom software and automation services.",
  areaServed: { "@type": "Country", name: "United Kingdom" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <CompanyHome />
    </>
  );
}
