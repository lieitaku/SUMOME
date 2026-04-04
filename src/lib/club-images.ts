/**
 * 判断俱乐部主图是否为「真实上传」而非占位 / 批量默认图。
 * 默认图路径与批量脚本写入的 mainImage 保持一致。
 */

/** 无真实主图时卡片等处使用的默认封面（对应 public/images/clubs/default-club.webp） */
export const DEFAULT_CLUB_MAIN_IMAGE = "/images/clubs/default-club.webp";

const PLACEHOLDER_PATHS = [
    "/images/placeholder.webp",
    "/images/clubs/default-club.webp",
] as const;

function normalizeMainImageUrl(mainImage: string | null | undefined): string {
    if (!mainImage || typeof mainImage !== "string") return "";
    const u = mainImage.trim();
    if (!u) return "";
    try {
        const pathOnly = u.startsWith("http") ? new URL(u).pathname : u;
        for (const p of PLACEHOLDER_PATHS) {
            if (pathOnly === p || pathOnly.endsWith(p)) return "";
        }
    } catch {
        for (const p of PLACEHOLDER_PATHS) {
            if (u === p || u.endsWith(p)) return "";
        }
    }
    return u;
}

export function hasRealClubMainImage(mainImage: string | null | undefined): boolean {
    return normalizeMainImageUrl(mainImage).length > 0;
}

/** 都道府県一覧など：写真ありを先に、同一グループ内は新しい順 */
export function sortClubsWithRealImagePriority<
    T extends { mainImage: string | null; createdAt: Date },
>(clubs: T[]): T[] {
    return [...clubs].sort((a, b) => {
        const ar = hasRealClubMainImage(a.mainImage) ? 1 : 0;
        const br = hasRealClubMainImage(b.mainImage) ? 1 : 0;
        if (br !== ar) return br - ar;
        const tb = new Date(b.createdAt).getTime();
        const ta = new Date(a.createdAt).getTime();
        const safeB = Number.isFinite(tb) ? tb : 0;
        const safeA = Number.isFinite(ta) ? ta : 0;
        return safeB - safeA;
    });
}
