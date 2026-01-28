"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft, MapPin, Clock, Users, CheckCircle2, Send,
    User, Mail, Phone, Sparkles, Target, CalendarDays, ShieldCheck,
} from "lucide-react";

import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { type Club } from "@prisma/client";
import { submitApplicationAction } from "@/lib/actions/recruit";

const BRAND_BLUE = "#2454a4";

export default function RecruitForm({ club }: { club: Club }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        experience: "beginner",
        message: "",
    });

    // 1. ✨ 真实的提交逻辑替换掉模拟的 setTimeout
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await submitApplicationAction({
            ...formData,
            clubId: club.id,
            clubName: club.name,
        });

        if (result.success) {
            alert("お申し込みありがとうございます！担当者よりご連絡いたします。");
            router.push(`/clubs/${club.slug}`);
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div
            className="min-h-screen bg-[#F4F5F7] font-sans selection:text-white"
            style={{ "--selection-bg": BRAND_BLUE } as React.CSSProperties}
        >
            <style jsx global>{`
        ::selection { background-color: var(--selection-bg); }
      `}</style>

            {/* --- 1. Header (完整保留你的设计) --- */}
            <section className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${BRAND_BLUE}, #1a3a7a)` }} />
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
                <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[18vw] font-black text-white opacity-[0.03] select-none pointer-events-none tracking-tighter mix-blend-overlay">JOIN</div>

                <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
                    <div className="flex justify-center mb-8">
                        <Link href={`/clubs/${club.slug}`} className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors text-white group">
                            <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Back to Detail</span>
                        </Link>
                    </div>
                    <div className="reveal-up delay-100">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-white mb-6 border border-white/20 backdrop-blur-md bg-white/5">
                            <Sparkles size={12} /> Recruitment
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-sm leading-tight">体验・入会申し込み</h1>
                        <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed">
                            <span className="font-bold border-b border-white/30 pb-0.5 mx-1">{club.name}</span> への第一歩。
                        </p>
                    </div>
                </div>
            </section>

            {/* --- 2. Main Content (完整保留你的 Grid 布局) --- */}
            <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* 左侧栏 */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <Ceramic interactive={false} className="bg-white border-b-[6px] shadow-lg overflow-hidden p-0" style={{ borderBottomColor: BRAND_BLUE }}>
                                <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                                    <Target size={18} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Entry Requirements</span>
                                </div>
                                <div className="p-8 md:p-10">
                                    <div className="space-y-8">
                                        <div className="flex gap-4 items-start">
                                            <div className="mt-1 w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100"><Clock size={18} /></div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 mb-1">稽古場所</h4>
                                                <p className="text-sm text-gray-600 font-medium">{club.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <div className="mt-1 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100"><Users size={18} /></div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 mb-1">募集対象</h4>
                                                <p className="text-sm text-gray-600 font-medium">{club.target || "全年齢"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 my-8" />
                                    <div className="bg-[#F8FAFC] rounded-lg p-4 border border-blue-50">
                                        <div className="flex gap-3">
                                            <ShieldCheck size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div className="text-xs text-gray-500 leading-relaxed font-medium">
                                                <p className="mb-1 text-gray-900 font-bold">初心者の方へ</p>
                                                道具の貸し出しも行っています。手ぶらで見学にお越しください。
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Ceramic>
                        </div>

                        {/* 右侧栏：表单 (保留你所有的表单动效和装饰) */}
                        <div className="lg:col-span-7">
                            <Ceramic interactive={false} className="bg-white border-b-[6px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-8 md:p-12 relative overflow-hidden" style={{ borderBottomColor: BRAND_BLUE }}>
                                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ backgroundColor: BRAND_BLUE }} />
                                <div className="relative z-10">
                                    <div className="mb-10">
                                        <h2 className="text-2xl font-serif font-black text-gray-900 mb-2 flex items-center gap-3">
                                            <CalendarDays size={24} className="text-gray-400" /> お申し込みフォーム
                                        </h2>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider pl-9">Application Form</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* お名前 */}
                                        <div className="space-y-2 group">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors"><User size={14} /> お名前 <span className="text-red-400">*</span></label>
                                            <input type="text" name="name" required placeholder="例：山田 太郎" value={formData.name} onChange={handleInputChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 text-sm font-bold text-gray-900 placeholder-gray-300 focus:outline-none focus:border-sumo-brand transition-all" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2 group">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors"><Mail size={14} /> Email <span className="text-red-400">*</span></label>
                                                <input type="email" name="email" required placeholder="sample@email.com" value={formData.email} onChange={handleInputChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:border-sumo-brand transition-all" />
                                            </div>
                                            <div className="space-y-2 group">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors"><Phone size={14} /> 電話番号</label>
                                                <input type="tel" name="phone" placeholder="090-1234-5678" value={formData.phone} onChange={handleInputChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:border-sumo-brand transition-all" />
                                            </div>
                                        </div>

                                        {/* 经验单选 */}
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">相撲経験</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {["beginner", "experienced"].map((type) => (
                                                    <label key={type} className={cn("cursor-pointer border rounded-xl p-4 text-center transition-all flex flex-col items-center gap-2 group", formData.experience === type ? "bg-blue-50/50 border-sumo-brand shadow-sm" : "bg-white border-gray-200")}>
                                                        <input type="radio" name="experience" value={type} checked={formData.experience === type} onChange={handleInputChange} className="sr-only" />
                                                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center transition-colors", formData.experience === type ? "border-sumo-brand" : "border-gray-300")}>
                                                            {formData.experience === type && <div className="w-2 h-2 rounded-full bg-sumo-brand" />}
                                                        </div>
                                                        <span className={cn("text-sm font-bold", formData.experience === type ? "text-sumo-brand" : "text-gray-500")}>
                                                            {type === "beginner" ? "未経験・初心者" : "経験者"}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2 group">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-focus-within:text-sumo-brand transition-colors">メッセージ</label>
                                            <textarea name="message" rows={4} placeholder="質問などあれば記入してください" value={formData.message} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:border-sumo-brand focus:ring-4 focus:ring-blue-50 transition-all resize-none" />
                                        </div>

                                        <div className="pt-6">
                                            <Button type="submit" disabled={isSubmitting} className={cn("w-full py-5 text-white shadow-xl transition-all", isSubmitting ? "opacity-80" : "hover:brightness-110")} style={{ backgroundColor: BRAND_BLUE, boxShadow: `0 10px 30px -5px ${BRAND_BLUE}66` }}>
                                                <span className="flex items-center gap-3">
                                                    {isSubmitting ? "送信中..." : <><Send size={18} /> メッセージを送信する</>}
                                                </span>
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </Ceramic>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}