import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "SUMOMEについて",
  description:
    "SUMOME（すもめ）は、全国のアマチュア相撲クラブと子どもたちをつなぐポータルサイトです。相撲を通じて、礼儀・体力・仲間づくりを応援します。",
  alternates: { canonical: "https://www.memory-sumo.com/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
