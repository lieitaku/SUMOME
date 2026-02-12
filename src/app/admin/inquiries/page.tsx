import React, { Suspense } from "react";
import { prisma } from "@/lib/db";
import { CalendarDays, User, Mail, MessageSquare, Phone, Building2 } from "lucide-react";
import InquiryStatusSelect from "@/components/admin/inquiries/InquiryStatusSelect";
import DeleteInquiryButton from "@/components/admin/inquiries/DeleteInquiryButton";

const INQUIRY_SELECT = {
    id: true,
    inquiryType: true,
    name: true,
    furigana: true,
    email: true,
    phone: true,
    message: true,
    status: true,
    createdAt: true,
} as const;

async function InquiriesList() {
    const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        select: INQUIRY_SELECT,
    });

    const statusCounts = {
        unread: inquiries.filter(i => i.status === "unread").length,
        read: inquiries.filter(i => i.status === "read").length,
        replied: inquiries.filter(i => i.status === "replied").length,
        closed: inquiries.filter(i => i.status === "closed").length,
    };

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-red-500">{statusCounts.unread}</div>
                    <div className="text-xs text-gray-400 font-bold">未読</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-yellow-500">{statusCounts.read}</div>
                    <div className="text-xs text-gray-400 font-bold">確認済み</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-blue-500">{statusCounts.replied}</div>
                    <div className="text-xs text-gray-400 font-bold">返信済み</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-green-500">{statusCounts.closed}</div>
                    <div className="text-xs text-gray-400 font-bold">対応完了</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {inquiries.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        現在、新しいお問い合わせはありません。
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="bg-sumo-brand text-white text-[10px] font-black px-2 py-1 rounded tracking-widest uppercase flex items-center gap-1">
                                                <Building2 size={10} />
                                                {inquiry.inquiryType}
                                            </span>
                                            {inquiry.status === "unread" && (
                                                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded tracking-widest uppercase">
                                                    NEW
                                                </span>
                                            )}
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                <CalendarDays size={14} />
                                                {new Date(inquiry.createdAt).toLocaleString('ja-JP')}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                                <User size={16} className="text-gray-400" />
                                                {inquiry.name}
                                                {inquiry.furigana && (
                                                    <span className="text-[10px] font-normal text-gray-400 ml-1">
                                                        ({inquiry.furigana})
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={16} className="text-gray-400" />
                                                <a href={`mailto:${inquiry.email}`} className="hover:text-sumo-brand transition-colors">
                                                    {inquiry.email}
                                                </a>
                                            </div>
                                            {inquiry.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone size={16} className="text-gray-400" />
                                                    <a href={`tel:${inquiry.phone}`} className="hover:text-sumo-brand transition-colors">
                                                        {inquiry.phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-500">
                                            <MessageSquare size={16} className="flex-shrink-0 mt-1 text-gray-400" />
                                            <p className="whitespace-pre-wrap">{inquiry.message}</p>
                                        </div>
                                    </div>
                                    <div className="lg:w-48 flex flex-col justify-between items-end gap-4 lg:border-l lg:border-gray-100 lg:pl-6">
                                        <div className="text-right w-full">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                                                Status
                                            </label>
                                            <InquiryStatusSelect id={inquiry.id} initialStatus={inquiry.status} />
                                        </div>
                                        <DeleteInquiryButton id={inquiry.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function InquiriesListFallback() {
    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center animate-pulse">
                        <div className="h-8 w-12 bg-gray-200 rounded mx-auto mb-2" />
                        <div className="h-4 w-16 bg-gray-100 rounded mx-auto" />
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-32 border-b border-gray-100" />
                <div className="h-32 border-b border-gray-100" />
                <div className="h-32" />
            </div>
        </>
    );
}

export default function AdminInquiriesPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">お問い合わせ管理</h1>
                    <p className="text-gray-500 mt-1 text-xs md:text-sm">
                        コンタクトフォームからのお問い合わせを一覧で確認できます
                    </p>
                </div>
            </div>
            <Suspense fallback={<InquiriesListFallback />}>
                <InquiriesList />
            </Suspense>
        </div>
    );
}
