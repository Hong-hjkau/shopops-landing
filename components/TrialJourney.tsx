import type { PosSharedContent } from "@/lib/pos-content";

export default function TrialJourney({
  copy,
  promoNote,
}: {
  copy: PosSharedContent["trial"];
  /**
   * 推廣資格聲明。呢個 component 講「免費試用 + 首 N 個月免費」，而嗰個免費期
   * 本身係限時推廣，所以顯示佢嘅頁面一定要有呢段條件 —— 首頁（`CompanyHome`）
   * 一度就係咁漏咗：顯示免費期、客人可以直接落查詢，但成頁冇截止日冇資格說明。
   *
   * ⚠️ **同頁已經有 pricing section 嘅話就唔好再傳**（`/pos` 就係：呢個 section
   * 同 pricing section 貼住，兩邊都出全文就變咗連續讀兩次同一段）。所以而家
   * 只有首頁傳佢。唔傳唔會靜靜漏 —— `tests/pos-features-rendered.test.mjs`
   * 對每一頁驗至少一段推廣聲明，仲會逐個「顯示緊價錢嘅 section」點名驗。
   */
  promoNote?: string;
}) {
  return (
    <section id="trial" className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.title}</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {copy.steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-border bg-surface p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-on-accent">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        {promoNote ? (
          <p data-pos-promo-note className="mt-8 text-sm leading-6 text-text-secondary">
            {promoNote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
