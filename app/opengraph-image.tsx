import { COPY } from "@/lib/brand";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "ShopOps — Custom Software & Business Automation";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return renderOgImage({
    eyebrow: COPY.eyebrow,
    title: COPY.title,
    tags: COPY.tags,
    cta: COPY.cta,
  });
}
