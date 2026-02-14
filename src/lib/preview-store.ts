/**
 * In-memory preview payload store with TTL.
 * Used for "preview without saving": payload is stored briefly and read once by the frontend page.
 * Serverless: not shared across instances; acceptable for low preview traffic.
 */

const TTL_MS = 5 * 60 * 1000; // 5 minutes

type Stored = { type: string; redirectPath: string; payload: unknown; expiresAt: number };

const store = new Map<string, Stored>();

function prune() {
    const now = Date.now();
    for (const [id, v] of store.entries()) {
        if (v.expiresAt <= now) store.delete(id);
    }
}

export function setPreview(id: string, type: string, redirectPath: string, payload: unknown): void {
    prune();
    store.set(id, {
        type,
        redirectPath,
        payload,
        expiresAt: Date.now() + TTL_MS,
    });
}

export function getPreview(id: string): Stored | null {
    const v = store.get(id);
    if (!v) return null;
    if (v.expiresAt <= Date.now()) {
        store.delete(id);
        return null;
    }
    return v;
}

/** Remove after read so each preview is one-time use (optional; can also rely on TTL). */
export function consumePreview(id: string): Stored | null {
    const v = getPreview(id);
    if (v) store.delete(id);
    return v;
}
