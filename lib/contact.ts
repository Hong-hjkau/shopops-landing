import type { Lang } from "@/lib/i18n";

// 聯絡查詢來源:決定 email 主題前綴,等老闆一睇就知邊個產品/場景嘅 lead。
// POS 帶「Demo」字眼;產品頁帶產品名;公司頁係一般項目查詢。
export type ContactSource = "company" | "pos" | "rota";

// 訊息長度上限。server 驗證同 client 顯示共用一個數,唔好兩邊各寫一個。
export const MESSAGE_MAX_LENGTH = 2000;

// server 拒收過長訊息時回嘅固定 error 字串。client 靠佢分辨「太長」定係其他 400,
// 唔靠自己數 message.length 猜 —— server 係先驗 email 後驗長度,猜會報錯原因
// (email 格式錯 + 長訊息 → 會誤報「太長」,用戶點縮短都失敗)。
export const ERROR_MESSAGE_TOO_LONG = "Message too long.";

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
