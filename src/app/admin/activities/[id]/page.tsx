import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EditActivityForm from "@/components/admin/activities/EditActivityForm";

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [activity, clubs] = await Promise.all([
        prisma.activity.findUnique({
            where: { id },
            include: { club: true }
        }),
        prisma.club.findMany({
            orderBy: { name: 'asc' }
        })
    ]);

    if (!activity) return notFound();

    // ✨ 极简：直接返回表单组件
    return <EditActivityForm initialData={activity} clubs={clubs} />;
}