import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "SUMOME（すもめ）の利用規約。サービスのご利用にあたっての注意事項をご確認ください。",
  alternates: { canonical: "https://memory-sumo.com/terms" },
};

export default function TermsPage() {
  return <TermsClient />;
}
