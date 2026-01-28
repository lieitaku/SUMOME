"use client";

import { useState } from "react";
import { ApplicationStatus } from "@prisma/client";
import { updateApplicationStatusAction } from "@/lib/actions/recruit";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// 定义状态对应的颜色样式
const statusStyles: Record<ApplicationStatus, string> = {
    pending: "bg-gray-100 text-gray-600 border-gray-200",
    contacted: "bg-blue-50 text-blue-700 border-blue-200",
    joined: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusSelect({ id, initialStatus }: { id: string; initialStatus: ApplicationStatus }) {
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(initialStatus);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = async (newStatus: string) => {
        const status = newStatus as ApplicationStatus;
        setLoading(true);

        const result = await updateApplicationStatusAction(id, status);

        if (result.success) {
            setCurrentStatus(status);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000); // 2秒后消失
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="relative w-full group">
            <select
                value={currentStatus}
                onChange={(e) => handleChange(e.target.value)}
                disabled={loading}
                className={cn(
                    "w-full text-[11px] font-black uppercase tracking-tighter border-2 rounded-xl p-2.5 outline-none transition-all cursor-pointer appearance-none",
                    statusStyles[currentStatus],
                    loading && "opacity-50 cursor-not-allowed"
                )}
            >
                <option value="pending">未対応 (Pending)</option>
                <option value="contacted">連絡済み (Contacted)</option>
                <option value="joined">入会完了 (Joined)</option>
                <option value="rejected">キャンセル (Rejected)</option>
            </select>

            {/* 状态指示图标 */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {loading ? (
                    <Loader2 size={14} className="animate-spin opacity-50" />
                ) : showSuccess ? (
                    <Check size={14} className="text-emerald-500" />
                ) : (
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-current opacity-30" />
                )}
            </div>
        </div>
    );
}