import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sortClubsWithRealImagePriority } from "@/lib/club-images";

/**
 * 公開 API：俱乐部一覧（公式 HQ 除外・非 hidden）。
 * 前台 `/clubs` は SSR（getCachedAllClubs）のみで表示し、本ルートは再取得用・外部利用向け。
 */
export async function GET() {
  const rows = await prisma.club.findMany({
    where: { slug: { not: "official-hq" }, hidden: false },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(sortClubsWithRealImagePriority(rows));
}
