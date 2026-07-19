import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Rota — Staff Scheduling & Clock-in";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return renderOgImage({
    eyebrow: "Scheduling & attendance",
    title: "Rotas and clock-in, run from Telegram.",
    tags: ["Rota grid", "Location clock-in", "Shift swaps", "Hours export"],
    cta: "Free trial",
  });
}
