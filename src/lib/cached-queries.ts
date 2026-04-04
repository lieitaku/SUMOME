import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { getPickupClubsForHome } from "@/lib/actions/pickup-clubs";
import { sortClubsWithRealImagePriority } from "@/lib/club-images";

/** Cached active banners (home + prefecture pages). Invalidate with tag "active-banners". */
export function getCachedActiveBanners() {
  return unstable_cache(
    () =>
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      }),
    ["active-banners"],
    { revalidate: 60, tags: ["active-banners"] }
  )();
}

/** Cached home pickup clubs (3 slots). Invalidate with tag "home-pickup". */
export function getCachedPickupClubsForHome() {
  return unstable_cache(getPickupClubsForHome, ["home-pickup"], {
    revalidate: 60,
    tags: ["home-pickup"],
  })();
}

/** Cached prefecture banner by slug. Invalidate with tag "prefecture-banners". */
export function getCachedPrefectureBanner(prefSlug: string) {
  return unstable_cache(
    async () => {
      try {
        return await prisma.prefectureBanner.findUnique({ where: { pref: prefSlug } });
      } catch (e) {
        console.error("[getCachedPrefectureBanner]", prefSlug, e);
        return null;
      }
    },
    ["prefecture-banner", prefSlug],
    { revalidate: 60, tags: ["prefecture-banners"] }
  )();
}

/** Cached clubs by prefecture name (area). Excludes SUMOME事务局 (official-hq). Invalidate with tag "clubs". */
export function getCachedClubsByArea(prefName: string) {
  return unstable_cache(
    async () => {
      try {
        const rows = await prisma.club.findMany({
          where: { area: prefName, slug: { not: "official-hq" }, hidden: false },
          orderBy: { createdAt: "desc" },
        });
        return sortClubsWithRealImagePriority(rows);
      } catch (e) {
        console.error("[getCachedClubsByArea]", prefName, e);
        return [];
      }
    },
    ["prefecture-clubs", prefName],
    { revalidate: 60, tags: ["clubs"] }
  )();
}

/** Cached club by slug. Invalidate with tag "clubs". */
export function getCachedClubBySlug(slug: string) {
  return unstable_cache(
    async (s: string) =>
      prisma.club.findFirst({
        where: { slug: s, hidden: false },
      }),
    ["club-by-slug"],
    { revalidate: 60, tags: ["clubs"] }
  )(slug);
}

/** Cached magazine by slug (published only). Invalidate with tag "magazines". */
export function getCachedMagazineBySlug(slug: string) {
  return unstable_cache(
    async (s: string) =>
      prisma.magazine.findFirst({
        where: { slug: s, published: true, hidden: false },
      }),
    ["magazine-by-slug"],
    { revalidate: 60, tags: ["magazines"] }
  )(slug);
}

/** Cached activity by id with club. Invalidate with tag "activities". */
export function getCachedActivityWithClub(id: string) {
  return unstable_cache(
    async (activityId: string) =>
      prisma.activity.findUnique({
        where: { id: activityId },
        include: { club: true },
      }),
    ["activity-with-club"],
    { revalidate: 60, tags: ["activities"] }
  )(id);
}

/** Cached all published magazines. Invalidate with tag "magazines". */
export function getCachedAllMagazines() {
  return unstable_cache(
    () =>
      prisma.magazine.findMany({
        where: { published: true, hidden: false },
        orderBy: { issueDate: "desc" },
      }),
    ["all-magazines"],
    { revalidate: 3600, tags: ["magazines"] }
  )();
}

/** Cached activities by page. Invalidate with tag "activities". */
export function getCachedActivitiesPage(page: number, pageSize: number = 6) {
  return unstable_cache(
    async (p: number, ps: number) => {
      const [activities, totalItems] = await Promise.all([
        prisma.activity.findMany({
          skip: (p - 1) * ps,
          take: ps,
          orderBy: { date: "desc" },
          include: { club: { select: { name: true } } },
        }),
        prisma.activity.count(),
      ]);
      return {
        activities,
        totalItems,
        totalPages: Math.ceil(totalItems / ps),
        page: p,
      };
    },
    ["activities-page"],
    { revalidate: 3600, tags: ["activities"] }
  )(page, pageSize);
}

/** Cached all clubs (excluding official-hq). Invalidate with tag "clubs". */
export function getCachedAllClubs() {
  return unstable_cache(
    async () => {
      const rows = await prisma.club.findMany({
        where: { slug: { not: "official-hq" }, hidden: false },
        orderBy: { createdAt: "desc" },
      });
      return sortClubsWithRealImagePriority(rows);
    },
    ["all-clubs"],
    { revalidate: 3600, tags: ["clubs"] }
  )();
}
