-- CreateTable
CREATE TABLE "PreviewDraft" (
    "id" TEXT NOT NULL,
    "previewId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreviewDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreviewDraft_previewId_key" ON "PreviewDraft"("previewId");

-- CreateIndex
CREATE INDEX "PreviewDraft_previewId_idx" ON "PreviewDraft"("previewId");

-- CreateIndex
CREATE INDEX "PreviewDraft_expiresAt_idx" ON "PreviewDraft"("expiresAt");
