import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  lang?: "zh-Hant" | "zh-Hans" | "en";
};

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// Upstash Redis sliding-window rate limit: 5 requests / 10 min per IP.
// Persistent across serverless cold starts. Falls back to no-op if env vars
// are missing (dev mode); fail-open if Upstash is unreachable.
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "shopops-landing:contact",
        analytics: true,
      })
    : null;

// 未設定自家寄件域名時 fallback 去 Resend 測試 sender（email 仍會寄達，但易入 spam）— 開機提醒一次
if (!process.env.CONTACT_FROM_EMAIL) {
  console.warn("[contact] CONTACT_FROM_EMAIL 未設定，將用 Resend 測試寄件人 onboarding@resend.dev");
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

async function isRateLimited(ip: string): Promise<boolean> {
  if (!ratelimit) {
    console.warn("[contact] Upstash not configured — rate limit disabled");
    return false;
  }
  try {
    const { success } = await ratelimit.limit(ip);
    return !success;
  } catch (e) {
    console.error("[contact] Rate limit check failed (fail-open):", e);
    return false;
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey || !to) {
    return NextResponse.json(
      { error: "Contact service is not configured. Set RESEND_API_KEY and CONTACT_TO_EMAIL." },
      { status: 503 }
    );
  }

  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  const lang =
    body.lang === "en" ? "en" : body.lang === "zh-Hans" ? "zh-Hans" : "zh-Hant";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message too long." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const subjectPrefix =
    lang === "en"
      ? "ShopOps Demo Enquiry"
      : lang === "zh-Hans"
        ? "ShopOps Demo 咨询"
        : "ShopOps Demo 查詢";

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `${subjectPrefix} — ${name}`,
    text: `From: ${name} <${email}>\nLang: ${lang}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: error.message ?? "Send failed." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
