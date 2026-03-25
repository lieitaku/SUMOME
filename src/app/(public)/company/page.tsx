import type { Metadata } from "next";
import CompanyClient from "./CompanyClient";

export const metadata: Metadata = {
  title: "運営会社情報",
  description:
    "SUMOMEの運営会社情報。サービス概要、会社理念、所在地などの基本情報をご確認いただけます。",
  alternates: { canonical: "https://www.memory-sumo.com/company" },
};

export default function CompanyPage() {
  return <CompanyClient />;
}
