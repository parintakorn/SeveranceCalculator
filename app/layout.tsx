import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "คำนวณค่าชดเชยเลิกจ้างตามกฎหมาย | เครื่องมือคำนวณเงินชดเชย",
  description:
    "คำนวณค่าชดเชยเลิกจ้างตามกฎหมายเบื้องต้นจากเงินเดือนและอายุงาน พร้อมดูเกณฑ์เงินชดเชยเลิกจ้างตามมาตรา 118",
  keywords: [
    "คำนวณค่าชดเชยเลิกจ้าง",
    "ค่าชดเชยเลิกจ้างตามกฎหมาย",
    "คำนวณเงินชดเชย",
    "เงินชดเชยเลิกจ้าง",
  ],
  openGraph: {
    title: "คำนวณค่าชดเชยเลิกจ้างตามกฎหมาย",
    description:
      "เครื่องมือคำนวณเงินชดเชยเลิกจ้างเบื้องต้นจากเงินเดือนและอายุงาน",
    url: "https://severance-calculator-omega.vercel.app/",
    siteName: "เครื่องมือคำนวณค่าชดเชยเลิกจ้าง",
    locale: "th_TH",
    type: "website",
  },
  verification: {
    google: "gxXpCb-UnuRa55AC6JONEa6IuvdjNvUQ4n_MoIXF3Uk",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
