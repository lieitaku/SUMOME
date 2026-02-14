-- CreateEnum
CREATE TYPE "BannerSponsorTier" AS ENUM ('OFFICIAL', 'LOCAL');

-- AlterTable
ALTER TABLE "Banner" ADD COLUMN "sponsorTier" "BannerSponsorTier" DEFAULT 'LOCAL';

-- AlterTable
ALTER TABLE "BannerDisplaySetting" ADD COLUMN "homeSponsorTierFilter" TEXT NOT NULL DEFAULT 'all';
