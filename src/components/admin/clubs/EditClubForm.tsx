"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageIcon, MapPin, Info, Phone } from "lucide-react";
import { Club } from "@prisma/client";

// ✨ 1. 引入我们的“三剑客”
import ImageUploader from "@/components/admin/ui/ImageUploader";
import { useFormAction } from "@/hooks/useFormAction";
import AdminFormLayout from "@/components/admin/ui/AdminFormLayout";

// ✨ 2. 引入 Server Actions
import { updateClub, deleteClub } from "@/lib/actions/clubs";

// --- Zod Schema (保持不变) ---
const formSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "必須項目です"),
    slug: z.string().min(3, "3文字以上"),
    description: z.string().optional(),
    logo: z.string().optional(),
    mainImage: z.string().optional(),
    zipCode: z.string().optional(),
    area: z.string().min(1, "必須項目です"),
    city: z.string().optional(),
    address: z.string().min(1, "必須項目です"),
    mapUrl: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    schedule: z.string().optional(),
    target: z.string().optional(),
    representative: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditClubFormProps {
    initialData: Club;
}

export default function EditClubForm({ initialData }: EditClubFormProps) {

    // 1. 初始化表单
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: initialData.id,
            name: initialData.name || "",
            slug: initialData.slug || "",
            description: initialData.description || "",
            logo: initialData.logo || "",
            mainImage: initialData.mainImage || "",
            zipCode: initialData.zipCode || "",
            area: initialData.area || "未設定",
            city: initialData.city || "",
            address: initialData.address || "",
            mapUrl: initialData.mapUrl || "",
            phone: initialData.phone || "",
            website: initialData.website || "",
            instagram: initialData.instagram || "",
            twitter: initialData.twitter || "",
            schedule: initialData.schedule || "",
            target: initialData.target || "",
            representative: initialData.representative || "",
        },
    });

    // ✨ 2. 使用通用 Hook 处理保存逻辑
    // 这一行代码自动搞定：Loading状态、Success Toast、Error Toast、跳转、刷新
    const { isSubmitting, handleSubmit } = useFormAction({
        successMessage: "クラブ情報を保存しました",
        redirectUrl: "/admin/clubs"
    });

    // ✨ 3. 使用通用 Hook 处理删除逻辑
    const { isSubmitting: isDeleting, handleSubmit: handleDeleteAction } = useFormAction({
        successMessage: "クラブを削除しました",
        redirectUrl: "/admin/clubs"
    });

    // 包装保存函数
    const onSubmit = (data: FormValues) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.append(key, value || ""));
        handleSubmit(updateClub, formData);
    };

    // 包装删除函数
    const onDelete = async () => {
        if (!confirm("本当にこのクラブを削除しますか？\nこの操作は取り消せません。")) return;
        // 直接传入 deleteClub action 和参数 ID
        await handleDeleteAction(deleteClub, initialData.id);
    };

    // 辅助样式类
    const sectionHeading = "text-lg font-bold flex items-center gap-2 pb-3 border-b border-gray-100 mb-6 text-gray-800";
    const labelClass = "block text-xs font-bold mb-1.5 uppercase tracking-wide text-gray-400";
    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all text-sm focus:ring-2 focus:ring-sumo-brand focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400";

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* ✨ 4. 使用通用布局外壳 */}
            <AdminFormLayout
                title="クラブ編集"
                subTitle={initialData.name}
                backLink="/admin/clubs"
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                onDelete={onDelete} // 传入这个，底部就会自动显示红色的删除按钮
            >

                {/* Section 1: 基本情報 */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className={sectionHeading}>
                        <ImageIcon size={20} className="text-sumo-brand" /> 基本情報
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className={labelClass}>クラブ名 <span className="text-red-500">*</span></label>
                                <input {...form.register("name")} className={inputClass} placeholder="例：大阪相撲クラブ" />
                                {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>クラブID (変更不可)</label>
                                <input {...form.register("slug")} disabled className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>紹介文</label>
                                <textarea {...form.register("description")} rows={6} className={inputClass} placeholder="クラブの歴史や特徴など..." />
                            </div>
                        </div>
                        <div className="space-y-6">
                            {/* ✨ 使用新版 ImageUploader (支持拖拽) */}
                            <ImageUploader
                                label="クラブロゴ"
                                value={form.watch("logo")}
                                onChange={(url) => form.setValue("logo", url)}
                                bucket="images"
                            />
                            <ImageUploader
                                label="メイン画像 (カバー)"
                                value={form.watch("mainImage")}
                                onChange={(url) => form.setValue("mainImage", url)}
                                bucket="images"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: 所在地 */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className={sectionHeading}>
                        <MapPin size={20} className="text-sumo-brand" /> 所在地情報
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelClass}>郵便番号</label>
                            <input {...form.register("zipCode")} className={inputClass} placeholder="000-0000" />
                        </div>
                        <div>
                            <label className={labelClass}>都道府県 <span className="text-red-500">*</span></label>
                            <select {...form.register("area")} className={inputClass}>
                                <option value="未設定">選択してください</option>
                                <option value="東京都">東京都</option>
                                <option value="大阪府">大阪府</option>
                                <option value="愛知県">愛知県</option>
                                <option value="北海道">北海道</option>
                                <option value="福岡県">福岡県</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>市区町村</label>
                            <input {...form.register("city")} className={inputClass} placeholder="市区町村" />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>番地・建物名 <span className="text-red-500">*</span></label>
                            <input {...form.register("address")} className={inputClass} placeholder="番地・ビル名" />
                        </div>
                        <div>
                            <label className={labelClass}>Google Map URL</label>
                            <input {...form.register("mapUrl")} className={inputClass} placeholder="https://goo.gl/maps/..." />
                        </div>
                    </div>
                </div>

                {/* Section 3: 運営・連絡先 */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h2 className={sectionHeading}>
                        <Info size={20} className="text-sumo-brand" /> 運営・連絡先
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>稽古スケジュール</label>
                            <input {...form.register("schedule")} className={inputClass} placeholder="毎週 月・水・金" />
                        </div>
                        <div>
                            <label className={labelClass}>募集対象</label>
                            <input {...form.register("target")} className={inputClass} placeholder="小学生 〜 大人" />
                        </div>
                        <div>
                            <label className={labelClass}>代表者名</label>
                            <input {...form.register("representative")} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}><Phone size={12} className="inline mr-1" />電話番号</label>
                            <input {...form.register("phone")} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Webサイト</label>
                            <input {...form.register("website")} className={inputClass} placeholder="https://..." />
                        </div>
                        <div>
                            <label className={labelClass}>SNS (Instagram / X)</label>
                            <div className="space-y-2">
                                <input {...form.register("instagram")} className={inputClass} placeholder="Instagram ID" />
                                <input {...form.register("twitter")} className={inputClass} placeholder="X (Twitter) ID" />
                            </div>
                        </div>
                    </div>
                </div>

            </AdminFormLayout>
        </form>
    );
}