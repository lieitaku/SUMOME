import React from "react";
import Image from "next/image";

export const dynamic = "force-dynamic";
import Link from "@/components/ui/TransitionLink";
import { notFound } from "next/navigation";
import { getPreviewPayload } from "@/lib/preview";
import { getCachedMagazineBySlug } from "@/lib/cached-queries";
import {
  BookOpen,
  Layers,
  ArrowRight,
  ChevronLeft,
  MapPin,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import ScrollToTop from "@/components/common/ScrollToTop";
import { ShareButton, MagazineReader } from "@/components/magazine/MagazineClientComponents";

const BRAND_BLUE = "#2454a4";

/**
 * 3D 书封展示组件
 * 用于在详情页左侧展示带有立体感和光影效果的杂志封面
 */
const MagazineCover3D = ({ src, title }: { src: string; title: string }) => {
  return (
    <div className="relative group perspective-1000">
      <div
        className="relative w-[280px] md:w-[340px] aspect-[3/4] transform rotate-y-[-5deg] rotate-x-[2deg]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 封面图层 */}
        <div className="absolute inset-0 z-10 rounded-r-md overflow-hidden shadow-2xl">
          {/* 左侧书脊高光 */}
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-white/40 to-transparent z-20 pointer-events-none"></div>
          <Image
            src={src}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 340px"
          />
        </div>

        {/* 书脊厚度 */}
        <div
          className="absolute left-0 top-1 bottom-1 w-[12px] bg-white z-0 -translate-x-[6px] translate-z-[-6px] rotate-y-[-90deg] shadow-inner"
          style={{ background: 'linear-gradient(to right, #ddd, #fff 20%, #ddd)' }}
        ></div>

        {/* 书页厚度 (底部) */}
        <div
          className="absolute bottom-0 left-1 right-1 h-[12px] bg-white z-0 translate-y-[6px] rotate-x-[-90deg] shadow-sm"
          style={{
            background: 'linear-gradient(to bottom, #f5f5f5, #fff)',
            backgroundImage: 'repeating-linear-gradient(to right, #f5f5f5 0px, #f5f5f5 1px, #fff 1px, #fff 2px)'
          }}
        ></div>

        {/* 底部静态阴影 */}
        <div className="absolute -bottom-8 left-4 right-4 h-4 bg-black/40 blur-xl rounded-[100%] translate-z-[-20px] opacity-60"></div>
      </div>
    </div>
  );
};

/**
 * 杂志详情主页面 (Server Component)
 */
export default async function MagazineDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ embedded?: string }>;
}) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const isEmbedded = sp?.embedded === "1";

  const preview = await getPreviewPayload();
  const usePreview =
    preview?.type === "magazine" &&
    preview.payload &&
    typeof preview.payload === "object" &&
    "slug" in preview.payload &&
    String((preview.payload as { slug: unknown }).slug) === slug;

  let magazine: Awaited<ReturnType<typeof getCachedMagazineBySlug>>;
  if (usePreview && preview.payload && typeof preview.payload === "object") {
    const p = preview.payload as Record<string, unknown>;
    magazine = {
      id: String(p.id ?? ""),
      title: String(p.title ?? ""),
      slug: String(p.slug ?? slug),
      description: p.description != null ? String(p.description) : null,
      region: String(p.region ?? "All"),
      coverImage: p.coverImage != null ? String(p.coverImage) : null,
      images: Array.isArray(p.images) ? (p.images as string[]) : [],
      pdfUrl: p.pdfUrl != null ? String(p.pdfUrl) : null,
      readLink: p.readLink != null ? String(p.readLink) : null,
      issueDate: p.issueDate ? new Date(p.issueDate as string) : new Date(),
      published: true,
      hidden: false,
      readingDirection: p.readingDirection === "rtl" ? "rtl" : "ltr",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } else {
    magazine = await getCachedMagazineBySlug(slug);
  }

  if (!magazine) return notFound();

  // 日期格式化
  const publishDate = new Date(magazine.issueDate);
  const year = publishDate.getFullYear();
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');

  // 内页数据处理：将扁平图片数组转换为跨页结构 (Spread)
  // ltr: 左=P(2n+1) 右=P(2n+2)；rtl（左開き）: 見開き左右を入れ替え
  const images = magazine.images || [];
  const isRTL = magazine.readingDirection === "rtl";
  const spreads = [];
  for (let i = 0; i < images.length; i += 2) {
    const first = images[i];
    const second = images[i + 1];
    spreads.push({
      left: isRTL && second ? second : first,
      right: isRTL && second ? first : second || undefined,
    });
  }

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans selection:bg-sumo-brand selection:text-white flex flex-col">
      {(usePreview && !isEmbedded && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold flex flex-wrap items-center justify-center gap-2">
          <span>プレビュー — 未保存の内容を表示しています。正式に反映するには管理画面で「保存」してください。</span>
          <a href="javascript:history.back()" className="underline font-bold hover:no-underline">
            編集に戻る
          </a>
        </div>
      )) as React.ReactNode}

      {/* --- Header Section (与 clubs/[slug] 统一风格) --- */}
      <section className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
        {/* 背景渐变 */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, ${BRAND_BLUE}, #1a3a7a)` }}
        ></div>

        {/* 背景网格装饰 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* 巨大水印 */}
        <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none tracking-tighter mix-blend-overlay">
          MAG
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
          {/* 返回按钮 */}
          <div className="flex justify-center mb-8">
            <Link
              href="/magazines"
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all text-white group"
            >
              <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">フォトブック一覧へ戻る</span>
            </Link>
          </div>

          {/* 标题 */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight mb-6 text-white leading-tight">
            {magazine.title}
          </h1>

          {/* 顶部简要信息：区域 + 发刊日 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white/80 font-medium">
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-[10px] uppercase tracking-widest border border-white/10">
              <MapPin size={12} /> {magazine.region}
            </span>
            <span className="hidden md:inline w-px h-4 bg-white/20"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">
              {year}.{month}.{day} 発行
            </span>
          </div>
        </div>
      </section>

      {/* 主体内容区域 */}
      <section className="relative px-4 md:px-6 -mt-32 z-20 pb-32">
        <div className="container mx-auto max-w-6xl">
          <Ceramic interactive={false} className="bg-white border-b-[6px] border-b-sumo-brand shadow-2xl overflow-hidden p-0 rounded-t-[2.5rem]">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[800px]">

              {/* 左侧边栏：封面与操作按钮 */}
              <aside className="lg:col-span-5 border-r border-gray-100 bg-[#FAFAFA] p-8 md:p-16 flex flex-col items-center">
                <div className="sticky top-12 flex flex-col items-center gap-10">

                  {/* 3D 封面展示 */}
                  {magazine.coverImage && (
                    <MagazineCover3D src={magazine.coverImage} title={magazine.title} />
                  )}

                  {/* 操作按钮区 */}
                  <div className="w-full max-w-[300px] space-y-4">
                    {/* 在线阅读按钮：仅当存在外部链接时显示 */}
                    {magazine.readLink && (
                      <a
                        href={magazine.readLink}
                        target="_blank"
                        className="group relative w-full flex items-center justify-between px-6 py-4 bg-gray-900 text-white overflow-hidden rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-sumo-brand to-sumo-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center gap-3">
                          <BookOpen size={20} className="text-sumo-gold" />
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-bold text-white/50 uppercase tracking-widest leading-none mb-1">デジタル版</span>
                            <span className="text-sm font-bold tracking-widest">今すぐ読む</span>
                          </div>
                        </div>
                        <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}

                    {/* 分享按钮 */}
                    <div className="w-full">
                      <ShareButton />
                    </div>
                  </div>
                </div>
              </aside>

              {/* 右侧主内容：简介与内页预览 */}
              <article className="lg:col-span-7 p-8 md:p-20 bg-white">

                {/* 刊物简介 */}
                <div className="mb-20 max-w-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-[2px] bg-sumo-brand"></div>
                    <h3 className="text-xs font-black text-sumo-brand uppercase tracking-[0.25em]">概要</h3>
                  </div>
                  <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed font-serif text-justify">
                    {magazine.description || "この号に関する詳細な説明はまだありません。"}
                  </p>
                </div>

                {/* 内页预览与阅读器 */}
                <div>
                  <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-2">
                      <Layers size={14} /> 誌面紹介
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400">プレビュー {spreads.length} 見開き</span>
                  </div>

                  {spreads.length > 0 ? (
                    // 传入 coverImage 以在翻书效果中包含封面
                    <MagazineReader
                      spreads={spreads}
                      coverImage={magazine.coverImage}
                      readingDirection={
                        magazine.readingDirection === "rtl" ? "rtl" : "ltr"
                      }
                      innerImages={images}
                    />
                  ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Layers size={32} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-sm font-bold text-gray-400">プレビューページの公開までしばらくお待ちください。</p>
                    </div>
                  )}

                  {/* 底部引导链接 */}
                  {spreads.length > 0 && magazine.readLink && (
                    <div className="mt-16 text-center">
                      <p className="text-xs font-medium text-gray-400 mb-4">プレビューはここまでです</p>
                      <a href={magazine.readLink} target="_blank" className="inline-flex items-center gap-2 text-sumo-brand font-bold text-sm hover:underline underline-offset-4">
                        全文を読む <ArrowRight size={14} />
                      </a>
                    </div>
                  )}
                </div>

              </article>
            </div>
          </Ceramic>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}