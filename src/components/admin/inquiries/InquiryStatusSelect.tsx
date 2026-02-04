"use client";

import { useState, useTransition } from "react";
import { updateInquiryStatus } from "@/lib/actions/inquiries";
import { InquiryStatus } from "@prisma/client";

const STATUS_OPTIONS: { value: InquiryStatus; label: string; color: string }[] = [
    { value: "unread", label: "未読", color: "bg-red-100 text-red-700 border-red-200" },
    { value: "read", label: "確認済み", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { value: "replied", label: "返信済み", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { value: "closed", label: "対応完了", color: "bg-green-100 text-green-700 border-green-200" },
];

interface Props {
    id: string;
    initialStatus: InquiryStatus;
}

export default function InquiryStatusSelect({ id, initialStatus }: Props) {
    const [status, setStatus] = useState<InquiryStatus>(initialStatus);
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as InquiryStatus;
        setStatus(newStatus);

        startTransition(async () => {
            await updateInquiryStatus(id, newStatus);
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
