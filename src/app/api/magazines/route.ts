import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * 公開 API：杂志一覧（published・非 hidden）。
 * 前台 `/magazines` は SSR（getCachedAllMagazines）のみで表示し、本ルートは再取得用・外部利用向け。
 */
export async function GET() {
  const magazines = await prisma.magazine.findMany({
    where: { published: true, hidden: false },
    orderBy: { issueDate: "desc" },
  });
  return NextResponse.json(magazines);
}
