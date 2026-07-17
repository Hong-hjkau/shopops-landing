import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "ShopOps — Edinburgh 餐廳點餐管理系統";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return renderOgImage({
    eyebrow: "Built for Edinburgh restaurants",
    title: "One ShopOps, every order handled.",
    tags: ["QR ordering", "Staff POS", "Kitchen board", "Offline-ready"],
    cta: "Book a demo",
  });
}
