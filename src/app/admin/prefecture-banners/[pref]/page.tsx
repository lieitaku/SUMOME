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

  const banner = await prisma.prefectureBanner.findUnique({
    where: { pref },
  });

  return (
    <EditPrefectureBannerForm
      pref={pref}
      prefectureName={prefData.name}
      initialBanner={banner}
    />
  );
}
