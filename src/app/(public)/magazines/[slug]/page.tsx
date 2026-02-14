import React from "react";
import Image from "next/image";
import Link from "@/components/ui/TransitionLink";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPreviewPayload } from "@/lib/preview";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Tag,
  Layers,
  ArrowRight,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import ScrollToTop from "@/components/common/ScrollToTop";
import { ShareButton, MagazineReader } from "@/components/magazine/MagazineClientComponents";

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

export const dynamic = "force-dynamic";

/**
 * 杂志详情主页面 (Server Component)
 */
export default async function MagazineDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  const preview = await getPreviewPayload();
  const usePreview =
    preview?.type === "magazine" &&
    preview.payload &&
    typeof preview.payload === "object" &&
    "slug" in preview.payload &&
    String((preview.payload as { slug: unknown }).slug) === slug;

  let magazine: Awaited<ReturnType<typeof prisma.magazine.findFirst>>;
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } else {
    magazine = await prisma.magazine.findFirst({
      where: { slug, published: true },
    });
  }

  if (!magazine) return notFound();

  // 日期格式化
  const publishDate = new Date(magazine.issueDate);
  const year = publishDate.getFullYear();
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');

  // 内页数据处理：将扁平图片数组转换为跨页结构 (Spread)
  // 两个图片为一组，代表左右页
  const images = magazine.images || [];
  const spreads = [];
  for (let i = 0; i < images.length; i += 2) {
    spreads.push({
      left: images[i],
      right: images[i + 1] || undefined
    });
  }

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans selection:bg-sumo-brand selection:text-white flex flex-col">
      {usePreview && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold flex flex-wrap items-center justify-center gap-2">
          <span>プレビュー — 未保存の内容を表示しています。正式に反映するには管理画面で「保存」してください。</span>
          <a href="javascript:history.back()" className="underline font-bold hover:no-underline">
            編集に戻る
          </a>
        </div>
      )}
      {/* 头部区域 */}
      <header className="relative bg-sumo-brand text-white pt-32 pb-64 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>

        {/* 背景网格纹理 */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* 封面模糊背景氛围 */}
        {magazine.coverImage && (
          <div className="absolute inset-0 opacity-20 scale-110 blur-3xl saturate-150 pointer-events-none mix-blend-overlay">
            <Image src={magazine.coverImage} alt="bg" fill className="object-cover" />
          </div>
        )}

        <div className="container mx-auto max-w-6xl relative z-10 px-6">
          {/* 返回导航 */}
          <Link href="/magazines" className="inline-flex items-center gap-3 text-white/60 hover:text-white transition-colors group mb-12">
            <div className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-sumo-brand transition-all">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Back</span>
          </Link>

          {/* 标题与元数据 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-6 mb-6 opacity-80">
                <div className="flex items-center gap-2 text-xs font-mono tracking-wide px-3 py-1 bg-white/10 rounded-full border border-white/10">
                  <Calendar size={12} className="text-sumo-gold" />
                  <span>{year}.{month}.{day}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
                  <Tag size={14} className="text-white/50" />
                  <span className="uppercase tracking-widest">{magazine.region} Area</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight mb-4 drop-shadow-md text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/70">
                {magazine.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

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
                            <span className="text-xs font-bold text-white/50 uppercase tracking-widest leading-none mb-1">Digital Edition</span>
                            <span className="text-sm font-bold tracking-widest">READ NOW</span>
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
                    <h3 className="text-xs font-black text-sumo-brand uppercase tracking-[0.25em]">Issue Highlight</h3>
                  </div>
                  <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed font-serif text-justify">
                    {magazine.description || "この号に関する詳細な説明はまだありません。"}
                  </p>
                </div>

                {/* 内页预览与阅读器 */}
                <div>
                  <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-2">
                      <Layers size={14} /> Inside Look
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400">Preview {spreads.length} Spreads</span>
                  </div>

                  {spreads.length > 0 ? (
                    // 传入 coverImage 以在翻书效果中包含封面
                    <MagazineReader
                      spreads={spreads}
                      coverImage={magazine.coverImage}
                    />
                  ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Layers size={32} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-sm font-bold text-gray-400">Preview pages are not available.</p>
                      <p className="text-xs text-gray-400 mt-1">Please read the full version via the button on the left.</p>
                    </div>
                  )}

                  {/* 底部引导链接 */}
                  {spreads.length > 0 && magazine.readLink && (
                    <div className="mt-16 text-center">
                      <p className="text-xs font-medium text-gray-400 mb-4">You've reached the end of preview</p>
                      <a href={magazine.readLink} target="_blank" className="inline-flex items-center gap-2 text-sumo-brand font-bold text-sm hover:underline underline-offset-4">
                        Read Full Issue <ArrowRight size={14} />
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