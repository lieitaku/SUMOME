import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { getPickupClubsForHome } from "@/lib/actions/pickup-clubs";

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
    async (pref: string) =>
      prisma.prefectureBanner.findUnique({ where: { pref } }),
    ["prefecture-banner"],
    { revalidate: 60, tags: ["prefecture-banners"] }
  )(prefSlug);
}

/** Cached clubs by prefecture name (area). Invalidate with tag "clubs". */
export function getCachedClubsByArea(prefName: string) {
  return unstable_cache(
    async (area: string) =>
      prisma.club.findMany({
        where: { area },
        orderBy: { createdAt: "desc" },
      }),
    ["prefecture-clubs"],
    { revalidate: 60, tags: ["clubs"] }
  )(prefName);
}

/** Cached club by slug. Invalidate with tag "clubs". */
export function getCachedClubBySlug(slug: string) {
  return unstable_cache(
    async (s: string) => prisma.club.findUnique({ where: { slug: s } }),
    ["club-by-slug"],
    { revalidate: 60, tags: ["clubs"] }
  )(slug);
}

/** Cached magazine by slug (published only). Invalidate with tag "magazines". */
export function getCachedMagazineBySlug(slug: string) {
  return unstable_cache(
    async (s: string) =>
      prisma.magazine.findFirst({
        where: { slug: s, published: true },
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
