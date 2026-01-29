"use client";

import React, { useTransition } from "react";
import { Save, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createStaffAccount, updateMyProfile, updatePassword } from "@/lib/actions/users";

// --- Profile Form ---
export function ProfileForm({ initialName }: { initialName: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <form action={(formData) => {
            startTransition(async () => {
                const res = await updateMyProfile(formData);
                if (res.error) toast.error(res.error);
                else toast.success("プロフィールを更新しました");
            });
        }} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">表示名</label>
                <input
                    name="name"
                    defaultValue={initialName} // ✨ 回显当前名字
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    placeholder="名前を入力..."
                />
            </div>
            <div className="flex justify-end">
                <button disabled={isPending} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors disabled:opacity-50">
                    <Save size={14} /> {isPending ? "更新中..." : "更新する"}
                </button>
            </div>
        </form>
    );
}

// --- Password Form ---
export function PasswordForm() {
    const [isPending, startTransition] = useTransition();

    return (
        <form action={(formData) => {
            startTransition(async () => {
                const res = await updatePassword(formData);
                if (res.error) toast.error(res.error);
                else {
                    toast.success("パスワードを変更しました");
                    // 实际上这里最好清空一下输入框，但在 Server Action 模式下如果不刷新页面比较麻烦，暂时这样即可
                }
            });
        }} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">新しいパスワード</label>
                <input name="password" type="password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium" placeholder="8文字以上" />
            </div>
            <div className="flex justify-end">
                <button disabled={isPending} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors disabled:opacity-50">
                    <Save size={14} /> {isPending ? "変更中..." : "パスワード変更"}
                </button>
            </div>
        </form>
    );
}

// --- Create Staff Form ---
export function CreateStaffForm() {
    const [isPending, startTransition] = useTransition();

    return (
        <form action={(formData) => {
            startTransition(async () => {
                const res = await createStaffAccount(formData);
                if (res.error) toast.error(res.error);
                else toast.success("管理者アカウントを作成しました");
            });
        }} className="space-y-5">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">名前</label>
                <input name="name" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sumo-brand text-sm font-medium" placeholder="山田 太郎" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">メールアドレス</label>
                <input name="email" type="email" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sumo-brand text-sm font-medium" placeholder="colleague@sumo.com" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">初期パスワード</label>
                <input name="password" type="password" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sumo-brand text-sm font-medium" placeholder="8文字以上" />
            </div>

            <button disabled={isPending} className="w-full bg-sumo-brand text-white py-3.5 rounded-xl font-bold hover:bg-sumo-dark transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <UserPlus size={18} />
                {isPending ? "作成中..." : "管理者アカウントを作成"}
            </button>
        </form>
    );
}