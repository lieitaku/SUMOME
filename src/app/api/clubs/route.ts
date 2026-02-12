import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** 公开 API：俱乐部列表，仅返回当前前台已展示的公开数据 */
export async function GET() {
  const clubs = await prisma.club.findMany({
    where: { id: { not: "official-hq" } },
  });
  return NextResponse.json(clubs);
}
