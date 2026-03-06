import React from "react";
import ApplicationsListClient from "@/components/admin/applications/ApplicationsListClient";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function AdminApplicationsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    let apps;
    if (user.role === "ADMIN") {
        apps = await prisma.application.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                clubName: true,
                name: true,
                email: true,
                phone: true,
                experience: true,
                message: true,
                status: true,
                createdAt: true,
            },
        });
    } else {
        const myClubIds = await prisma.club.findMany({
            where: { ownerId: user.id },
            select: { id: true },
        }).then((rows) => rows.map((r) => r.id));

        if (myClubIds.length === 0) {
            apps = [];
        } else {
            apps = await prisma.application.findMany({
                where: { clubId: { in: myClubIds } },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    clubName: true,
                    name: true,
                    email: true,
                    phone: true,
                    experience: true,
                    message: true,
                    status: true,
                    createdAt: true,
                },
            });
        }
    }

    const serializedApps = apps.map(app => ({
        ...app,
        createdAt: app.createdAt.toISOString(),
    }));

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">入会申請管理</h1>
                    <p className="text-gray-500 mt-1 text-xs md:text-sm">
                        各道場への入会・体験希望者からのメッセージを一覧で確認できます
                    </p>
                </div>
            </div>
            <ApplicationsListClient initialData={serializedApps} />
        </div>
    );
}
