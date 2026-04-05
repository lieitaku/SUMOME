import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import RecruitForm from "@/components/clubs/RecruitForm";
import { getTranslations } from "next-intl/server";

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.memory-sumo.com").replace(
    /\/+$/,
    "",
  );
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (slug === "official-hq") return { title: "Not Found" };
  const club = await prisma.club.findUnique({ where: { slug } });
  if (!club) return { title: "Not Found" };
  const t = await getTranslations({ locale, namespace: "RecruitPage" });
  const base = siteBase();
  const jaUrl = `${base}/clubs/${slug}/recruit`;
  const enUrl = `${base}/en/clubs/${slug}/recruit`;
  return {
    title: t("metaTitle", { clubName: club.name }),
    alternates: {
      canonical: locale === "en" ? enUrl : jaUrl,
      languages: {
        ja: jaUrl,
        en: enUrl,
      },
    },
  };
}

export default async function RecruitPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "official-hq") return notFound();

  const club = await prisma.club.findUnique({
    where: { slug },
  });

  if (!club) return notFound();

  return <RecruitForm club={club} />;
}
