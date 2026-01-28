import React from "react";
import { MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Activity, Club } from "@prisma/client";

// --- 1. 定义积木块结构 ---
interface ReportSection {
    id: string | number;
    image?: string;
    text?: string;
}

// --- 2. 定义 JSON 内容的总架构 (解决 ContentDataSchema 报错) ---
interface ContentDataSchema {
    sections?: ReportSection[]; // Report 模板用
    body?: string;             // News 模板用
    fee?: string;              // Event 模板用
    description?: string;      // Event 模板用
}

// --- 3. 定义完整的活动数据类型 (包含关联的俱乐部) ---
interface ActivityWithClub extends Activity {
    club: Club;
}

export default function StandardTemplate({ activity }: { activity: ActivityWithClub }) {
    // 安全地将 Prisma 的 JsonValue 转换为我们的 Schema
    const contentData = activity.contentData as unknown as ContentDataSchema | null;
    const { templateType } = activity;

    return (
        <article className="max-w-4xl mx-auto bg-white min-h-screen font-sans">
            {/* --- 1. Hero Section (主视觉) --- */}
            <header className="space-y-8 pb-12 border-b border-gray-100">
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[10px] font-black tracking-[0.2em] text-sumo-brand uppercase">
                        <span className="bg-sumo-brand/10 px-3 py-1 rounded-full">{activity.category}</span>
                        <span className="text-gray-300">/</span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(activity.date).toLocaleDateString("ja-JP")}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif font-black text-gray-900 leading-[1.2] tracking-tight">
                        {activity.title}
                    </h1>

                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium pt-2">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-gray-300" />
                            <span>{activity.club.name} ({activity.club.area})</span>
                        </div>
                    </div>
                </div>

                {activity.mainImage && (
                    <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-lg bg-gray-100">
                        <img
                            src={activity.mainImage}
                            alt={activity.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </header>

            {/* --- 2. Content Area (分模块渲染) --- */}
            <div className="py-12 md:py-16">
                {/* REPORT 渲染 */}
                {templateType === "report" && contentData?.sections && (
                    <div className="space-y-20">
                        {contentData.sections.map((section, index) => (
                            <section key={section.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className={cn(
                                    "grid grid-cols-1 md:grid-cols-12 gap-10 items-center",
                                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                                )}>
                                    {section.image && (
                                        <div className="md:col-span-7">
                                            <div className="overflow-hidden rounded-xl bg-gray-50 shadow-sm border border-gray-100">
                                                <img
                                                    src={section.image}
                                                    alt={`Scene ${index + 1}`}
                                                    className="w-full h-auto hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className={cn(
                                        section.image ? "md:col-span-5" : "md:col-span-12",
                                        "space-y-4"
                                    )}>
                                        <p className="text-lg text-gray-700 leading-[1.8] font-medium whitespace-pre-wrap">
                                            {section.text}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {/* NEWS 渲染 */}
                {templateType === "news" && (
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                            {contentData?.body || activity.content}
                        </div>
                    </div>
                )}

                {/* EVENT 渲染 */}
                {templateType === "event" && (
                    <div className="max-w-3xl mx-auto space-y-12">
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-inner">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">開催場所</span>
                                <p className="text-lg font-bold text-gray-900">{activity.location || "未定"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">費用</span>
                                <p className="text-lg font-bold text-gray-900">{contentData?.fee || "無料"}</p>
                            </div>
                        </div>
                        <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {contentData?.description || activity.content}
                        </div>
                    </div>
                )}
            </div>

            <footer className="py-12 border-t border-gray-100 text-center">
                <button
                    onClick={() => window.history.back()}
                    className="text-xs font-black tracking-widest text-gray-400 hover:text-sumo-brand transition-colors uppercase"
                >
                    ← Back to Activities
                </button>
            </footer>
        </article>
    );
}