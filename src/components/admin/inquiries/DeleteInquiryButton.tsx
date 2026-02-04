"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteInquiry } from "@/lib/actions/inquiries";

interface Props {
    id: string;
}

export default function DeleteInquiryButton({ id }: Props) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            await deleteInquiry(id);
        });
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2 mt-4">
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-bold rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                    {isPending ? "削除中..." : "削除する"}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded hover:bg-gray-300 transition-colors"
                >
                    キャンセル
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="mt-4 flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-500 transition-colors font-bold"
        >
            <Trash2 size={12} />
            削除
        </button>
    );
}
