"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteApplicationAction } from "@/lib/actions/recruit";

export default function DeleteApplicationButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        // 行政级安全确认
        if (!window.confirm("この申請データを完全に削除しますか？この操作は取り消せません。")) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteApplicationAction(id);

        if (!result.success) {
            alert(result.error);
            setIsDeleting(false);
        }
        // 成功后 revalidatePath 会自动刷新页面，这里不需要额外操作
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-[10px] font-black text-gray-300 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
        >
            {isDeleting ? (
                <Loader2 size={12} className="animate-spin" />
            ) : (
                <Trash2 size={12} />
            )}
            {isDeleting ? "Deleting..." : "Delete Request"}
        </button>
    );
}