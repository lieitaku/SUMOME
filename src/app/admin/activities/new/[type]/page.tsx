import React from "react";
import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import { redirect, notFound } from "next/navigation";
import EditActivityForm from "@/components/admin/activities/EditActivityForm";
import { Activity } from "@prisma/client";

interface PageProps {
    params: Promise<{ type: string }>;
}

export default async function NewActivityDynamicPage({ params }: PageProps) {
    const admin = await confirmAdmin();
    if (!admin) redirect("/manager/login");

    const { type } = await params;
    const validTypes = ["news", "report", "event", "custom"];
    if (!validTypes.includes(type)) return notFound();

    const clubs = await prisma.club.findMany({ orderBy: { name: "asc" } });
    if (clubs.length === 0) redirect("/admin/clubs/new");

    const skeletonData = {
        id: "new-placeholder",
        title: "",
        slug: "",
        date: new Date(),
        templateType: type,
        category: type === "news" ? "News" : "Report",
        clubId: clubs[0].id,
        authorId: admin.id,
        published: false,
        contentData: {},
        content: "",
        mainImage: "",
        location: "",
        customRoute: ""
    };

    // ✨ 极简：移除了多余的 div 包装，直接让表单占满屏幕
    return <EditActivityForm initialData={skeletonData as Activity} clubs={clubs} isNew={true} />;
}