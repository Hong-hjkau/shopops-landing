"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";
import SocialLinks from "@/components/SocialLinks";
import type { Lang } from "@/lib/i18n";

export type NavLink = { href: string; label: string };

const LANGS: { key: Lang; label: string }[] = [
  { key: "zh-Hant", label: "繁" },
  { key: "zh-Hans", label: "简" },
  { key: "en", label: "EN" },
];

// Header 自己嘅 chrome 文案。頁面傳入嘅係佢哋自己嘅 nav / CTA 文字,呢兩個掣屬於
// header 本身,所以同 LANGS 一樣擺喺呢度,唔使四個 caller 各自傳一次。
const MENU_LABELS: Record<Lang, { open: string; close: string; title: string }> = {
  "zh-Hant": { open: "開啟選單", close: "關閉選單", title: "網站選單" },
  "zh-Hans": { open: "打开菜单", close: "关闭菜单", title: "网站菜单" },
  en: { open: "Open menu", close: "Close menu", title: "Site menu" },
};

export default function SiteHeader({
  navLinks,
  cta,
  languageHrefs,
}: {
  navLinks: NavLink[];
  cta: { href: string; label: string };
  languageHrefs?: Record<Lang, string>;
}) {
  const { lang, setLang } = useLang();
  const menu = MENU_LABELS[lang];
  // `open` 淨係服務 `aria-expanded` —— 開關本身係 native dialog 做。兩者由 `onClose`
  // 收口:無論係撳關掣、撳 backdrop 定係 Escape,都行同一條路。
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 開住抽屜再轉橫屏 / 放大窗到 `lg`，個 dialog 會俾 `lg:hidden` 整成 display:none，
  // 但佢**仍然係 open** —— modal 令背景 inert，而關掣同漢堡掣兩個都睇唔到，用戶就
  // 卡死喺一版撳唔到嘢嘅頁面。所以一過 `lg` 就主動收咗佢（`onClose` 會還返 focus）。
  useEffect(() => {
    if (!open) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    const closeIfWide = () => {
      if (wide.matches) dialogRef.current?.close();
    };
    closeIfWide();
    wide.addEventListener("change", closeIfWide);
    return () => wide.removeEventListener("change", closeIfWide);
  }, [open]);

  // native modal 只令背景 inert，唔會鎖捲動：開住抽屜碌手指，後面成版照郁，關返
  // 就唔喺原來位置。所以開嘅時候鎖 <html> 捲動。還原掛喺 cleanup —— `open` 由
  // `onClose` 收口（關掣／Escape／backdrop／撳 link 全部行嗰條），加埋 unmount，
  // 冇一條路會留低一版鎖死嘅頁。
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  function openMenu() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  const languageSwitcher = (
    <div className="flex items-center rounded-full bg-white/10 p-0.5 text-xs font-medium ring-1 ring-white/10">
      {LANGS.map((l) => (
        languageHrefs ? (
          <Link
            key={l.key}
            href={languageHrefs[l.key]}
            className={`rounded-full px-3 py-1 transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg ${
              lang === l.key
                ? "bg-hero-text text-hero-bg"
                : "text-hero-text-secondary hover:text-hero-text"
            }`}
            aria-current={lang === l.key ? "page" : undefined}
          >
            {l.label}
          </Link>
        ) : (
          <button
            key={l.key}
            onClick={() => setLang(l.key)}
            className={`rounded-full px-3 py-1 transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg ${
              lang === l.key
                ? "bg-hero-text text-hero-bg"
                : "text-hero-text-secondary hover:text-hero-text"
            }`}
            aria-pressed={lang === l.key}
          >
            {l.label}
          </button>
        )
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-hero-border bg-hero-bg/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          aria-label="ShopOps home"
          className="flex items-center gap-2 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg"
        >
          <Image src="/logo-icon.png" alt="" width={512} height={496} className="h-8 w-auto" />
          <span className="hidden text-lg font-bold tracking-tight text-hero-text sm:inline">
            ShopOps
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 text-sm text-hero-text-secondary lg:gap-3 lg:text-xs xl:gap-6 xl:text-sm">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded transition hover:text-hero-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {/* 手機寬度頂欄放唔落（320px 會將 logo 擠到得返幾 px），`sm` 以下搬入抽屜。 */}
          <div className="hidden sm:flex">
            <SocialLinks dark compact />
          </div>
          {/* 語言掣兩邊都見到 —— 唔搬入抽屜。搬咗嘅話手機用戶要多撳一下先轉到語言,
              而喺 header 同抽屜各放一套就會喺 accessibility tree 出現兩份同名控件。 */}
          {languageSwitcher}
          <a
            href={cta.href}
            className="hidden rounded-lg bg-hero-text px-4 py-2 text-sm font-semibold text-hero-bg transition hover:bg-hero-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg sm:inline-flex"
          >
            {cta.label}
          </a>
          {/* 窄screen 嘅導覽入口。desktop nav 由 `lg` 起先出現,所以呢個掣去到 `lg` 就收。 */}
          <button
            ref={triggerRef}
            type="button"
            onClick={openMenu}
            aria-label={menu.open}
            aria-expanded={open}
            aria-controls="site-mobile-navigation"
            data-site-menu-trigger
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-hero-text transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg lg:hidden"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 用原生 <dialog> + showModal():Escape、背景 inert、focus 困喺入面全部由瀏覽器
          負責,唔使自己寫 focus trap。同 `PosImageDialog` 行同一套,唔好喺呢個 repo
          養第二種 modal 寫法。 */}
      <dialog
        ref={dialogRef}
        id="site-mobile-navigation"
        aria-label={menu.title}
        data-site-mobile-nav
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-hero-bg p-0 text-hero-text backdrop:bg-black/75 lg:hidden"
      >
        <div className="flex h-full flex-col gap-6 p-4 sm:p-6">
          <div className="flex items-center justify-end">
            {/* 唔用 `autoFocus`：個 dialog 由頭到尾都 mount 住（淨係冇 open），React 會喺
                頁面載入嗰刻就試住 focus 佢，同頁面正常 focus 次序打交。`showModal()`
                本身就會 focus 入面第一個可 focus 元素 —— 即係呢個關掣。 */}
            <button
              type="button"
              onClick={closeMenu}
              aria-label={menu.close}
              data-site-menu-close
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-2xl leading-none text-hero-text transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav aria-label={menu.title} className="flex flex-col gap-1 text-lg text-hero-text">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                // 同頁 anchor 唔會令 dialog 自己收,唔關佢個抽屜就會遮住跳過去嗰段。
                onClick={closeMenu}
                className="rounded-lg px-2 py-3 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href={cta.href}
            onClick={closeMenu}
            className="rounded-lg bg-hero-text px-4 py-3 text-center text-base font-semibold text-hero-bg transition hover:bg-hero-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg"
          >
            {cta.label}
          </a>
          {/* 頂欄喺 `sm` 以下收起咗嘅聯絡連結，喺呢度補返（`sm` 以上頂欄本身有）。 */}
          <div className="sm:hidden">
            <SocialLinks dark />
          </div>
        </div>
      </dialog>
    </header>
  );
}
