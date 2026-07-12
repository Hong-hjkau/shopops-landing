import type { Lang } from "@/lib/i18n";

// 聯絡查詢來源:決定 email 主題前綴,等老闆一睇就知邊個產品/場景嘅 lead。
// POS 帶「Demo」字眼;產品頁帶產品名;公司頁係一般項目查詢。
export type ContactSource = "company" | "pos" | "rota";

// 查詢 email 主題(三語)。client 端 mailto fallback 同 server 端 Resend email 共用,避免兩處各寫一份。
export function enquirySubject(source: ContactSource, lang: Lang): string {
  const label =
    source === "pos"
      ? "ShopOps Demo"
      : source === "rota"
        ? "Rota"
        : "ShopOps";
  const word = lang === "en" ? "Enquiry" : lang === "zh-Hans" ? "咨询" : "查詢";
  return `${label} ${word}`;
}
