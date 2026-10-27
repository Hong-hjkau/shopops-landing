"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

const STORAGE_KEY = "shopops-lang";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<LangCtx | null>(null);

type LangProviderProps = {
  children: React.ReactNode;
  initialLang?: Lang;
  persistInitialLang?: boolean;
  ownsDocumentLang?: boolean;
};

// 會 nest 自己 route-level provider 嘅 route（初始語言由 server 睇 `?lang=` 定）。
const NESTED_PROVIDER_ROUTES = ["/pos", "/this-is-you"];

function isNestedProviderRoute(pathname: string): boolean {
  // 要夾正 segment 邊界 —— 淨係 `startsWith` 嘅話，將來開一條 `/this-is-you-2026`
  // 就會被當成 nest 咗 provider，root provider 讓咗位，但其實冇人負責改 <html lang>。
  return NESTED_PROVIDER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function LangProvider({
  children,
  initialLang,
  persistInitialLang = false,
  ownsDocumentLang = true,
}: LangProviderProps) {
  // SSR 同首次 client render 都用預設,避免 hydration mismatch;mount 後先由 localStorage 還原
  // 預設英文 —— 對外主要客群係英國;香港用戶切一次中文會記入 localStorage
  const [lang, setLangState] = useState<Lang>(initialLang ?? "en");
  const pathname = usePathname();
  const parentContext = useContext(LangContext);
  const hasPersistedInitialLang = useRef(false);

  useEffect(() => {
    // /pos 由 nested route provider 處理 query / storage。root provider 喺呢度
    // restore 舊 storage 會同 route 指定嘅 initial language 競爭。
    if (initialLang !== undefined || (parentContext === null && isNestedProviderRoute(pathname))) {
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "zh-Hant" || saved === "zh-Hans" || saved === "en") {
        // ⚠️ 刻意喺 effect 入面 setState —— 唔好跟 react-hooks/set-state-in-effect
        // 改走。SSR 同首次 client render 一定要用預設值（"en"），server 唔知
        // 你 localStorage 揀咗咩語言；mount 之後先由 localStorage 還原。若改成
        // 初始化時直接讀 localStorage，server render 英文、client render 中文
        // → hydration mismatch 爆 error。個 lint 規則唔知呢個 SSR context。
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(saved);

        if (parentContext !== null && parentContext.lang !== saved) {
          parentContext.setLang(saved);
        }
      }
    } catch {
      // localStorage read 唔可用(cookies 全禁/SecurityError)→ 維持預設語言,唔好 crash 成頁
      // (下面個 setLang setter 已有對應 guard)
    }
    // initialLang is deliberately read only at mount: the server and first client render
    // must use the same value, and route navigation mounts a new route-level provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!persistInitialLang || initialLang === undefined || hasPersistedInitialLang.current) {
      return;
    }

    hasPersistedInitialLang.current = true;

    try {
      localStorage.setItem(STORAGE_KEY, initialLang);
    } catch {
      // localStorage 唔可用(隱私模式等)→ 保持 server 指定嘅初始語言
    }

    // /pos route provider 係 nested；同步外層 state，令 client-side 離開 POS 後
    // 唔會即時跳返舊語言。
    if (parentContext !== null && parentContext.lang !== initialLang) {
      parentContext.setLang(initialLang);
    }
  }, [initialLang, parentContext, persistInitialLang]);

  // 同步 <html lang> 同當前語言。SSR 時 layout.tsx hardcode "en"（同上面預設
  // 一致，避 hydration mismatch）；client 端語言一變就更新 DOM。
  // 好處：①螢幕閱讀器用啱語言發音 ②簡體時 lang="zh-Hans"，瀏覽器揀啱 SC 字型
  // fallback（唔會用繁體 TC 字型去 render 簡體）。
  // 三個值（zh-Hant / zh-Hans / en）都係有效 BCP 47 標籤，直接 assign。
  //
  // ⚠️ /blog 例外：blog 外殼（nav／footer）永遠英文，每篇文章自己用
  // <div lang={post.lang}> scope（見 app/blog/layout.tsx 個註解）。若果連 blog
  // 都跟語言掣走，英文外殼就會被標成中文，screen reader 用中文音讀英文字。
  // 要明確設返 "en" 而唔係「跳過唔設」—— 由 /pos（繁體）client-side navigate
  // 入 /blog，唔設就會殘留住 zh-Hant。
  useEffect(() => {
    // 呢啲 route 會嵌套自己嘅 route-level provider（要由 server 決定初始語言）。
    // root provider 喺嗰度跳過，避免兩個 effect 爭住改 <html lang>；內層 provider
    // 則唯一負責同步。⚠️ 新開一條會 nest provider 嘅 route，記住加入呢個清單，
    // 否則 root 個 effect 行喺後面，會用佢自己嗰個語言蓋走你。
    if (!ownsDocumentLang || (isNestedProviderRoute(pathname) && parentContext === null)) return;

    document.documentElement.lang = pathname.startsWith("/blog") ? "en" : lang;
  }, [lang, ownsDocumentLang, parentContext, pathname]);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // localStorage 唔可用(隱私模式等)→ 純記憶體 fallback,唔影響切換
    }

    if (parentContext !== null && parentContext.lang !== l) {
      parentContext.setLang(l);
    }
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang 必須喺 <LangProvider> 入面用");
  return ctx;
}
