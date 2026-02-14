-- AlterTable
ALTER TABLE "BannerDisplaySetting" ADD COLUMN "prefTopSponsorTierFilter" TEXT NOT NULL DEFAULT 'all';
ALTER TABLE "BannerDisplaySetting" ADD COLUMN "prefSidebarSponsorTierFilter" TEXT NOT NULL DEFAULT 'all';
