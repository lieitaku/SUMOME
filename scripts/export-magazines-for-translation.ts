/**
 * 导出杂志 id / 日文标题与简介，便于批量生成 titleEn、descriptionEn 后回填。
 * 用法: npx tsx scripts/export-magazines-for-translation.ts > magazines-export.json
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
try {
  const rows = await prisma.magazine.findMany({
    orderBy: { issueDate: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      titleEn: true,
      descriptionEn: true,
    },
  });
  console.log(JSON.stringify(rows, null, 2));
} finally {
  await prisma.$disconnect();
}
