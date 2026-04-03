import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import EditClubForm from "@/components/admin/clubs/EditClubForm";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditClubPage({ params }: PageProps) {
    const { id } = await params;
    const [club, currentUser] = await Promise.all([
        prisma.club.findUnique({ where: { id } }),
        getCurrentUser(),
    ]);

    if (!club) {
        notFound();
    }

    // クラブID(slug)は管理者(ADMIN)のみ変更可能。OWNER は変更不可。
    const canEditSlug = currentUser?.role === "ADMIN";

    return <EditClubForm initialData={club} canEditSlug={canEditSlug} />;
}