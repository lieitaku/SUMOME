import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import MagazineForm from "@/components/admin/magazines/MagazineForm";

export default async function EditMagazinePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const magazine = await prisma.magazine.findUnique({
        where: { id },
    });

    if (!magazine) {
        notFound();
    }

    return <MagazineForm initialData={magazine} />;
}