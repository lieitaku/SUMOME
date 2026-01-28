"use client";

import { createStaffAccount } from "@/lib/actions/users";
import { UserPlus, Shield } from "lucide-react";

export default function StaffSettingsPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-sumo-brand/10 rounded-lg text-sumo-brand">
                        <UserPlus size={24} />
                    </div>
                    <h2 className="text-xl font-bold">新規管理者（同事）の追加</h2>
                </div>

                <form
                    action={async (formData) => {
                        const res = await createStaffAccount(formData);
                        if (res.error) alert(res.error);
                        else alert(res.success);
                    }}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">名前</label>
                            <input name="name" required className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-sumo-gold" placeholder="山田 太郎" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">メールアドレス</label>
                            <input name="email" type="email" required className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-sumo-gold" placeholder="colleague@sumo.com" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">初期パスワード</label>
                        <input name="password" type="password" required className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-sumo-gold" placeholder="8文字以上" />
                    </div>

                    <div className="bg-sumo-brand/5 p-4 rounded-xl flex items-start gap-3 border border-sumo-brand/10">
                        <Shield size={16} className="text-sumo-brand mt-1" />
                        <p className="text-[10px] text-sumo-brand leading-relaxed font-bold">
                            ※ ここで作成したアカウントは最初から「管理者」権限を持ちます。<br />
                            作成後、同事に設定したメールアドレスとパスワードを伝えてください。
                        </p>
                    </div>

                    <button type="submit" className="w-full bg-sumo-brand text-white py-4 rounded-xl font-bold hover:bg-sumo-dark transition-all shadow-lg active:scale-[0.98]">
                        管理者アカウントを作成
                    </button>
                </form>
            </div>
        </div>
    );
}