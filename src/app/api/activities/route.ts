import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ITEMS_PER_PAGE = 6;

/** 公开 API：活动列表（仅 published），支持分页 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const [activities, totalItems] = await Promise.all([
    prisma.activity.findMany({
      where: { published: true },
      include: { club: { select: { name: true } } },
      orderBy: { date: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.activity.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  return NextResponse.json({ activities, totalItems, totalPages, page });
}
