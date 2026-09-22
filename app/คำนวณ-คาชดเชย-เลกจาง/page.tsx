import type { Metadata } from "next";
import Calculator from "./SeveranceCalculator";
export const metadata: Metadata = { title: "คำนวณค่าชดเชยเลิกจ้าง", description: "เครื่องมือคำนวณค่าชดเชยเลิกจ้าง" };
export default function Page() { return <Calculator />; }
