import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "SUMOMEへのお問い合わせはこちら。相撲クラブの掲載依頼、サービスに関するご質問など、お気軽にご連絡ください。",
  alternates: { canonical: "https://www.memory-sumo.com/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
