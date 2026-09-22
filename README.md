This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# โปรเจกต์: ศูนย์รวมเครื่องมือคำนวณสิทธิแรงงาน

เว็บไซต์รวมเครื่องมือคำนวณที่เกี่ยวกับสิทธิแรงงานไทย (ค่าชดเชยเลิกจ้าง, เงินทดแทนว่างงาน,
วันลาคงเหลือ ฯลฯ) เป้าหมายคือดึง traffic จาก SEO แล้ว monetize ผ่าน AdSense +
affiliate ทนาย/นักบัญชี ไม่ใช่เว็บบทความ — ทุกหน้าต้องเป็น "เครื่องมือที่ใช้งานได้จริง"
ไม่ใช่บทความอธิบายเฉยๆ

---

## Tech stack

- **Next.js (App Router)** — ต้องใช้ Next.js ไม่ใช่ React SPA เปล่า เพราะ SPA
  render content ด้วย JS ฝั่ง client ทำให้ Google เห็นหน้าเปล่าตอน crawl
- **Tailwind CSS** สำหรับ styling ทั้งหมด
- **next/font/google** สำหรับโหลดฟอนต์ (ห้ามใช้ `<link>` tag ธรรมดา)
- แต่ละ tool = 1 route ใต้ App Router เช่น `app/คำนวณ-คาชดเชย-เลิกจ้าง/page.tsx`

## Component structure per tool

แต่ละเครื่องมือแยกเป็น 2 ไฟล์เสมอ:

1. **`page.tsx`** (server component) — export `metadata` (title, description)
   สำหรับ SEO แล้ว import calculator component มาแสดง
2. **`<ToolName>Calculator.tsx`** (client component, มี `"use client"` บรรทัดแรก)
   — มี logic คำนวณและ UI ทั้งหมด เพราะต้องใช้ `useState`

**ห้าม** export metadata จากไฟล์ที่มี `"use client"` — Next.js ไม่รองรับ

## โครงสร้างหน้าเว็บ (ทุก tool ต้องมีครบ 5 ส่วนนี้ ตามลำดับ)

1. **Hero + ฟอร์มคำนวณ** — อยู่บนสุด เห็นและใช้ได้ทันทีโดยไม่ต้อง scroll
   ฟอร์มต้องสั้นที่สุดเท่าที่เป็นไปได้ (2-4 ช่อง)
2. **ผลลัพธ์** — คำนวณแบบ real-time ไม่ reload หน้า แสดงตัวเลขเด่นชัดที่สุดในหน้า
   พร้อม breakdown สั้นๆ ว่าคิดยังไง และปุ่มแชร์ผลลัพธ์ (ใช้ `navigator.share`
   ถ้ามี ไม่งั้น fallback เป็น `navigator.clipboard.writeText`)
3. **เนื้อหาอธิบาย** — ตารางอัตรา/เงื่อนไขเต็ม เป็น text จริงที่ Google อ่านได้
   (จำเป็นสำหรับ SEO — ฟอร์มเปล่าอย่างเดียวไม่พอ)
4. **FAQ** — 3-8 ข้อ คำถามที่คนถามจริงเกี่ยวกับหัวข้อนั้น
5. **FAQ Schema (JSON-LD)** — ใส่ `<script type="application/ld+json">` ที่ท้าย
   component เสมอ ให้ตรงกับคำถาม/คำตอบใน FAQ section ทุกคำ

อ้างอิงโครงสร้างจริงจากไฟล์ตัวอย่าง `SeveranceCalculator.tsx` ที่แนบมาด้วย —
ให้ทำตาม pattern เดียวกันทุกอย่าง ทั้งลำดับ section, การตั้งชื่อ state,
และวิธีเขียน schema

## Design system (ต้องใช้ค่าเดียวกันทุก tool เพื่อความสม่ำเสมอของแบรนด์)

**สี:**
- พื้นหลังหลัก: ขาว / stone-50
- ข้อความหลัก: stone-800 / stone-900
- accent (ปุ่ม, ตัวเลขผลลัพธ์, highlight): teal-700 / teal-800
- กรอบ/เส้นแบ่ง: stone-200 / stone-300
- ข้อความ error/คำเตือน: amber-700

**ทำไมเลือกโทนนี้:** ผู้ใช้กลุ่มนี้กำลังกังวลเรื่องเงิน/สิทธิ ต้องการความน่าเชื่อถือ
สงบ อ่านง่าย — ห้ามใช้โทน dark cinematic หรือสีสันจัดจ้านแบบงาน landing page
แบรนด์เสื้อผ้า นี่คือ tool ที่ต้อง "ดูน่าเชื่อถือ" ไม่ใช่ "ดูมี experience"

**ตัวอักษร:**
- หัวข้อ (h1, h2, h3): ฟอนต์ serif (เช่น Source Serif 4) — ให้ความรู้สึกน่าเชื่อถือ
  แบบเอกสารราชการ/กฎหมาย
- เนื้อหา, ตัวเลข, ฟอร์ม: ฟอนต์ sans-serif (เช่น Inter) — อ่านตัวเลขชัดกว่า

**Layout:**
- คอลัมน์เดียว จัดกึ่งกลางหน้า, max-width ~672px (`max-w-2xl`)
- ฟอร์มอยู่ในกรอบ card ขอบบาง ไม่มี shadow หนัก
- **ห้าม** ใช้ eyebrow label ตัวพิมพ์ใหญ่ทั้งหมด, ห้าม numbered marker (01/02/03)
  เว้นแต่เนื้อหาเป็นลำดับขั้นตอนจริงๆ, ห้ามใส่ shadow เดียวกันซ้ำทุก card
  แบบ default SaaS

## Routing / URL convention

ใช้ slug ภาษาไทยที่ตรงกับคำค้นจริง เช่น:
- `/คำนวณ-คาชดเชย-เลิกจ้าง`
- `/คำนวณ-เงินทดแทน-วางงาน`
- `/คำนวณ-วันลาพักรอน-คงเหลือ`

## Roadmap เครื่องมือ (ทำตามลำดับนี้)

| ลำดับ | เครื่องมือ | สถานะ |
|---|---|---|
| 1 | คำนวณค่าชดเชยเลิกจ้าง (มาตรา 118) | ✅ ทำแล้ว — ดู `SeveranceCalculator.tsx` |
| 2 | คำนวณค่าเสียหายจากไม่บอกกล่าวล่วงหน้า (มาตรา 17/1) | ยังไม่ทำ |
| 3 | คำนวณเงินทดแทนว่างงานจากประกันสังคม | ยังไม่ทำ |
| 4 | คำนวณวันหยุดพักร้อนคงเหลือ/เงินชดเชยวันลา | ยังไม่ทำ |
| 5 | คำนวณภาษีเงินได้จากเงินชดเชย | ยังไม่ทำ |

ทุก tool ใหม่ต้องมี internal link ไปหา tool อื่นในกลุ่มเดียวกัน (เช่น หน้า
คำนวณค่าชดเชย ควรมีลิงก์ไปหน้าคำนวณเงินทดแทนว่างงาน) เพื่อดัน authority
รวมของโดเมน

## Monetization (ใส่ไว้ทุกหน้าตั้งแต่ต้น)

- AdSense banner ตำแหน่งใต้ผลลัพธ์ และท้าย FAQ (ห้ามบัง form หรือผลลัพธ์)
- ลิงก์ affiliate "ปรึกษาทนายแรงงาน" หรือ "ปรึกษานักบัญชี" วางไว้ใต้ผลลัพธ์
  แบบไม่รบกวนสายตา (ไม่ใช่ popup)