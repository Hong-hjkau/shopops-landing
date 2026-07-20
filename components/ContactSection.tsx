"use client";

import { useState } from "react";
import { useLang } from "@/components/LangProvider";
import { enquirySubject, type ContactSource } from "@/lib/contact";

export type ContactCopy = {
  title: string;
  subtitle: string;
  reassure: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitIdle: string;
  submitSending: string;
  submitSent: string;
  submitError: string;
  submitErrorTooLong: string;
  submitErrorRateLimit: string;
  orEmail: string;
  note: string;
};

type FormStatus = "idle" | "sending" | "sent" | "error";

// 聯絡 email；可由 NEXT_PUBLIC_CONTACT_EMAIL 覆寫,未設就用真實預設地址
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@shopops.co.uk";

export default function ContactSection({
  copy,
  source,
}: {
  copy: ContactCopy;
  source: ContactSource;
}) {
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorKind, setErrorKind] = useState<"generic" | "tooLong" | "rateLimit">("generic");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, lang, source }),
      });
      if (!res.ok) {
        setErrorKind(
          res.status === 429 ? "rateLimit" : message.length > 2000 ? "tooLong" : "generic"
        );
        setStatus("error");
        return;
      }
      setErrorKind("generic");
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("[contact] 表單提交失敗：", err);
      setErrorKind("generic");
      setStatus("error");
    }
  }

  // 送出失敗 / 成功後再改任何欄位,清走舊狀態 banner
  function handleFieldChange(setter: (v: string) => void, value: string) {
    setter(value);
    if (status === "error" || status === "sent") setStatus("idle");
  }

  const mailtoSubject = encodeURIComponent(enquirySubject(source, lang));

  return (
    <section id="contact" className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-text">{copy.title}</h2>
          <p className="mt-4 text-text-secondary">{copy.subtitle}</p>
          <p className="mt-2 text-sm font-medium text-accent-strong">{copy.reassure}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-4"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm font-semibold text-text mb-1.5">{copy.nameLabel}</label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => handleFieldChange(setName, e.target.value)}
              placeholder={copy.namePlaceholder}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-strong"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-semibold text-text mb-1.5">{copy.emailLabel}</label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => handleFieldChange(setEmail, e.target.value)}
              placeholder={copy.emailPlaceholder}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-strong"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-semibold text-text mb-1.5">{copy.messageLabel}</label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => handleFieldChange(setMessage, e.target.value)}
              placeholder={copy.messagePlaceholder}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-strong resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-4 bg-accent text-on-accent rounded-xl font-bold text-base hover:bg-accent-hover transition disabled:opacity-60"
          >
            {status === "sending" ? copy.submitSending : copy.submitIdle}
          </button>

          {status === "sent" && (
            <p className="text-sm text-success bg-success-bg border border-success/30 rounded-lg px-3 py-2 text-center">
              {copy.submitSent}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-danger bg-danger-bg border border-danger/30 rounded-lg px-3 py-2 text-center">
              {errorKind === "tooLong"
                ? copy.submitErrorTooLong
                : errorKind === "rateLimit"
                  ? copy.submitErrorRateLimit
                  : copy.submitError}
            </p>
          )}

          <p className="text-xs text-text-secondary text-center pt-2">
            {copy.orEmail}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${mailtoSubject}`}
              className="font-semibold text-accent-strong hover:text-accent-strong-hover underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </form>

        <p className="mt-8 text-sm text-text-secondary text-center">{copy.note}</p>
      </div>
    </section>
  );
}
