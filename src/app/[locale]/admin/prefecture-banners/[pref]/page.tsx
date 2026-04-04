import { prisma } from "@/lib/db";
import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { notFound } from "next/navigation";
import EditPrefectureBannerForm from "@/components/admin/prefecture-banners/EditPrefectureBannerForm";

interface PageProps {
  params: Promise<{ pref: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditPrefectureBannerPage({ params }: PageProps) {
  const { pref } = await params;
  const prefData = PREFECTURE_DATABASE[pref];
  if (!prefData) notFound();

  const [banner, clubsForFeature] = await Promise.all([
    prisma.prefectureBanner.findUnique({
      where: { pref },
    }),
    prisma.club.findMany({
      where: {
        area: prefData.name,
        slug: { not: "official-hq" },
        hidden: false,
      },
      select: { id: true, name: true, mainImage: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const defaultDisplayImage = banner?.image ?? prefData.bannerImg ?? "";

  return (
    <EditPrefectureBannerForm
      pref={pref}
      prefectureName={prefData.name}
      initialBanner={banner}
      defaultDisplayImage={defaultDisplayImage}
      clubsForFeature={clubsForFeature}
    />
  );
}
