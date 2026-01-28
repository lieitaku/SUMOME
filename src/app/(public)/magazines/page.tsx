import { prisma } from "@/lib/db";
import MagazinesClient from "./MagazinesClient";

// 强制动态渲染，确保数据最新
export const dynamic = "force-dynamic";

export default async function MagazinesPage() {
  // 1. 从数据库获取数据
  const magazines = await prisma.magazine.findMany({
    where: { published: true },
    orderBy: { issueDate: "desc" },
  });

  // 2. 提取不重复的地区列表
  const regions = Array.from(new Set(magazines.map((m) => m.region)));

  // 3. 将数据传递给 Client 组件
  // 注意：Prisma 的日期对象需要序列化
  const serializedMagazines = JSON.parse(JSON.stringify(magazines));

  return (
    <MagazinesClient
      initialMagazines={serializedMagazines}
      regions={regions}
    />
  );
}