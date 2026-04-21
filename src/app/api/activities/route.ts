import { NextRequest, NextResponse } from "next/server";
import { getCachedActivitiesPage } from "@/lib/cached-queries";

const ITEMS_PER_PAGE = 6;

/** 公开 API：活动列表（仅 published），与 SSR 共用缓存 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const { activities, totalItems, totalPages, page: p } = await getCachedActivitiesPage(
    page,
    ITEMS_PER_PAGE
  );
  return NextResponse.json({ activities, totalItems, totalPages, page: p });
}
