import type { Metadata } from "next";
import Calculator from "./SeveranceCalculator";

export const metadata: Metadata = {
  title: "Severance calculator",
  description: "Thai severance calculator",
};

export default function Page() {
  return <Calculator />;
}
