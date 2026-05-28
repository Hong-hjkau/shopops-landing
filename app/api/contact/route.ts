import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  lang?: "zh" | "en";
};

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// In-memory rate limit: 5 requests / 10 min per IP.
// Best-effort — resets on serverless cold start; upgrade to Upstash Redis
// (@upstash/ratelimit) if spam survives the cold-start gap.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const ipHits = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const fresh = (ipHits.get(ip) ?? []).filter((t) => t > cutoff);
  if (fresh.length >= RATE_MAX) {
    ipHits.set(ip, fresh);
    return true;
  }
  fresh.push(now);
  ipHits.set(ip, fresh);
  return false;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
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
  const lang = body.lang === "en" ? "en" : "zh";

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
  const subjectPrefix = lang === "zh" ? "ShopOps Demo 查詢" : "ShopOps Demo Enquiry";

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
