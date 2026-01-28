"use client";

import { Trash2, Loader2 } from "lucide-react";
import { deleteClub } from "@/lib/actions/clubs"; // 引入刚才写的删除指令
import { useState, useTransition } from "react";

export default function DeleteClubButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        // 1. 弹出原生确认框 (简单高效)
        const confirmed = window.confirm("本当にこのクラブを削除しますか？\n※この操作は取り消せません。");
        if (!confirmed) return;

        // 2. 执行删除
        startTransition(async () => {
            const result = await deleteClub(id);
            if (result?.error) {
                alert(result.error);
            }
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-sumo-red hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            title="削除"
        >
            {isPending ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Trash2 size={16} />
            )}
        </button>
    );
}