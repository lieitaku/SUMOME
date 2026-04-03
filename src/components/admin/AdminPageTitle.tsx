"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const PATH_TO_KEY: Record<string, string> = {
    "/admin": "dashboard",
    "/admin/dashboard": "dashboard",
    "/admin/clubs": "clubs",
    "/admin/clubs/new": "clubsNew",
    "/admin/activities": "activities",
    "/admin/magazines": "magazines",
    "/admin/banners": "banners",
    "/admin/prefecture-banners": "prefBanners",
    "/admin/settings": "settings",
    "/admin/my-club": "myClub",
    "/admin/applications": "applications",
    "/admin/inquiries": "inquiries",
    "/admin/pickup-clubs": "pickupClubs",
    "/admin/guide": "guide",
};

export default function AdminPageTitle() {
    const pathname = usePathname();
    const t = useTranslations("Admin.pageTitle");

    let key = PATH_TO_KEY[pathname];

    if (!key) {
        if (pathname.startsWith("/admin/clubs/")) {
            key = "clubDetail";
        } else if (pathname.startsWith("/admin/prefecture-banners/")) {
            key = "prefBannerEdit";
        } else if (pathname.startsWith("/admin/activities/new")) {
            key = "activityNew";
        } else if (pathname.startsWith("/admin/activities/")) {
            key = "articleEdit";
        } else {
            key = "fallback";
        }
    }

    return (
        <span className="text-gray-900 ml-1 font-bold">
            {t(key)}
        </span>
    );
}
