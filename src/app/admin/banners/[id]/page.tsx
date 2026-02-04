import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import BannerForm from "@/components/admin/banners/BannerForm";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: PageProps) {
    const { id } = await params;

    const banner = await prisma.banner.findUnique({
        where: { id },
    });

    if (!banner) {
        notFound();
    }

    return <BannerForm initialData={banner} />;
}
