import type { Lang } from "@/lib/i18n";

// 聯絡查詢來源:POS 頁係「預約 Demo」場景,公司頁係一般項目查詢。
export type ContactSource = "company" | "pos";

// 查詢 email 主題前綴(三語)。client 端 mailto fallback 同 server 端 Resend email 共用,
// 避免兩處各寫一份。POS 帶「Demo」字眼,公司頁去走。
export function enquirySubject(source: ContactSource, lang: Lang): string {
  const demo = source === "pos";
  if (lang === "en") return demo ? "ShopOps Demo Enquiry" : "ShopOps Enquiry";
  if (lang === "zh-Hans") return demo ? "ShopOps Demo 咨询" : "ShopOps 咨询";
  return demo ? "ShopOps Demo 查詢" : "ShopOps 查詢";
}
