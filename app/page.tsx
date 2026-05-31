"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuMockup, BoardMockup, OfflineMockup, AdminMockup } from "@/components/mockups";

type Lang = "zh" | "en";
type FormStatus = "idle" | "sending" | "sent" | "error";

const MOCKUPS = [MenuMockup, BoardMockup, OfflineMockup, AdminMockup];

const dict = {
  zh: {
    nav: { features: "功能", contact: "聯絡我們", cta: "預約 Demo" },
    hero: {
      eyebrow: "Edinburgh 餐廳專用",
      title: "一套 ShopOps，搞掂全店點餐",
      subtitle:
        "QR 自助點餐、員工 POS、後台訂單管理、桌況打剔，一個系統打通客人、樓面、廚房。仲有離線方案，斷網都繼續做生意。",
      ctaPrimary: "預約 Demo",
      ctaSecondary: "睇下有咩功能",
    },
    features: {
      title: "為餐廳實戰而設嘅 4 大功能",
      items: [
        {
          icon: "🍽️",
          title: "三合一點餐",
          desc: "客人 scan QR 自助落單、員工 POS 一頁搞掂堂食 + 外賣、客人手機自取預訂。三個入口，同一個後台。",
        },
        {
          icon: "📊",
          title: "即時訂單看板",
          desc: "訂單按進度自動分三組顯示 — 等緊做、做緊、做完，廚房一眼睇晒邊張單到咩階段。桌況頁仲可以逐件菜打剔，樓面即時知邊枱出齊。",
        },
        {
          icon: "🔌",
          title: "斷網繼續做生意",
          desc: "就算雲端死咗、WiFi 斷咗，本機後備即時頂上，餐廳照樣落單、廚房照樣出菜。其他人雲端 POS 死晒嗰陣，你照賺。",
        },
        {
          icon: "📝",
          title: "彈性菜單管理",
          desc: "套餐選項組、午晚市時段切換、即時上落架，全部喺後台一鍵搞掂，唔需要等工程師。",
        },
      ],
    },
    contact: {
      title: "想睇 demo 或者了解多啲？",
      subtitle: "留低資料我哋會聯絡你，安排一次免費 30 分鐘 demo。",
      nameLabel: "你嘅名 / 餐廳名",
      namePlaceholder: "例：陳生 / Joy Kitchen",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "想了解咩？",
      messagePlaceholder: "例：我哋係 10 枱嘅 cafe，想睇下 POS 同 QR 點餐點 work...",
      submitIdle: "發送查詢",
      submitSending: "發送中...",
      submitSent: "已收到！我哋會盡快聯絡你",
      submitError: "發送失敗，請直接 email 或稍後再試",
      orEmail: "或直接 email：",
      note: "目前只服務 Edinburgh 區小型餐廳（堂食、外賣、雲廚房）。",
    },
    footer: "© 2026 ShopOps · Edinburgh",
  },
  en: {
    nav: { features: "Features", contact: "Contact", cta: "Book a Demo" },
    hero: {
      eyebrow: "Built for Edinburgh restaurants",
      title: "One ShopOps, every order handled",
      subtitle:
        "QR self-ordering, staff POS, kitchen Kanban, table tracking — one system connecting your customers, floor and kitchen. Plus an offline backup that keeps you trading when the cloud goes down.",
      ctaPrimary: "Book a Demo",
      ctaSecondary: "See features",
    },
    features: {
      title: "Four features built for real restaurant use",
      items: [
        {
          icon: "🍽️",
          title: "Three ways to order",
          desc: "Diners scan a QR to self-order, staff use one POS for dine-in + takeaway, customers pre-order on their phone. Three entry points, one dashboard.",
        },
        {
          icon: "📊",
          title: "Live order board",
          desc: "Orders flow through three stages — Pending, In Progress, Done — so the kitchen always sees what's next. The table view lets floor staff tick off each dish as it leaves the kitchen.",
        },
        {
          icon: "🔌",
          title: "Keep trading offline",
          desc: "When the cloud or WiFi goes down, a local backup keeps the restaurant running — orders in, food out. While competitors' cloud-only POS stops, you keep ringing sales.",
        },
        {
          icon: "📝",
          title: "Flexible menu control",
          desc: "Set-meal option groups, lunch/dinner sessions, instant item availability — all from the admin panel. No engineer required.",
        },
      ],
    },
    contact: {
      title: "Want a demo or just have questions?",
      subtitle: "Leave your details and we'll arrange a free 30-minute demo.",
      nameLabel: "Your name / restaurant",
      namePlaceholder: "e.g. Joy Kitchen",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "What would you like to know?",
      messagePlaceholder: "e.g. We're a 10-table cafe looking to see how the POS and QR ordering works...",
      submitIdle: "Send enquiry",
      submitSending: "Sending...",
      submitSent: "Got it! We'll be in touch shortly.",
      submitError: "Send failed. Please email us directly or try again.",
      orEmail: "Or email directly:",
      note: "Currently serving small Edinburgh restaurants (dine-in, takeaway, cloud kitchens).",
    },
    footer: "© 2026 ShopOps · Edinburgh",
  },
} as const;

// 真實聯絡 email 由 NEXT_PUBLIC_CONTACT_EMAIL 提供（換域名唔使改 code）；未設先用 placeholder
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@shopops.example";

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const t = dict[lang];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, lang }),
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

  return (
    <main className="flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="#top" className="flex items-center">
            <span className="font-bold text-gray-900 text-lg tracking-tight">ShopOps</span>
          </a>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition">
              {t.nav.features}
            </a>
            <a href="#contact" className="hover:text-gray-900 transition">
              {t.nav.contact}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs font-medium">
              <button
                onClick={() => setLang("zh")}
                className={`px-3 py-1 rounded-full transition ${
                  lang === "zh" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                aria-pressed={lang === "zh"}
              >
                中
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full transition ${
                  lang === "en" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                aria-pressed={lang === "en"}
              >
                EN
              </button>
            </div>
            <a
              href="#contact"
              className="hidden sm:inline-flex px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition"
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <Image
            src="/logo.png"
            alt="ShopOps"
            width={288}
            height={162}
            priority
            className="mx-auto mb-6 sm:mb-8 w-56 sm:w-72 h-auto"
          />
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-4">
            {t.hero.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            {t.hero.title}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#contact"
              className="px-6 py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#features"
              className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold text-base hover:bg-gray-50 transition"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50 border-y border-gray-100"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.features.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.features.items.map((item, idx) => {
              const Mockup = MOCKUPS[idx];
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition"
                >
                  <div className="mb-5 bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                    <Mockup />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.contact.title}</h2>
            <p className="mt-4 text-gray-600">{t.contact.subtitle}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.contact.nameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contact.namePlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.contact.emailLabel}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.contact.emailPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.contact.messageLabel}
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contact.messagePlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition disabled:opacity-60"
            >
              {status === "sending" ? t.contact.submitSending : t.contact.submitIdle}
            </button>

            {status === "sent" && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
                {t.contact.submitSent}
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                {t.contact.submitError}
              </p>
            )}

            <p className="text-xs text-gray-500 text-center pt-2">
              {t.contact.orEmail}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  lang === "zh" ? "ShopOps Demo 查詢" : "ShopOps Demo Enquiry"
                )}`}
                className="font-semibold text-gray-700 hover:text-gray-900 underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </form>

          <p className="mt-8 text-sm text-gray-500 text-center">{t.contact.note}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-8 border-t border-gray-100 text-center text-sm text-gray-500">
        {t.footer}
      </footer>
    </main>
  );
}
