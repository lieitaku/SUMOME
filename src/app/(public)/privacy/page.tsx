import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "SUMOME（すもめ）のプライバシーポリシー。個人情報の取り扱いについてご確認いただけます。",
  alternates: { canonical: "https://www.memory-sumo.com/privacy" },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
