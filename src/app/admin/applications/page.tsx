import { prisma } from "@/lib/db";
import { CalendarDays, User, Mail, ShieldCheck, MessageSquare, Phone } from "lucide-react";
import StatusSelect from "@/components/admin/applications/StatusSelect";
import DeleteApplicationButton from "@/components/admin/applications/DeleteApplicationButton";

export default async function AdminApplicationsPage() {
    const apps = await prisma.application.findMany({
        orderBy: { createdAt: "desc" },
    });

    const sectionHeading = "text-xl font-bold flex items-center gap-2 pb-3 border-b-2 mb-8 text-sumo-brand border-sumo-brand";
    const cardClass = "bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-sumo-gold transition-all";

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto bg-[#F9FAFB] min-h-screen">
            <header className="mb-10">
                <h1 className={sectionHeading}>
                    <ShieldCheck className="w-6 h-6" /> 入会申請管理
                </h1>
                <p className="text-sm text-gray-500 -mt-6">
                    各道場への入会・体験希望者からのメッセージを一覧で確認できます。
                </p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {apps.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                        現在、新しい申請はありません。
                    </div>
                ) : (
                    apps.map((app) => (
                        <div key={app.id} className={cardClass}>
                            <div className="flex flex-col lg:flex-row justify-between gap-6">

                                {/* 左侧：核心信息 */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-sumo-brand text-white text-[10px] font-black px-2 py-1 rounded tracking-widest uppercase">
                                            {app.clubName}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                            <CalendarDays size={14} />
                                            {new Date(app.createdAt).toLocaleString('ja-JP')}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 font-bold text-gray-900">
                                            <User size={16} className="text-gray-400" />
                                            {app.name}
                                            <span className="text-[10px] font-normal text-gray-400 ml-2 px-1.5 py-0.5 border rounded">
                                                {app.experience === "beginner" ? "未経験者" : "経験者"}
                                            </span>
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
                                        <div className="flex gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100 italic text-sm text-gray-500">
                                            <MessageSquare size={16} className="flex-shrink-0 mt-1" />
                                            <p>{app.message}</p>
                                        </div>
                                    )}
                                </div>

                                {/* 右侧：状态管理 */}
                                <div className="lg:w-48 flex flex-col justify-between items-end border-l border-gray-50 pl-6 lg:border-l lg:pl-8">
                                    <div className="text-right w-full">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                                            Process Status
                                        </label>
                                        <StatusSelect id={app.id} initialStatus={app.status} />
                                    </div>
                                    <DeleteApplicationButton id={app.id} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}