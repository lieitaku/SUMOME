import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EditClubForm from "@/components/admin/clubs/EditClubForm";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditClubPage({ params }: PageProps) {
    const { id } = await params;

    const club = await prisma.club.findUnique({
        where: { id },
    });

    if (!club) {
        notFound();
    }

    return <EditClubForm initialData={club} />;
}