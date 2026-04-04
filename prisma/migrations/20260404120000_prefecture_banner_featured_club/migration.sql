-- AlterTable
ALTER TABLE "PrefectureBanner" ADD COLUMN "featuredClubId" TEXT;

-- CreateIndex
CREATE INDEX "PrefectureBanner_featuredClubId_idx" ON "PrefectureBanner"("featuredClubId");

-- AddForeignKey
ALTER TABLE "PrefectureBanner" ADD CONSTRAINT "PrefectureBanner_featuredClubId_fkey" FOREIGN KEY ("featuredClubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
