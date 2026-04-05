import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import React from "react";
import { ArrowLeft, MapPin, Calendar, Hash } from "lucide-react";
import { Activity, Club } from "@prisma/client";
import { getPreviewPayload } from "@/lib/preview";
import { getCachedActivityWithClub } from "@/lib/cached-queries";
import { getTranslations } from "next-intl/server";
import { activityDisplayTitle, clubDisplayName } from "@/lib/i18n-db";

// 1. ✨ 定义与组件完全匹配的强类型
// 这个类型代表了：活动数据 + 必须包含的俱乐部关联数据
type ActivityWithClub = Activity & {
  club: Club;
};

export const dynamic = "force-dynamic";

import { ArticleRegistry } from "@/lib/article-registry";
import StandardTemplate from "@/components/activities/StandardTemplate";
import Ceramic from "@/components/ui/Ceramic";
import ScrollToTop from "@/components/common/ScrollToTop";
import ActivityActions from "@/components/activities/ActivityActions";

function normalizePreviewActivity(
  p: Record<string, unknown>,
  club: { id: string; name: string; nameEn?: string | null }
): ActivityWithClub {
  const date = p.date ? new Date(p.date as string) : new Date();
  const contentData = (p.contentData ?? (p.blocks || p.event ? { blocks: p.blocks, event: p.event } : null)) as Activity["contentData"];
  return {
    id: String(p.id ?? "preview"),
    title: String(p.title ?? ""),
    titleEn: p.titleEn != null ? String(p.titleEn) : null,
    slug: String(p.slug ?? "preview"),
    date,
    location: p.location != null ? String(p.location) : null,
    category: String(p.category ?? "Report"),
    mainImage: p.mainImage != null ? String(p.mainImage) : null,
    published: true,
    templateType: String(p.templateType ?? "news"),
    contentData,
    content: p.content != null ? String(p.content) : null,
    contentEn: p.contentEn != null ? String(p.contentEn) : null,
    clubId: club.id,
    authorId: String(p.authorId ?? ""),
    customRoute: p.customRoute != null ? String(p.customRoute) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
    club: { id: club.id, name: club.name, nameEn: club.nameEn ?? null } as Club,
  };
}

export default async function ActivityDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; locale: string }>;
  searchParams?: Promise<{ embedded?: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "ActivitiesPage" });
  const sp = searchParams ? await searchParams : {};
  const isEmbedded = sp?.embedded === "1";

  const preview = await getPreviewPayload();
  const usePreview =
    preview?.type === "activity" &&
    preview.payload &&
    typeof preview.payload === "object" &&
    (id === "preview" || (preview.payload as { id?: string }).id === id);

  let activity: ActivityWithClub;

  if (usePreview && preview.payload && typeof preview.payload === "object") {
    const p = preview.payload as Record<string, unknown>;
    const clubPayload = p.club as { id?: string; name?: string } | undefined;
    const clubId = (p.clubId as string) || clubPayload?.id || "";
    const clubName = clubPayload?.name ?? "クラブ";
    if (!clubId) {
      activity = normalizePreviewActivity(p, { id: "preview", name: clubName });
    } else {
      const clubFromDb = await prisma.club.findUnique({
        where: { id: clubId },
        select: { id: true, name: true, nameEn: true },
      });
      const club = clubFromDb ?? { id: clubId, name: clubName };
      activity = normalizePreviewActivity(p, club);
    }
  } else {
    const activityData = await getCachedActivityWithClub(id);
    if (!activityData) notFound();
    activity = activityData as ActivityWithClub;
  }

  // 4. ✨ 处理分发逻辑 (ArticleRegistry 现在能正确识别类型了)
  const CustomComponent = activity.customRoute ? ArticleRegistry[activity.customRoute] : null;

  // 处理展示用的辅助变量
  const displayDate = new Date(activity.date);
  const safeImage = activity.mainImage || "/images/placeholder.webp";
  const titleShown = activityDisplayTitle(activity, locale);
  const displayLocation =
    activity.location || clubDisplayName(activity.club, locale) || "SUMOME";
  const dateLocale = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans selection:bg-sumo-brand selection:text-white flex flex-col">
      {usePreview && !isEmbedded ? (
        <div className="print:hidden bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold flex flex-wrap items-center justify-center gap-2">
          <span>{t("previewBanner")}</span>
          <a href="javascript:history.back()" className="underline font-bold hover:no-underline">
            {t("previewBack")}
          </a>
        </div>
      ) : null}
      {/* --- Header 部分 --- */}
      <header className="relative bg-sumo-brand text-white pt-32 pb-20 md:pb-48 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>

        {/* 背景网格装饰 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto max-w-5xl relative z-10 px-6">
          <Link
            href="/activities"
            className="print:hidden inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors group mb-12"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-sumo-brand transition-all">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{t("detailBackToList")}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-6 mb-8 opacity-90">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wide">
              <Calendar size={14} className="text-yellow-400" />
              <span>{displayDate.toLocaleDateString(dateLocale).replace(/\//g, ".")}</span>
            </div>
            <div className="w-px h-3 bg-white/30"></div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <MapPin size={14} className="text-yellow-400" />
              <span>{displayLocation}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.2] tracking-wide mb-8 max-w-4xl drop-shadow-sm">
            {titleShown}
          </h1>
        </div>
      </header>

      {/* --- 内容区域 --- */}
      <section className="relative px-4 md:px-6 -mt-10 md:-mt-24 z-20 pb-6 md:pb-20">
        <div className="container mx-auto max-w-5xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-white min-h-[600px]">
              {/* --- Sidebar --- */}
              <aside className="print:hidden hidden lg:block lg:col-span-3 border-r border-gray-100 bg-white">
                <div className="sticky top-0 px-8 py-12 flex flex-col gap-10">
                  <div>
                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-4">アクション</div>
                    <ActivityActions
                      activityId={activity.id}
                      title={titleShown}
                      variant="sidebar"
                    />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-4">キーワード</div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(["イベント", activity.category, "相撲"])).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                          <Hash size={9} className="opacity-50" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* --- Article Content --- */}
              <article className="lg:col-span-9 p-4 md:p-16 lg:p-20">
                {/* 5. ✨ 类型对齐后的逻辑分发 */}
                {CustomComponent ? (
                  // A. 如果是大神自定义模式
                  <CustomComponent activity={activity} />
                ) : (
                  // B. 如果是同事发的积木模式或普通模式
                  <StandardTemplate activity={activity} />
                )}

                {/* 移动端分享按钮 */}
                <div className="print:hidden mt-8 md:mt-20 pt-4 md:pt-8 border-t border-gray-100 lg:hidden">
                  <ActivityActions
                    activityId={activity.id}
                    title={titleShown}
                    variant="mobile"
                  />
                </div>
              </article>
            </div>
          </Ceramic>

          {/* 返回列表 */}
          <div className="print:hidden mt-8 md:mt-16 text-center pb-4 md:pb-12">
            <Link href="/activities" className="group inline-flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-sumo-brand group-hover:text-sumo-brand group-hover:-translate-x-1 transition-all">
                <ArrowLeft size={16} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-sumo-brand uppercase tracking-widest transition-colors">{t("detailBackToList")}</span>
            </Link>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}