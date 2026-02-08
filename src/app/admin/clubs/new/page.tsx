"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info, AlertTriangle, Building2, CheckCircle2 } from "lucide-react";

// ✨ 引入统一的基础设施
import ImageUploader from "@/components/admin/ui/ImageUploader";
import { useFormAction } from "@/hooks/useFormAction";
import AdminFormLayout from "@/components/admin/ui/AdminFormLayout";

// ✨ 引入 Server Action
import { createClub } from "@/lib/actions/clubs";

// --- Zod Schema ---
const formSchema = z.object({
    name: z.string().min(1, "クラブ名は必須入力です"),
    slug: z.string()
        .min(3, "IDは3文字以上で入力してください")
        .regex(/^[a-z0-9-]+$/, "IDは半角英小文字、数字、ハイフン(-)のみ使用可能です"),
    description: z.string().optional(),
    logo: z.string().optional(),
    mainImage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewClubPage() {
    // 1. 初始化表单
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            logo: "",
            mainImage: "",
        },
    });

    // ✨ 2. 初始化提交逻辑
    // successMessage: 弹窗显示的文字
    // redirectUrl: 弹窗后自动跳转的路径
    const { isSubmitting, handleSubmit } = useFormAction({
        successMessage: "新しいクラブを登録しました！",
        redirectUrl: "/admin/clubs"
    });

    // 提交处理
    const onSubmit = (data: FormValues) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value || "");
        });

        // 调用统一的提交处理器
        handleSubmit(createClub, formData);
    };

    // 辅助样式类
    const sectionClass = "bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500";
    const labelClass = "block text-xs font-bold mb-1.5 uppercase tracking-wide text-gray-400";
    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all text-sm focus:ring-2 focus:ring-sumo-brand focus:border-transparent font-medium";

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <AdminFormLayout
                title="新規クラブ登録"
                subTitle="Create New Club"
                backLink="/admin/clubs"
                isSubmitting={isSubmitting}
                headerActions={
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                        <CheckCircle2 size={12} /> Registration Mode
                    </div>
                }
            >
                <div className="space-y-8">
                    {/* Section 1: 基本情报 */}
                    <div className={sectionClass}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className={labelClass}>クラブ名 <span className="text-red-500">*</span></label>
                                    <input
                                        {...form.register("name")}
                                        className={inputClass}
                                        placeholder="例：大阪相撲クラブ"
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-red-500 text-[10px] mt-1 font-bold italic">{form.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>クラブID (URL用) <span className="text-red-500">*</span></label>
                                    <input
                                        {...form.register("slug")}
                                        className={`${inputClass} font-mono`}
                                        placeholder="osaka-sumo"
                                    />

                                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-start mt-3 space-y-3">
                                        <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                                        <div className="text-[11px] text-amber-900 leading-relaxed font-medium space-y-2">
                                            <p>
                                                <span className="font-black underline">注意：</span>
                                                このIDはURLの一部になります。後から変更するとリンク切れの原因になるため、慎重に決めてください。
                                            </p>
                                            <p>
                                                <span className="font-black underline">推奨の命名：</span>
                                                半角英小文字・数字・ハイフン(-)のみ使用可能です。
                                                <span className="block mt-1 text-amber-800">
                                                    例：<code className="bg-amber-100/80 px-1 rounded">osaka-「club名」</code>、<code className="bg-amber-100/80 px-1 rounded">tokyo-「club名」</code> のように、クラブ名のローマ字と地域をハイフンでつなげると分かりやすいです。
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    {form.formState.errors.slug && (
                                        <p className="text-red-500 text-[10px] mt-2 font-bold italic">{form.formState.errors.slug.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-3 items-start">
                                    <Info size={16} className="text-gray-400 mt-0.5" />
                                    <p className="text-[11px] text-gray-500 leading-relaxed">
                                        住所、電話番号、稽古スケジュールなどの詳細データは、クラブ作成後の「編集画面」からいつでも追加・変更できます。
                                    </p>
                                </div>
                                <div>
                                    <label className={labelClass}>クラブ紹介（簡潔に）</label>
                                    <textarea
                                        {...form.register("description")}
                                        rows={5}
                                        className={inputClass}
                                        placeholder="活動方針や歴史など..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: 图像设定 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <ImageUploader
                                label="クラブロゴ"
                                value={form.watch("logo")}
                                onChange={(url) => form.setValue("logo", url)}
                                bucket="images"
                            />
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <ImageUploader
                                label="メイン画像 (カバー)"
                                value={form.watch("mainImage")}
                                onChange={(url) => form.setValue("mainImage", url)}
                                bucket="images"
                            />
                        </div>
                    </div>
                </div>
            </AdminFormLayout>
        </form>
    );
}