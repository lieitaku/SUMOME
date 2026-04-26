import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { getPrefSlugsWithAnimation } from "@/data/prefecture-animations";

const DEFAULT_SITE_URL = "https://www.memory-sumo.com";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
}

function entry(
  baseUrl: string,
  path: string,
  lastModified: Date
): MetadataRoute.Sitemap[number] {
  const jaPath = path === "/" ? "/" : path;
  const enPath = path === "/" ? "/en" : `/en${path}`;
  return {
    url: `${baseUrl}${jaPath}`,
    lastModified,
    alternates: {
      languages: {
        ja: `${baseUrl}${jaPath}`,
        en: `${baseUrl}${enPath}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl().replace(/\/+$/, "");
  const now = new Date();

  const staticPaths: string[] = [
    "/",
    "/about",
    "/activities",
    "/characters",
    "/clubs",
    "/clubs/map",
    "/company",
    "/contact",
    "/magazines",
    "/partners",
    "/privacy",
    "/terms",
  ];

  const prefecturePaths = Object.keys(PREFECTURE_DATABASE).map(
    (pref) => `/prefectures/${pref}`
  );

  const clubs = await prisma.club.findMany({
    where: { published: true, hidden: false },
    select: { slug: true, updatedAt: true },
  });

  const magazines = await prisma.magazine.findMany({
    where: { published: true, hidden: false },
    select: { slug: true, updatedAt: true },
  });

  const activities = await prisma.activity.findMany({
    where: { published: true },
    select: { id: true, updatedAt: true },
  });

  const urls: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    urls.push(entry(baseUrl, path, now));
  }

  for (const path of prefecturePaths) {
    urls.push(entry(baseUrl, path, now));
  }

  for (const pref of getPrefSlugsWithAnimation()) {
    urls.push(entry(baseUrl, `/prefectures/${pref}/animation`, now));
  }

  for (const club of clubs) {
    urls.push(
      entry(baseUrl, `/clubs/${club.slug}`, club.updatedAt ?? now)
    );
  }

  for (const magazine of magazines) {
    urls.push(
      entry(baseUrl, `/magazines/${magazine.slug}`, magazine.updatedAt ?? now)
    );
  }

  for (const activity of activities) {
    urls.push(
      entry(
        baseUrl,
        `/activities/${activity.id}`,
        activity.updatedAt ?? now
      )
    );
  }

  return urls;
}
