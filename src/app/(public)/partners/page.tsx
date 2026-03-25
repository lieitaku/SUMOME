import type { Metadata } from "next";
import PartnersClient from "./PartnersClient";

export const metadata: Metadata = {
  title: "パートナー・クラブ管理者の方へ",
  description:
    "SUMOMEのパートナー向け情報。相撲クラブの管理者向けに、クラブ掲載・管理機能のご案内をしています。",
  alternates: { canonical: "https://www.memory-sumo.com/partners" },
};

export default function PartnersPage() {
  return <PartnersClient />;
}
