import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPreview } from "@/lib/preview-store";
import { PREVIEW_COOKIE_NAME } from "@/lib/preview";
import { prisma } from "@/lib/db";
import { hasRealClubMainImage } from "@/lib/club-images";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pref = searchParams.get("pref");

  const cookieStore = await cookies();
  const previewId = cookieStore.get(PREVIEW_COOKIE_NAME)?.value;

  if (!previewId) {
    return NextResponse.json({ isPreview: false });
  }

  const stored = await getPreview(previewId);
  if (!stored || stored.type !== "prefecture_banner") {
    return NextResponse.json({ isPreview: false });
  }

  const payload = stored.payload as {
    pref?: string;
    image?: string;
    alt?: string;
    imagePosition?: string;
    imageScale?: string | number;
    imageRotation?: string | number;
    featuredClubId?: string | null;
  };

  if (pref && payload.pref !== pref) {
    return NextResponse.json({ isPreview: false });
  }

  let featuredClub = null;
  if (payload.featuredClubId) {
    try {
      const club = await prisma.club.findUnique({
        where: { id: payload.featuredClubId },
        select: {
          id: true,
          name: true,
          slug: true,
          area: true,
          city: true,
          address: true,
          translations: true,
          mainImage: true,
        },
      });
      if (club && hasRealClubMainImage(club.mainImage)) {
        featuredClub = club;
      }
    } catch {
      // ignore DB errors
    }
  }

  const rawRotation = payload.imageRotation != null ? Number(payload.imageRotation) : 0;
  const imageRotation = [0, 90, 180, 270].includes(rawRotation) ? rawRotation : 0;

  return NextResponse.json({
    isPreview: true,
    pref: payload.pref,
    bannerImg: payload.image ?? null,
    bannerAlt: payload.alt ?? null,
    imagePosition: payload.imagePosition ?? "50,50",
    imageScale: payload.imageScale != null ? Number(payload.imageScale) : 1,
    imageRotation,
    featuredClub,
  });
}
