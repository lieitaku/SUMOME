import { prisma } from "@/lib/db";
import { CalendarDays, User, Mail, MessageSquare, Phone, Inbox, Building2 } from "lucide-react";
import InquiryStatusSelect from "@/components/admin/inquiries/InquiryStatusSelect";
import DeleteInquiryButton from "@/components/admin/inquiries/DeleteInquiryButton";

export default async function AdminInquiriesPage() {
    const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
    });

    const sectionHeading = "text-xl font-bold flex items-center gap-2 pb-3 border-b-2 mb-8 text-sumo-brand border-sumo-brand";
    const cardClass = "bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-sumo-gold transition-all";

    // 状态统计
    const statusCounts = {
        unread: inquiries.filter(i => i.status === "unread").length,
        read: inquiries.filter(i => i.status === "read").length,
        replied: inquiries.filter(i => i.status === "replied").length,
        closed: inquiries.filter(i => i.status === "closed").length,
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto bg-[#F9FAFB] min-h-screen">
            <header className="mb-10">
                <h1 className={sectionHeading}>
                    <Inbox className="w-6 h-6" /> お問い合わせ管理
                </h1>
                <p className="text-sm text-gray-500 -mt-6">
                    コンタクトフォームからのお問い合わせを一覧で確認できます。
                </p>
            </header>

            {/* 状态统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-black text-red-500">{statusCounts.unread}</div>
                    <div className="text-xs text-gray-400 font-bold">未読</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-black text-yellow-500">{statusCounts.read}</div>
                    <div className="text-xs text-gray-400 font-bold">確認済み</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-black text-blue-500">{statusCounts.replied}</div>
                    <div className="text-xs text-gray-400 font-bold">返信済み</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-black text-green-500">{statusCounts.closed}</div>
                    <div className="text-xs text-gray-400 font-bold">対応完了</div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {inquiries.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                        現在、新しいお問い合わせはありません。
                    </div>
                ) : (
                    inquiries.map((inquiry) => (
                        <div key={inquiry.id} className={cardClass}>
                            <div className="flex flex-col lg:flex-row justify-between gap-6">

                                {/* 左侧：核心信息 */}
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 font-bold text-gray-900">
                                            <User size={16} className="text-gray-400" />
                                            {inquiry.name}
                                            {inquiry.furigana && (
                                                <span className="text-[10px] font-normal text-gray-400 ml-2">
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

                                    <div className="flex gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                                        <MessageSquare size={16} className="flex-shrink-0 mt-1 text-gray-400" />
                                        <p className="whitespace-pre-wrap">{inquiry.message}</p>
                                    </div>
                                </div>

                                {/* 右侧：状态管理 */}
                                <div className="lg:w-48 flex flex-col justify-between items-end border-l border-gray-50 pl-6 lg:border-l lg:pl-8">
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
                    ))
                )}
            </div>
        </div>
    );
}
