"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth-utils";

const PICKUP_SLOTS = 3; // 首页显示 3 个俱乐部

/** 若 HomePickupClub 表尚未迁移，prisma 上可能没有 homePickupClub，避免 findMany 报错 */
function getHomePickupClubModel() {
  return (prisma as { homePickupClub?: typeof prisma.homePickupClub }).homePickupClub;
}

/** 后台：获取当前「注目俱乐部」配置（3 个槽位，每个为 clubId 或 null） */
export async function getHomePickupClubs() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "権限がありません。" };
  }
  const model = getHomePickupClubModel();
  if (!model) {
    return {
      data: [
        { sortOrder: 0, clubId: null, club: null },
        { sortOrder: 1, clubId: null, club: null },
        { sortOrder: 2, clubId: null, club: null },
      ],
    };
  }
  const rows = await model.findMany({
    orderBy: { sortOrder: "asc" },
    include: { club: { select: { id: true, name: true, slug: true, logo: true } } },
  });
  // 保证返回长度为 3 的数组，缺的槽位用 null 占位
  const result: { sortOrder: number; clubId: string | null; club: { id: string; name: string; slug: string; logo: string | null } | null }[] = [];
  for (let i = 0; i < PICKUP_SLOTS; i++) {
    const row = rows.find((r) => r.sortOrder === i);
    result.push({
      sortOrder: i,
      clubId: row?.clubId ?? null,
      club: row?.club ?? null,
    });
  }
  return { data: result };
}

/** 后台：更新「注目俱乐部」配置（FormData: slot0, slot1, slot2 为 clubId，空字符串表示清空） */
export async function updateHomePickupClubs(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "権限がありません。" };
  }
  const clubIds: (string | null)[] = [];
  for (let i = 0; i < PICKUP_SLOTS; i++) {
    const v = formData.get(`slot${i}`) as string | null;
    clubIds.push(v && v.trim() ? v.trim() : null);
  }
  // 同一俱乐部不能重复出现在两个槽位
  const filled = clubIds.filter((id): id is string => !!id);
  if (new Set(filled).size !== filled.length) {
    return { error: "同じクラブを複数の枠に選べません。" };
  }
  const model = getHomePickupClubModel();
  if (!model) {
    return { error: "データベースを更新してください（Prisma: npx prisma generate と migrate）。" };
  }
  try {
    await prisma.$transaction(async (tx) => {
      const homePickup = (tx as { homePickupClub: typeof model }).homePickupClub;
      for (let i = 0; i < PICKUP_SLOTS; i++) {
        await homePickup.upsert({
          where: { sortOrder: i },
          create: { sortOrder: i, clubId: clubIds[i] },
          update: { clubId: clubIds[i] },
        });
      }
    });
    revalidatePath("/");
    revalidatePath("/admin/pickup-clubs");
    return { success: true };
  } catch (error) {
    console.error("updateHomePickupClubs:", error);
    return { error: "保存に失敗しました。" };
  }
}

/** 前台：获取首页要展示的 3 个俱乐部（已配置则按配置顺序，否则按最新 3 件） */
export async function getPickupClubsForHome() {
  const model = getHomePickupClubModel();
  if (!model) {
    return prisma.club.findMany({
      where: { slug: { not: "official-hq" } },
      orderBy: { createdAt: "desc" },
      take: PICKUP_SLOTS,
    });
  }
  const rows = await model.findMany({
    orderBy: { sortOrder: "asc" },
    include: { club: true },
  });
  const configured = rows
    .filter((r) => r.club != null)
    .map((r) => r.club!);
  if (configured.length >= PICKUP_SLOTS) {
    return configured.slice(0, PICKUP_SLOTS);
  }
  const ids = new Set(configured.map((c) => c.id));
  const newest = await prisma.club.findMany({
    where: { slug: { not: "official-hq" }, id: { notIn: [...ids] } },
    orderBy: { createdAt: "desc" },
    take: PICKUP_SLOTS - configured.length,
  });
  return [...configured, ...newest].slice(0, PICKUP_SLOTS);
}
