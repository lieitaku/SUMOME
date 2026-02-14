import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import React from "react";
import { ArrowLeft, Share2, Printer, MapPin, Calendar, Hash, ImageIcon } from "lucide-react";
// 引入 Prisma 自动生成的原始类型
import { Activity, Club } from "@prisma/client";
import { getPreviewPayload } from "@/lib/preview";

// 1. ✨ 定义与组件完全匹配的强类型
// 这个类型代表了：活动数据 + 必须包含的俱乐部关联数据
type ActivityWithClub = Activity & {
  club: Club;
};

import { ArticleRegistry } from "@/lib/article-registry";
import StandardTemplate from "@/components/activities/StandardTemplate";
import Ceramic from "@/components/ui/Ceramic";
import ScrollToTop from "@/components/common/ScrollToTop";

function normalizePreviewActivity(
  p: Record<string, unknown>,
  club: { id: string; name: string }
): ActivityWithClub {
  const date = p.date ? new Date(p.date as string) : new Date();
  const contentData = (p.contentData ?? (p.blocks || p.event ? { blocks: p.blocks, event: p.event } : null)) as Activity["contentData"];
  return {
    id: String(p.id ?? "preview"),
    title: String(p.title ?? ""),
    slug: String(p.slug ?? "preview"),
    date,
    location: p.location != null ? String(p.location) : null,
    category: String(p.category ?? "Report"),
    mainImage: p.mainImage != null ? String(p.mainImage) : null,
    published: true,
    templateType: String(p.templateType ?? "news"),
    contentData,
    content: p.content != null ? String(p.content) : null,
    clubId: club.id,
    authorId: String(p.authorId ?? ""),
    customRoute: p.customRoute != null ? String(p.customRoute) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
    club: { id: club.id, name: club.name } as Club,
  };
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
        select: { id: true, name: true },
      });
      const club = clubFromDb ?? { id: clubId, name: clubName };
      activity = normalizePreviewActivity(p, club);
    }
  } else {
    const activityData = await prisma.activity.findUnique({
      where: { id },
      include: { club: true },
    });
    if (!activityData) notFound();
    activity = activityData as ActivityWithClub;
  }

  // 4. ✨ 处理分发逻辑 (ArticleRegistry 现在能正确识别类型了)
  const CustomComponent = activity.customRoute ? ArticleRegistry[activity.customRoute] : null;

  // 处理展示用的辅助变量
  const displayDate = new Date(activity.date);
  const safeImage = activity.mainImage || "/images/placeholder.jpg";
  const displayLocation = activity.location || activity.club?.name || "SUMOME";

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans selection:bg-sumo-brand selection:text-white flex flex-col">
      {usePreview && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold">
          プレビュー — 未保存の内容を表示しています。
        </div>
      )}
      {/* --- Header 部分 --- */}
      <header className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
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
            className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors group mb-12"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-sumo-brand transition-all">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Back to List</span>
          </Link>

          <div className="flex flex-wrap items-center gap-6 mb-8 opacity-90">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wide">
              <Calendar size={14} className="text-yellow-400" />
              <span>{displayDate.toLocaleDateString('ja-JP').replace(/\//g, '.')}</span>
            </div>
            <div className="w-px h-3 bg-white/30"></div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <MapPin size={14} className="text-yellow-400" />
              <span>{displayLocation}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.2] tracking-wide mb-8 max-w-4xl drop-shadow-sm">
            {activity.title}
          </h1>
        </div>
      </header>

      {/* --- 内容区域 --- */}
      <section className="relative px-4 md:px-6 -mt-24 z-20 pb-32">
        <div className="container mx-auto max-w-5xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-white min-h-[600px]">
              {/* --- Sidebar --- */}
              <aside className="hidden lg:block lg:col-span-3 border-r border-gray-100 bg-white">
                <div className="sticky top-0 px-8 py-12 flex flex-col gap-10">
                  <div>
                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-4">Actions</div>
                    <div className="flex flex-col gap-2">
                      <button className="flex items-center justify-between px-3 py-2 -ml-3 rounded hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-sumo-brand transition-colors">
                        <span className="flex items-center gap-3"><Share2 size={14} /> Share</span>
                      </button>
                      <button className="flex items-center justify-between px-3 py-2 -ml-3 rounded hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-sumo-dark transition-colors">
                        <span className="flex items-center gap-3"><Printer size={14} /> Print</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-4">Keywords</div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(["Event", activity.category, "Sumo"])).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                          <Hash size={9} className="opacity-50" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* --- Article Content --- */}
              <article className="lg:col-span-9 p-8 md:p-16 lg:p-20">
                {/* 5. ✨ 类型对齐后的逻辑分发 */}
                {CustomComponent ? (
                  // A. 如果是大神自定义模式
                  <CustomComponent activity={activity} />
                ) : (
                  // B. 如果是同事发的积木模式或普通模式
                  <StandardTemplate activity={activity} />
                )}

                {/* 移动端分享按钮 */}
                <div className="mt-20 pt-8 border-t border-gray-100 lg:hidden">
                  <button className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest">
                    <Share2 size={14} /> Share Report
                  </button>
                </div>
              </article>
            </div>
          </Ceramic>

          {/* 返回列表 */}
          <div className="mt-16 text-center pb-20">
            <Link href="/activities" className="group inline-flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-sumo-brand group-hover:text-sumo-brand group-hover:-translate-x-1 transition-all">
                <ArrowLeft size={16} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-sumo-brand uppercase tracking-widest transition-colors">Back to List</span>
            </Link>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}