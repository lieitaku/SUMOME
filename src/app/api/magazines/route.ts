import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** 公开 API：杂志列表（仅 published），与前台 magazines 页查询一致 */
export async function GET() {
  const magazines = await prisma.magazine.findMany({
    where: { published: true },
    orderBy: { issueDate: "desc" },
  });
  return NextResponse.json(magazines);
}
