import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { PREFECTURE_DATABASE } from "@/data/prefectures";

const DEFAULT_SITE_URL = "https://www.memory-sumo.com";

function getBaseUrl() {
  // Allow override in Vercel env vars if needed
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl().replace(/\/+$/, "");
  const now = new Date();

  const staticUrls: string[] = [
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

  // Prefecture pages: /prefectures/[pref]
  const prefectureUrls = Object.keys(PREFECTURE_DATABASE).map(
    (pref) => `/prefectures/${pref}`
  );

  // Clubs: /clubs/[slug]
  const clubs = await prisma.club.findMany({
    where: { published: true, hidden: false },
    select: { slug: true, updatedAt: true },
  });

  // Magazines: /magazines/[slug]
  const magazines = await prisma.magazine.findMany({
    where: { published: true, hidden: false },
    select: { slug: true, updatedAt: true },
  });

  // Activities: /activities/[id]
  const activities = await prisma.activity.findMany({
    where: { published: true },
    select: { id: true, updatedAt: true },
  });

  const urls: MetadataRoute.Sitemap = [];

  for (const path of staticUrls) {
    urls.push({
      url: `${baseUrl}${path}`,
      lastModified: now,
    });
  }

  for (const path of prefectureUrls) {
    urls.push({
      url: `${baseUrl}${path}`,
      lastModified: now,
    });
  }

  for (const club of clubs) {
    urls.push({
      url: `${baseUrl}/clubs/${club.slug}`,
      lastModified: club.updatedAt ?? now,
    });
  }

  for (const magazine of magazines) {
    urls.push({
      url: `${baseUrl}/magazines/${magazine.slug}`,
      lastModified: magazine.updatedAt ?? now,
    });
  }

  for (const activity of activities) {
    urls.push({
      url: `${baseUrl}/activities/${activity.id}`,
      lastModified: activity.updatedAt ?? now,
    });
  }

  return urls;
}

