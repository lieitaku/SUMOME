import React from "react";
import { prisma } from "@/lib/db";
import type { BannerSponsorTier } from "@prisma/client";
import { getBannerDisplaySettings } from "@/lib/actions/banners";
import { getPreviewPayload } from "@/lib/preview";
import { getCachedActiveBanners, getCachedPickupClubsForHome } from "@/lib/cached-queries";
import Hero from "@/components/home/Hero";
import AboutService from "@/components/home/AboutService";
import PickupClubs from "@/components/home/PickupClubs";
import ManagerInfo from "@/components/home/ManagerInfo";
import CTA from "@/components/home/CTA";
import PreviewBanner from "@/components/home/PreviewBanner";

type Props = {
    locale: string;
};

export default async function HomeContent({ locale: _locale }: Props) {
    const [preview, displaySettingsInit, pickupClubsRaw, bannersFromDb] = await Promise.all([
        getPreviewPayload(),
        getBannerDisplaySettings(),
        getCachedPickupClubsForHome(),
        getCachedActiveBanners(),
    ]);
    let displaySettings = displaySettingsInit;
    let pickupClubs = pickupClubsRaw;

    if (preview?.type === "banner_display" && preview.payload && typeof preview.payload === "object") {
        const p = preview.payload as Record<string, string>;
        displaySettings = {
            ...displaySettings,
            homeDisplayMode: (p.homeDisplayMode as typeof displaySettings.homeDisplayMode) ?? displaySettings.homeDisplayMode,
            homeSponsorTierFilter: (p.homeSponsorTierFilter as typeof displaySettings.homeSponsorTierFilter) ?? displaySettings.homeSponsorTierFilter,
            prefTopDisplayMode: (p.prefTopDisplayMode as typeof displaySettings.prefTopDisplayMode) ?? displaySettings.prefTopDisplayMode,
            prefTopSponsorTierFilter: (p.prefTopSponsorTierFilter as typeof displaySettings.prefTopSponsorTierFilter) ?? displaySettings.prefTopSponsorTierFilter,
            prefSidebarDisplayMode: (p.prefSidebarDisplayMode as typeof displaySettings.prefSidebarDisplayMode) ?? displaySettings.prefSidebarDisplayMode,
            prefSidebarSponsorTierFilter: (p.prefSidebarSponsorTierFilter as typeof displaySettings.prefSidebarSponsorTierFilter) ?? displaySettings.prefSidebarSponsorTierFilter,
        };
    }
    if (preview?.type === "home_pickup" && preview.payload && typeof preview.payload === "object") {
        const p = preview.payload as { clubIds?: (string | null)[] };
        const ids = (p.clubIds ?? []).filter((id): id is string => !!id);
        if (ids.length > 0) {
            const found = await prisma.club.findMany({ where: { id: { in: ids } } });
            const order = (p.clubIds ?? []).slice(0, 3);
            pickupClubs = order.map((id) => (id ? found.find((c) => c.id === id) : null)).filter(Boolean) as typeof pickupClubs;
        }
    }

    let banners = bannersFromDb;
    if (preview?.type === "banner_single" && preview.payload && typeof preview.payload === "object") {
        const p = preview.payload as { banner?: { id?: string; name?: string; image?: string; alt?: string; link?: string; category?: string; sponsorTier?: string | null } };
        const single = p.banner;
        if (single?.image) {
            const validTier: BannerSponsorTier | null =
                single.sponsorTier === "OFFICIAL" || single.sponsorTier === "LOCAL"
                    ? single.sponsorTier
                    : null;
            const previewBanner = {
                id: single.id ?? "preview-banner",
                name: single.name ?? "プレビュー",
                image: single.image,
                alt: single.alt ?? single.name ?? "",
                link: single.link ?? null,
                category: (single.category === "sponsor" ? "sponsor" : "club") as "club" | "sponsor",
                sponsorTier: validTier,
                sortOrder: 0,
                isActive: true,
                updatedAt: new Date(),
                createdAt: new Date(),
            };
            const rest = bannersFromDb.filter((b) => b.id !== previewBanner.id);
            banners = [previewBanner, ...rest].sort((a, b) => a.sortOrder - b.sortOrder);
        }
    }

    const homeFilter = displaySettings.homeSponsorTierFilter;
    const filteredBanners = banners.filter((b) => {
        if (b.category === "club") return true;
        if (b.category !== "sponsor") return false;
        if (homeFilter === "official_only") return b.sponsorTier === "OFFICIAL";
        if (homeFilter === "local_only") return b.sponsorTier === "LOCAL" || b.sponsorTier == null;
        return true;
    });

    const sponsors = filteredBanners.map((b) => ({
        id: b.id,
        image: b.image,
        alt: b.alt || b.name,
        link: b.link,
        category: b.category,
    }));

    return (
        <>
            <PreviewBanner />

            <main className="flex-grow w-full">
                <Hero
                    sponsors={sponsors}
                    displayMode={displaySettings.homeDisplayMode}
                    videoWebmSrc="/videos/hero-bg-landscape.webm"
                    videoWebmSrcMobile="/videos/hero-bg-portrait.webm"
                    posterSrc="/images/hero/poster-desktop.webp"
                    posterSrcMobile="/images/hero/poster-mobile.webp"
                />
                <CTA />

                <AboutService />

                <PickupClubs clubs={pickupClubs} />

                <ManagerInfo />
            </main>
        </>
    );
}
