import Link from "next/link";

// 文末轉化區（漏斗出口）。Step 1 唔整獨立 gated PDF，先 reuse 首頁既有
// savings calculator + demo 聯絡表做 conversion，已係完整漏斗。
// 將來 Step 2 換成「留 email 攞免費佣金計算表 PDF」再改呢個 component。
export default function LeadMagnet() {
  return (
    <aside className="my-10 rounded-2xl border border-orange-200 bg-orange-50 p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
        Work out your own numbers
      </p>
      <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">
        See how much delivery commission is really costing you
      </h3>
      <p className="mt-3 text-gray-700 leading-relaxed">
        ShopOps is an all-in-one ordering system for small UK restaurants — QR
        self-ordering, staff POS and your own takeaway site, so repeat customers
        order direct and you keep what the apps would have taken. Use the free
        savings calculator to see the gap, or book a quick demo.
      </p>
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Link
          href="/#savings"
          className="inline-flex justify-center px-5 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition"
        >
          Try the savings calculator
        </Link>
        <Link
          href="/#contact"
          className="inline-flex justify-center px-5 py-3 border border-gray-300 text-gray-800 rounded-xl font-semibold text-sm hover:bg-white transition"
        >
          Book a free demo
        </Link>
      </div>
    </aside>
  );
}
