import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import RecruitForm from "@/components/clubs/RecruitForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (slug === "official-hq") return { title: "Not Found" };
  const club = await prisma.club.findUnique({ where: { slug } });
  if (!club) return { title: "Not Found" };
  return { title: `${club.name} - 体験・入会申し込み` };
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