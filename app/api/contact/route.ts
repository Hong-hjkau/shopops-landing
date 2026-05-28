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

export async function POST(req: Request) {
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
