"use client";

import { type FormEvent, useState } from "react";

/**
 * คำนวณค่าชดเชยเลิกจ้าง — ตามมาตรา 118 พ.ร.บ.คุ้มครองแรงงาน พ.ศ. 2541
 *
 * SETUP NOTES (Next.js App Router):
 * - This is a client component ("use client") because it uses useState.
 * - Put this inside app/คำนวณ-คาชดเชย-เลิกจ้าง/page.tsx, and export
 *   `metadata` (title, description) from a separate server component
 *   wrapper or directly in page.tsx if this file itself becomes the page
 *   (metadata export is NOT allowed in a "use client" file — Next.js
 *   requires metadata in a server component).
 * - Fonts: use next/font/google to load "Source Serif 4" (headline) and
 *   "Inter" (body/data) instead of a <link> tag, so they're bundled
 *   properly and don't hurt Core Web Vitals.
 * - Tailwind: assumes Tailwind is already configured in the project
 *   (same setup already used for the clothing-brand landing page).
 */

type Tier = {
  minDays?: number;
  minYears?: number;
  maxYears: number;
  payDays: number;
  label: string;
};

type Result =
  | { eligible: false; totalDays: number }
  | {
      eligible: true;
      tier: Tier;
      dailyWage: number;
      amount: number;
      totalDays: number;
      yearsWorked: string;
    };
const TIERS = [
  { minDays: 120, minYears: 0, maxYears: 1, payDays: 30, label: "120 วัน – ไม่ครบ 1 ปี" },
  { minYears: 1, maxYears: 3, payDays: 90, label: "1 ปี – ไม่ครบ 3 ปี" },
  { minYears: 3, maxYears: 6, payDays: 180, label: "3 ปี – ไม่ครบ 6 ปี" },
  { minYears: 6, maxYears: 10, payDays: 240, label: "6 ปี – ไม่ครบ 10 ปี" },
  { minYears: 10, maxYears: 20, payDays: 300, label: "10 ปี – ไม่ครบ 20 ปี" },
  { minYears: 20, maxYears: Infinity, payDays: 400, label: "20 ปีขึ้นไป" },
];

function getTier(totalDays: number, totalYears: number): Tier | null {
  if (totalDays < 120) return null;
  if (totalYears < 1) return TIERS[0];
  if (totalYears < 3) return TIERS[1];
  if (totalYears < 6) return TIERS[2];
  if (totalYears < 10) return TIERS[3];
  if (totalYears < 20) return TIERS[4];
  return TIERS[5];
}

function diffDaysAndYears(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  const totalDays = Math.floor(ms / (1000 * 60 * 60 * 24));
  const totalYears = totalDays / 365.25;
  return { totalDays, totalYears };
}

export default function SeveranceCalculator() {
  const [salary, setSalary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function handleCalculate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setResult(null);

    const salaryNum = Number(salary);
    if (!salaryNum || salaryNum <= 0) {
      setError("กรอกเงินเดือนให้ถูกต้อง");
      return;
    }
    if (!startDate || !endDate) {
      setError("กรอกวันที่เริ่มงานและวันที่เลิกจ้างให้ครบ");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      setError("วันที่เลิกจ้างต้องอยู่หลังวันที่เริ่มงาน");
      return;
    }

    const { totalDays, totalYears } = diffDaysAndYears(start, end);
    const tier = getTier(totalDays, totalYears);

    if (!tier) {
      setResult({ eligible: false, totalDays });
      return;
    }

    const dailyWage = salaryNum / 30;
    const amount = Math.round(dailyWage * tier.payDays);

    setResult({
      eligible: true,
      tier,
      dailyWage,
      amount,
      totalDays,
      yearsWorked: (totalDays / 365.25).toFixed(1),
    });
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-stone-800">
      {/* ---------- Hero + calculator ---------- */}
      <h1 className="font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">
        คำนวณค่าชดเชยเลิกจ้าง
      </h1>
      <p className="mt-2 text-stone-600">
        กรอกเงินเดือนและวันที่ทำงาน ระบบคำนวณให้ตามมาตรา 118
        พ.ร.บ.คุ้มครองแรงงาน
      </p>

      <form
        onSubmit={handleCalculate}
        className="mt-8 space-y-5 rounded-xl border border-stone-200 bg-white p-6"
      >
        <div>
          <label htmlFor="salary" className="block text-sm text-stone-600">
            เงินเดือน (บาท)
          </label>
          <input
            id="salary"
            type="number"
            inputMode="numeric"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="15000"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-lg focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start" className="block text-sm text-stone-600">
              วันที่เริ่มงาน
            </label>
            <input
              id="start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>
          <div>
            <label htmlFor="end" className="block text-sm text-stone-600">
              วันที่เลิกจ้าง
            </label>
            <input
              id="end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>
        </div>

        {error && <p className="text-sm text-amber-700">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-700 py-3 font-medium text-white transition hover:bg-teal-800"
        >
          คำนวณ
        </button>
      </form>

      {/* ---------- Result ---------- */}
      {result && (
        <div className="mt-6 rounded-xl border border-teal-700/20 bg-teal-50 p-6">
          {result.eligible ? (
            <>
              <p className="text-sm text-stone-600">
                อายุงาน {result.yearsWorked} ปี — อยู่ในเกณฑ์{" "}
                {result.tier.label} ({result.tier.payDays} วัน)
              </p>
              <p className="mt-2 font-serif text-4xl text-teal-800">
                {result.amount.toLocaleString("th-TH")} บาท
              </p>
              <p className="mt-2 text-sm text-stone-500">
                คิดจาก {(result.dailyWage).toLocaleString("th-TH", { maximumFractionDigits: 2 })}{" "}
                บาท/วัน × {result.tier.payDays} วัน
              </p>
              <button
                onClick={() => {
                  const text = `ค่าชดเชยเลิกจ้างที่ควรได้รับ: ${result.amount.toLocaleString("th-TH")} บาท`;
                  if (navigator.share) {
                    navigator.share({ text });
                  } else {
                    navigator.clipboard.writeText(text);
                  }
                }}
                className="mt-4 text-sm font-medium text-teal-800 underline underline-offset-2"
              >
                แชร์ผลลัพธ์นี้
              </button>
            </>
          ) : (
            <p className="text-stone-700">
              อายุงานต่ำกว่า 120 วัน — ตามกฎหมายยังไม่เข้าเกณฑ์ได้รับค่าชดเชย
            </p>
          )}
        </div>
      )}

      {/* ---------- Explanatory content (needed for SEO — real text, not just a form) ---------- */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl text-stone-900">
          อัตราค่าชดเชยเต็มตามมาตรา 118
        </h2>
        <table className="mt-4 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-300 text-stone-500">
              <th className="py-2 font-normal">อายุงาน</th>
              <th className="py-2 font-normal">ค่าชดเชย</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t) => (
              <tr key={t.label} className="border-b border-stone-100">
                <td className="py-2">{t.label}</td>
                <td className="py-2">{t.payDays} วัน</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-8 font-serif text-xl text-stone-900">
          กรณีที่นายจ้างไม่ต้องจ่ายค่าชดเชย
        </h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-stone-700">
          <li>ลูกจ้างลาออกเอง</li>
          <li>ทุจริตต่อหน้าที่ หรือกระทำความผิดอาญาโดยเจตนาต่อนายจ้าง</li>
          <li>จงใจทำให้นายจ้างได้รับความเสียหาย</li>
          <li>ฝ่าฝืนข้อบังคับการทำงานร้ายแรง หรือฝ่าฝืนซ้ำหลังถูกตักเตือนเป็นหนังสือ</li>
        </ul>
      </section>

      {/* ---------- FAQ (with schema for SEO) ---------- */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl text-stone-900">คำถามที่พบบ่อย</h2>
        <div className="mt-4 space-y-6">
          <div>
            <p className="font-medium text-stone-900">
              ทดลองงานถูกเลิกจ้าง ได้ค่าชดเชยไหม
            </p>
            <p className="mt-1 text-stone-700">
              ถ้าทำงานมาแล้วไม่ถึง 120 วัน กฎหมายยังไม่คุ้มครองส่วนนี้
              นายจ้างไม่ต้องจ่ายค่าชดเชย แต่ถ้าเกิน 120 วันแล้วแม้จะยังอยู่ในช่วงทดลองงาน
              ก็เข้าเกณฑ์ได้รับค่าชดเชยตามอายุงาน
            </p>
          </div>
          <div>
            <p className="font-medium text-stone-900">ลาออกเอง ได้ค่าชดเชยหรือเปล่า</p>
            <p className="mt-1 text-stone-700">
              ไม่ได้ ค่าชดเชยตามมาตรา 118 มีไว้สำหรับกรณีนายจ้างเป็นฝ่ายเลิกจ้างเท่านั้น
            </p>
          </div>
          <div>
            <p className="font-medium text-stone-900">
              ค่าชดเชยเลิกจ้าง ต้องเสียภาษีไหม
            </p>
            <p className="mt-1 text-stone-700">
              เงินชดเชยตามกฎหมายแรงงานมีสิทธิได้รับยกเว้นภาษีบางส่วนตามเงื่อนไขที่กรมสรรพากรกำหนด
              ควรตรวจสอบอัตรายกเว้นปัจจุบันก่อนยื่นภาษี
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}