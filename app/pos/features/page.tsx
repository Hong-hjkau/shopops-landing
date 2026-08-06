import type { Metadata } from "next";
import PosFeaturesLanding from "@/components/PosFeaturesLanding";
import { LangProvider } from "@/components/LangProvider";
import { parseQueryLang } from "@/lib/language";
import { POS_FEATURES_CONTENT } from "@/lib/pos-features-content";
import { SITE_URL } from "@/lib/site";

type PosFeaturesPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: PosFeaturesPageProps): Promise<Metadata> {
  const lang = parseQueryLang((await searchParams).lang) ?? "en";
  const copy = POS_FEATURES_CONTENT[lang].metadata;

  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: "/pos/features" },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${SITE_URL}/pos/features?lang=${lang}`,
      type: "website",
      siteName: "ShopOps",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
  };
}

export default async function PosFeaturesPage({ searchParams }: PosFeaturesPageProps) {
  const requestedLang = parseQueryLang((await searchParams).lang) ?? "en";

  return (
    <LangProvider
      key={requestedLang}
      initialLang={requestedLang}
      persistInitialLang
      ownsDocumentLang
    >
      <PosFeaturesLanding lang={requestedLang} />
    </LangProvider>
  );
}
