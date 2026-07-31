import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "ShopOps POS — Bilingual Restaurant POS for UK Restaurants";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return renderOgImage({
    eyebrow: "Built for UK restaurants",
    title: "Bilingual POS for orders, kitchen and checkout.",
    tags: ["QR ordering", "Staff POS", "Kitchen screen", "Offline backup"],
    cta: "Book a demo",
  });
}
