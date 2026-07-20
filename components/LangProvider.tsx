"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

const STORAGE_KEY = "shopops-lang";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  // SSR 同首次 client render 都用預設,避免 hydration mismatch;mount 後先由 localStorage 還原
  // 預設英文 —— 對外主要客群係英國;香港用戶切一次中文會記入 localStorage
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
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
      }
    } catch {
      // localStorage read 唔可用(cookies 全禁/SecurityError)→ 維持預設語言,唔好 crash 成頁
      // (下面個 setLang setter 已有對應 guard)
    }
  }, []);

  // 同步 <html lang> 同當前語言。SSR 時 layout.tsx hardcode "en"（同上面預設
  // 一致，避 hydration mismatch）；client 端語言一變就更新 DOM。
  // 好處：①螢幕閱讀器用啱語言發音 ②簡體時 lang="zh-Hans"，瀏覽器揀啱 SC 字型
  // fallback（唔會用繁體 TC 字型去 render 簡體）。
  // 三個值（zh-Hant / zh-Hans / en）都係有效 BCP 47 標籤，直接 assign。
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // localStorage 唔可用(隱私模式等)→ 純記憶體 fallback,唔影響切換
    }
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang 必須喺 <LangProvider> 入面用");
  return ctx;
}
