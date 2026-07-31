import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import PosLanding from "@/components/PosLanding";
import { LangProvider } from "@/components/LangProvider";
import { parseQueryLang } from "@/lib/language";

const TITLE = "ShopOps POS — Bilingual Restaurant POS for UK Restaurants";
const DESCRIPTION =
  "ShopOps is a bilingual restaurant POS for UK restaurants, with QR ordering, staff POS, a live kitchen screen and offline backup.";
// 分享預覽（OG / Twitter）用英文 —— 主要對象係英國客
const OG_TITLE_EN = TITLE;
const OG_DESC_EN = DESCRIPTION;

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

// JSON-LD: POS product and UK-wide service coverage
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShopOps",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${SITE_URL}/pos`,
  description: DESCRIPTION,
  areaServed: { "@type": "Country", name: "United Kingdom" },
  publisher: {
    "@type": "Organization",
    name: "ShopOps",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
};

type PosPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function PosPage({ searchParams }: PosPageProps) {
  const requestedLang = parseQueryLang((await searchParams).lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LangProvider
        key={requestedLang ?? "stored"}
        initialLang={requestedLang}
        persistInitialLang={requestedLang !== undefined}
        ownsDocumentLang
      >
        <PosLanding />
      </LangProvider>
    </>
  );
}
