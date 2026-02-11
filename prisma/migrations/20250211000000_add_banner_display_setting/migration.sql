-- CreateEnum
CREATE TYPE "BannerDisplayMode" AS ENUM ('all', 'club', 'sponsor', 'mixed');

-- CreateTable
CREATE TABLE "BannerDisplaySetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "homeDisplayMode" "BannerDisplayMode" NOT NULL DEFAULT 'mixed',
    "prefTopDisplayMode" "BannerDisplayMode" NOT NULL DEFAULT 'mixed',
    "prefSidebarDisplayMode" "BannerDisplayMode" NOT NULL DEFAULT 'mixed',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannerDisplaySetting_pkey" PRIMARY KEY ("id")
);

-- Insert default row
INSERT INTO "BannerDisplaySetting" ("id", "homeDisplayMode", "prefTopDisplayMode", "prefSidebarDisplayMode", "updatedAt")
VALUES ('default', 'mixed', 'mixed', 'mixed', NOW());
