import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  ArrowLeft,
  BookOpen,
  Share2,
  Download,
  Calendar,
  Tag,
  Layers,
  ArrowRight,
  Globe,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import ScrollToTop from "@/components/common/ScrollToTop";

// ✨ 1. 将组件改为异步 Server Component
export default async function MagazineDetailPage({
  params
}: {
  params: Promise<{ slug: string }> // ✨ 确保这里是 slug
}) {
  const { slug } = await params;

  // ✨ 使用 findFirst 替代 findUnique，以支持多条件过滤
  const magazine = await prisma.magazine.findFirst({
    where: {
      slug: slug,
      published: true
    },
  });

  if (!magazine) return notFound();

  // ✨ 3. 处理日期显示
  const publishDate = new Date(magazine.issueDate);
  const year = publishDate.getFullYear();
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans selection:bg-sumo-brand selection:text-white flex flex-col">
      {/* Header 部分 */}
      <header className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>
        <div className="container mx-auto max-w-6xl relative z-10 px-6">
          <Link href="/magazines" className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors group mb-12">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-sumo-brand transition-all">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Back to Library</span>
          </Link>

          <div className="flex flex-wrap items-center gap-6 mb-8 opacity-90">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wide">
              <Calendar size={14} className="text-sumo-gold" />
              <span>{year}.{month}.{day}</span>
            </div>
            <div className="w-px h-3 bg-white/30"></div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <Tag size={14} className="text-sumo-gold" />
              <span>{magazine.slug.toUpperCase()}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.2] tracking-wide mb-4 max-w-4xl drop-shadow-sm">
            {magazine.title}
          </h1>
        </div>
      </header>

      {/* 内容主体区域 */}
      <section className="relative px-4 md:px-6 -mt-24 z-20 pb-32">
        <div className="container mx-auto max-w-6xl">
          <Ceramic interactive={false} className="bg-white border-b-[6px] border-b-sumo-brand shadow-2xl overflow-hidden p-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-white min-h-[600px]">

              {/* 左侧：封面与下载 */}
              <aside className="lg:col-span-5 border-r border-gray-100 bg-gray-50/40 p-8 md:p-12">
                <div className="lg:sticky lg:top-12 flex flex-col items-center lg:items-start gap-8">
                  <div className="relative w-[280px] md:w-[320px] aspect-[3/4] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm group">
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-gray-900/20 to-transparent z-20"></div>
                    {magazine.coverImage && (
                      <Image src={magazine.coverImage} alt={magazine.title} fill className="object-cover" priority />
                    )}
                  </div>

                  <div className="w-full max-w-[320px] space-y-4">
                    {/* 链接打通：在线阅读 */}
                    {magazine.readLink && (
                      <a href={magazine.readLink} target="_blank" className="w-full flex items-center justify-center gap-3 py-4 bg-sumo-dark text-white text-sm font-bold tracking-widest uppercase rounded shadow-lg hover:bg-sumo-brand transition-all">
                        <BookOpen size={18} /> Read Online
                      </a>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded">
                        <Share2 size={14} /> Share
                      </button>

                      {/* 链接打通：PDF 下载 */}
                      {magazine.pdfUrl ? (
                        <a href={magazine.pdfUrl} download className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded hover:border-sumo-dark transition-colors">
                          <Download size={14} /> PDF
                        </a>
                      ) : (
                        <button disabled className="opacity-50 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-400 text-xs font-bold rounded cursor-not-allowed">
                          <Download size={14} /> No PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </aside>

              {/* 右侧：简介与预览 */}
              <article className="lg:col-span-7 p-8 md:p-16 lg:p-20">
                <div className="mb-16">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <div className="w-8 h-[1px] bg-gray-300"></div> Editorial Note
                  </h3>
                  <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed font-serif">
                    {magazine.description || "No description available for this issue."}
                  </p>
                </div>

                {/* 这里可以放一些固定的展示，或者根据需要扩展图片数组 */}
                <div className="opacity-40 grayscale pointer-events-none">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Preview Pages Coming Soon</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-gray-100 rounded border border-dashed border-gray-300"></div>
                    ))}
                  </div>
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