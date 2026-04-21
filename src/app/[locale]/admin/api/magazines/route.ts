import { NextRequest, NextResponse } from "next/server";
import { confirmAdmin } from "@/lib/auth-utils";
import { REGIONS } from "@/lib/constants";
import { fetchMagazinesAdminList } from "@/lib/admin-magazines-list";

export async function GET(request: NextRequest) {
    const admin = await confirmAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const region = searchParams.get("region") ?? undefined;
    const pref = searchParams.get("pref") ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const sort = searchParams.get("sort") === "time" ? "time" : "area";
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const { magazines, total, totalPages, page: pageOut } = await fetchMagazinesAdminList({
        q,
        pref,
        region: region && region in REGIONS ? region : undefined,
        page,
        sort,
        limit,
    });

    return NextResponse.json({ magazines, total, totalPages, page: pageOut });
}
