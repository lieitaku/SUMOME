/**
 * Preview payload store with TTL.
 * Used for "preview without saving": payload is stored briefly and read by the frontend page.
 *
 * Uses database (PreviewDraft table) for cross-instance sharing in Serverless.
 * Industry pattern: Payload CMS, Strapi, etc. use similar draft/preview storage.
 */

import { prisma } from "@/lib/db";

const TTL_MS = 5 * 60 * 1000; // 5 minutes

export type Stored = { type: string; redirectPath: string; payload: unknown; expiresAt: number };

async function pruneExpired() {
    await prisma.previewDraft.deleteMany({
        where: { expiresAt: { lt: new Date() } },
    });
}

export async function setPreview(id: string, type: string, redirectPath: string, payload: unknown): Promise<void> {
    await pruneExpired();
    const expiresAt = new Date(Date.now() + TTL_MS);
    await prisma.previewDraft.upsert({
        where: { previewId: id },
        create: { previewId: id, type, path: redirectPath, payload: payload as object, expiresAt },
        update: { type, path: redirectPath, payload: payload as object, expiresAt },
    });
}

export async function getPreview(id: string): Promise<Stored | null> {
    const row = await prisma.previewDraft.findUnique({
        where: { previewId: id },
    });
    if (!row) return null;
    if (row.expiresAt < new Date()) {
        await prisma.previewDraft.delete({ where: { previewId: id } });
        return null;
    }
    return {
        type: row.type,
        redirectPath: row.path,
        payload: row.payload,
        expiresAt: row.expiresAt.getTime(),
    };
}

/** Remove after read so each preview is one-time use (optional; can also rely on TTL). */
export async function consumePreview(id: string): Promise<Stored | null> {
    const v = await getPreview(id);
    if (v) {
        await prisma.previewDraft.delete({ where: { previewId: id } }).catch(() => {});
    }
    return v;
}
