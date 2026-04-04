import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sortClubsWithRealImagePriority } from "@/lib/club-images";

/** 公开 API：俱乐部列表，仅返回当前前台已展示的公开数据 */
export async function GET() {
  const rows = await prisma.club.findMany({
    where: { slug: { not: "official-hq" }, hidden: false },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(sortClubsWithRealImagePriority(rows));
}
