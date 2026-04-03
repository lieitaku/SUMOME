"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { ApplicationStatus } from "@prisma/client";
import { updateApplicationStatusAction } from "@/lib/actions/recruit";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
    { value: "pending", label: "未対応", color: "bg-red-100 text-red-700 border-red-200" },
    { value: "contacted", label: "連絡済み", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { value: "joined", label: "入会完了", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { value: "rejected", label: "キャンセル", color: "bg-gray-100 text-gray-700 border-gray-200" },
];

interface Props {
    id: string;
    initialStatus: ApplicationStatus;
}

export default function StatusSelect({ id, initialStatus }: Props) {
    const router = useRouter();
    const [status, setStatus] = useState<ApplicationStatus>(initialStatus);
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as ApplicationStatus;
        setStatus(newStatus);

        startTransition(async () => {
            const res = await updateApplicationStatusAction(id, newStatus);
            if (res?.success) {
                router.refresh();
            } else {
                setStatus(initialStatus);
            }
        });
    };

    const currentOption = STATUS_OPTIONS.find((opt) => opt.value === status);

    return (
        <select
            value={status}
            onChange={handleChange}
            disabled={isPending}
            className={`w-full px-3 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sumo-brand/20 ${currentOption?.color || ""} ${isPending ? "opacity-50" : ""}`}
        >
            {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
