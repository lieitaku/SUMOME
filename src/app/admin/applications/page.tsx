import { prisma } from "@/lib/db";
import { CalendarDays, User, Mail, MessageSquare, Phone } from "lucide-react";
import StatusSelect from "@/components/admin/applications/StatusSelect";
import DeleteApplicationButton from "@/components/admin/applications/DeleteApplicationButton";

export default async function AdminApplicationsPage() {
    const apps = await prisma.application.findMany({
        orderBy: { createdAt: "desc" },
    });

    // 状态统计
    const statusCounts = {
        pending: apps.filter(a => a.status === "pending").length,
        contacted: apps.filter(a => a.status === "contacted").length,
        completed: apps.filter(a => a.status === "completed").length,
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            {/* --- ヘッダー --- */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">入会申請管理</h1>
                    <p className="text-gray-500 mt-1 text-xs md:text-sm">
                        各道場への入会・体験希望者からのメッセージを一覧で確認できます
                    </p>
                </div>
            </div>

            {/* 状態統計カード */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-yellow-500">{statusCounts.pending}</div>
                    <div className="text-xs text-gray-400 font-bold">未対応</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-blue-500">{statusCounts.contacted}</div>
                    <div className="text-xs text-gray-400 font-bold">連絡済み</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-green-500">{statusCounts.completed}</div>
                    <div className="text-xs text-gray-400 font-bold">対応完了</div>
                </div>
            </div>

            {/* 申請リスト */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {apps.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        現在、新しい申請はありません。
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {apps.map((app) => (
                            <div key={app.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    {/* 左側：核心情報 */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="bg-sumo-brand text-white text-[10px] font-black px-2 py-1 rounded tracking-widest uppercase">
                                                {app.clubName}
                                            </span>
                                            <span className="text-[10px] font-normal text-gray-400 px-1.5 py-0.5 border rounded">
                                                {app.experience === "beginner" ? "未経験者" : "経験者"}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                <CalendarDays size={14} />
                                                {new Date(app.createdAt).toLocaleString('ja-JP')}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                                <User size={16} className="text-gray-400" />
                                                {app.name}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={16} className="text-gray-400" />
                                                {app.email}
                                            </div>
                                            {app.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone size={16} className="text-gray-400" />
                                                    {app.phone}
                                                </div>
                                            )}
                                        </div>

                                        {app.message && (
                                            <div className="flex gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-500">
                                                <MessageSquare size={16} className="flex-shrink-0 mt-1 text-gray-400" />
                                                <p>{app.message}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* 右側：状態管理 */}
                                    <div className="lg:w-48 flex flex-col justify-between items-end gap-4 lg:border-l lg:border-gray-100 lg:pl-6">
                                        <div className="text-right w-full">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                                                Status
                                            </label>
                                            <StatusSelect id={app.id} initialStatus={app.status} />
                                        </div>
                                        <DeleteApplicationButton id={app.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}