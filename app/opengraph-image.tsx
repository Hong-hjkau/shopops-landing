import { POS_CONTENT } from "@/lib/pos-content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "ShopOps POS — Bilingual Restaurant POS for UK Restaurants";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return renderOgImage({
    eyebrow: POS_CONTENT.en.hero.eyebrow,
    title: POS_CONTENT.en.hero.title,
    tags: ["QR ordering", "Kitchen screens", "Offline backup"],
    cta: "Book a demo",
  });
}
