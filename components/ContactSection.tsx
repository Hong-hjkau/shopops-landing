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
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("[contact] 表單提交失敗：", err);
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
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{copy.title}</h2>
          <p className="mt-4 text-gray-600">{copy.subtitle}</p>
          <p className="mt-2 text-sm font-medium text-orange-600">{copy.reassure}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.nameLabel}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleFieldChange(setName, e.target.value)}
              placeholder={copy.namePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.emailLabel}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => handleFieldChange(setEmail, e.target.value)}
              placeholder={copy.emailPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.messageLabel}</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => handleFieldChange(setMessage, e.target.value)}
              placeholder={copy.messagePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition disabled:opacity-60"
          >
            {status === "sending" ? copy.submitSending : copy.submitIdle}
          </button>

          {status === "sent" && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
              {copy.submitSent}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
              {copy.submitError}
            </p>
          )}

          <p className="text-xs text-gray-500 text-center pt-2">
            {copy.orEmail}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${mailtoSubject}`}
              className="font-semibold text-gray-700 hover:text-gray-900 underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </form>

        <p className="mt-8 text-sm text-gray-500 text-center">{copy.note}</p>
      </div>
    </section>
  );
}
