"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageIcon, MapPin, Info, Phone, Mail, UploadCloud, X, Loader2, Eye } from "lucide-react";
import { Club } from "@prisma/client";
import { useState, useCallback } from "react";

// 日本郵便番号API（zipcloud）レスポンス型
const ZIPCLOUD_API = "https://zipcloud.ibsnet.co.jp/api/search";
type ZipCloudResult = { address1: string; address2: string; address3: string };
type ZipCloudResponse = { status: number; results: ZipCloudResult[] | null; message: string | null };
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { REGIONS } from "@/lib/constants"

// ✨ 1. 引入 UI 组件和 Hooks
import ImageUploader from "@/components/admin/ui/ImageUploader";
import { useFormAction } from "@/hooks/useFormAction";
import AdminFormLayout from "@/components/admin/ui/AdminFormLayout";
import PreviewModal from "@/components/admin/ui/PreviewModal";
import ScheduleEditor from "./ScheduleEditor"; // <--- 引入日程编辑器组件
import TargetEditor from "./TargetEditor"; // <--- 引入募集对象编辑器
import MainImagePositionEditor, { parsePositionString, formatPositionString, parseScaleValue, parseRotationValue } from "./MainImagePositionEditor";

// ✨ 2. 引入 Server Actions
import { updateClub, deleteClub, toggleClubHidden } from "@/lib/actions/clubs";
import { useRouter } from "@/i18n/navigation";

// ==============================================================================
// 📜 Zod Schema 定义
// ------------------------------------------------------------------------------
// 这里定义了表单的数据结构和验证规则。
// 特别注意 subImages 的 refine 规则：必须是 0, 2, 4 张。
// ==============================================================================
const formSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "必須項目です"),
    nameEn: z.string().optional(),
    slug: z.string()
        .min(3, "3文字以上")
        .regex(/^[a-z0-9-]+$/, "半角英小文字・数字・ハイフンのみ使用可能です"),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    logo: z.string().optional(),
    mainImage: z.string().optional(),
    mainImagePosition: z.string().optional(),
    mainImageScale: z.string().optional(),
    mainImageRotation: z.string().optional(),

    // ✨ 副图验证规则
    subImages: z.array(z.string())
        .refine((files) => {
            const len = files.length;
            // 规则：0张 (不传)，或者 2张，或者 4张。不能是单数。
            return len === 0 || len === 2 || len === 4;
        }, { message: "サブ画像は「2枚」または「4枚」で登録してください（奇数は不可）。" }),

    zipCode: z.string().optional(),
    area: z.string().min(1, "必須項目です"),
    city: z.string().optional(),
    address: z.string().optional(),
    mapUrl: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(), // ✨ 新增邮箱
    website: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    tiktok: z.string().optional(),
    facebook: z.string().optional(),
    schedule: z.string().optional(), // 存的是 JSON 字符串
    target: z.string().optional(),
    representative: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditClubFormProps {
    initialData: Club;
    /** 管理者(ADMIN)のみ true。クラブID(slug)の編集可否に使用 */
    canEditSlug?: boolean;
}

export default function EditClubForm({ initialData, canEditSlug = false }: EditClubFormProps) {
    const router = useRouter();
    // 用于控制副图上传时的 Loading 状态
    const [isUploadingSub, setIsUploadingSub] = useState(false);
    // 郵便番号から住所を取得中かどうか
    const [zipLookupLoading, setZipLookupLoading] = useState(false);
    // プレビュー送信中 / プレビュー用 URL（設定時はモーダル表示）
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // --- 1. 初始化 React Hook Form ---
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: initialData.id,
            name: initialData.name || "",
            nameEn: initialData.nameEn || "",
            slug: initialData.slug || "",
            description: initialData.description || "",
            descriptionEn: initialData.descriptionEn || "",
            logo: initialData.logo || "",
            mainImage: initialData.mainImage || "",
            mainImagePosition: initialData.mainImagePosition ?? "50,50",
            mainImageScale: initialData.mainImageScale != null ? String(initialData.mainImageScale) : "1",
            mainImageRotation: initialData.mainImageRotation != null ? String(initialData.mainImageRotation) : "0",
            subImages: initialData.subImages || [],
            zipCode: initialData.zipCode || "",
            area: initialData.area || "未設定",
            city: initialData.city || "",
            address: initialData.address || "",
            mapUrl: initialData.mapUrl || "",
            phone: initialData.phone || "",
            email: initialData.email || "",
            website: initialData.website || "",
            instagram: initialData.instagram || "",
            twitter: initialData.twitter || "",
            tiktok: (initialData as Club & { tiktok?: string }).tiktok || "",
            facebook: (initialData as Club & { facebook?: string }).facebook || "",
            schedule: initialData.schedule || "",
            target: initialData.target || "",
            representative: initialData.representative || "",
        },
    });

    // --- 2. 配置提交与删除逻辑 (使用自定义 Hook) ---
    const { isSubmitting, handleSubmit } = useFormAction({
        successMessage: "クラブ情報を保存しました",
        redirectUrl: "/admin/clubs"
    });

    const { isSubmitting: isDeleting, handleSubmit: handleDeleteAction } = useFormAction({
        successMessage: "クラブを削除しました",
        redirectUrl: "/admin/clubs"
    });

    const [isTogglingHidden, setIsTogglingHidden] = useState(false);

    // --- 3. 多图上传逻辑 (Supabase) ---
    const currentSubImages = form.watch("subImages");

    const onDropSubImages = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        // 检查数量限制 (已有 + 新增 <= 4)
        if (currentSubImages.length + acceptedFiles.length > 4) {
            alert("サブ画像は最大4枚までです。");
            return;
        }

        setIsUploadingSub(true);
        try {
            // 并发上传多张图片 (使用 API 路由进行 WebP 转换)
            const uploadedUrls = await Promise.all(acceptedFiles.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("bucket", "images");

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "アップロードに失敗しました");
                }

                const { url } = await response.json();
                return url;
            }));

            // 更新表单状态 (追加新图片)
            form.setValue("subImages", [...currentSubImages, ...uploadedUrls], { shouldValidate: true, shouldDirty: true });
        } catch (error) {
            console.error(error);
            alert("画像のアップロードに失敗しました");
        } finally {
            setIsUploadingSub(false);
        }
    }, [currentSubImages, form]);

    // Dropzone 配置
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onDropSubImages,
        accept: { 'image/*': [] },
        disabled: currentSubImages.length >= 4 // 满了就禁用
    });

    // 删除副图
    const removeSubImage = (index: number) => {
        const newImages = currentSubImages.filter((_, i) => i !== index);
        form.setValue("subImages", newImages, { shouldValidate: true, shouldDirty: true });
    };

    // 郵便番号から都道府県・市区町村を自動入力（zipcloud API）
    const fetchAddressByZipCode = useCallback(async () => {
        const raw = form.getValues("zipCode")?.replace(/\s/g, "") ?? "";
        const zipOnly = raw.replace(/-/g, "");
        if (zipOnly.length !== 7 || !/^\d+$/.test(zipOnly)) return;

        setZipLookupLoading(true);
        try {
            const res = await fetch(`${ZIPCLOUD_API}?zipcode=${zipOnly}`);
            const data: ZipCloudResponse = await res.json();
            if (data.status === 200 && data.results?.[0]) {
                const r = data.results[0];
                form.setValue("area", r.address1, { shouldValidate: true, shouldDirty: true });
                form.setValue("city", r.address2, { shouldValidate: true, shouldDirty: true });
                // 町域が1件だけの場合は番地欄に補完（複数ある場合はユーザーが選択するため未入力のまま）
                if (data.results.length === 1 && r.address3) {
                    const currentAddress = form.getValues("address");
                    if (!currentAddress?.trim()) {
                        form.setValue("address", r.address3, { shouldValidate: true, shouldDirty: true });
                    }
                }
            }
        } catch {
            // ネットワークエラー等は静かに無視（入力はそのまま）
        } finally {
            setZipLookupLoading(false);
        }
    }, [form]);

    // --- 4. 提交处理 ---
    const onSubmit = (data: FormValues) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            // TypeScript 在这里会理解：如果进了这个 if，它是数组；否则它是字符串。
            if (Array.isArray(value)) {
                // 如果是数组 (如 subImages)，遍历添加
                value.forEach((v) => formData.append(key, v));
            } else {
                // 如果不是数组，当作普通字符串处理
                // value 可能是 null 或 undefined，所以加 || ""
                formData.append(key, value || "");
            }
        });

        handleSubmit(updateClub, formData);
    };

    // --- 5. 删除处理 ---
    const onDelete = async () => {
        if (!confirm("本当にこのクラブを削除しますか？\nこの操作は取り消せません。")) return;
        await handleDeleteAction(deleteClub, initialData.id);
    };

    // --- 5-2. 非表示 切り替え处理 ---
    const onToggleHidden = async () => {
        const confirmMessage = initialData.hidden
            ? "このクラブを「表示中」に戻しますか？"
            : "このクラブを「非表示」にしますか？\n前台からは表示・検索されなくなります。";
        if (!confirm(confirmMessage)) return;

        setIsTogglingHidden(true);
        try {
            const result = await toggleClubHidden(initialData.id);
            if ((result as any)?.error) {
                alert((result as any).error);
            } else {
                // 状態変更が反映されるように再読み込み
                router.refresh();
            }
        } catch (e) {
            console.error(e);
            alert("非表示ステータスの更新に失敗しました。");
        } finally {
            setIsTogglingHidden(false);
        }
    };

    // --- 6. 样式常量 ---
    const sectionHeading = "text-lg font-bold flex items-center gap-2 pb-3 border-b border-gray-100 mb-6 text-gray-800";
    const labelClass = "block text-xs font-bold mb-1.5 uppercase tracking-wide text-gray-400";
    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all text-sm focus:ring-2 focus:ring-sumo-brand focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400";

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <AdminFormLayout
                title="クラブ編集"
                subTitle={initialData.name}
                backLink="/admin/clubs"
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                onToggleHidden={onToggleHidden}
                isHidden={initialData.hidden ?? false}
                isTogglingHidden={isTogglingHidden}
                onDelete={onDelete}
                headerActions={
                    <div className="flex items-center gap-2">
                        {/* ✨ 審査待ちステータスの表示 */}
                        {!canEditSlug && initialData.hidden && (
                            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-xs font-bold">
                                <Info size={14} />
                                <span>公開承認待ち</span>
                            </div>
                        )}
                        <button
                            type="button"
                            disabled={isPreviewing}
                        onClick={async () => {
                            setIsPreviewing(true);
                            try {
                                const values = form.getValues();
                                const slug = values.slug?.trim() || "preview";
                                const res = await fetch("/admin/api/preview", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        type: "club",
                                        redirectPath: `/clubs/${slug}`,
                                        payload: values,
                                    }),
                                });
                                const data = await res.json();
                                if (data.redirectUrl) {
                                    setPreviewUrl(data.bridgeUrl ?? data.redirectUrl);
                                    return;
                                }
                                if (data.error) alert(data.error);
                            } finally {
                                setIsPreviewing(false);
                            }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {isPreviewing ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                        プレビュー
                    </button>
                    </div>
                }
            >
                <PreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} title="クラブ プレビュー" />
                {/* --- Section 1: 基本情報 & 画像 --- */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className={sectionHeading}>
                        <ImageIcon size={20} className="text-sumo-brand" /> 基本情報 & 画像
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className={labelClass}>クラブ名 <span className="text-red-500">*</span></label>
                                <input {...form.register("name")} className={inputClass} />
                                {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>
                                    クラブID (URL用)
                                    {canEditSlug ? (
                                        <span className="text-gray-400 font-normal ml-1">— 管理者のみ変更可</span>
                                    ) : (
                                        <span className="text-gray-400 font-normal ml-1">— 変更不可</span>
                                    )}
                                </label>
                                <input
                                    {...form.register("slug")}
                                    disabled={!canEditSlug}
                                    className={inputClass}
                                    placeholder={canEditSlug ? "例: osaka-sumo" : undefined}
                                />
                                {!canEditSlug && (
                                    <p className="text-[10px] text-gray-400 mt-1">IDの変更は管理者にお問い合わせください。</p>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>紹介文</label>
                                <textarea {...form.register("description")} rows={6} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>クラブ名（英語・任意）</label>
                                <input {...form.register("nameEn")} className={inputClass} placeholder="e.g. Osaka Sumo Club" />
                            </div>
                            <div>
                                <label className={labelClass}>紹介文（英語・任意）</label>
                                <textarea {...form.register("descriptionEn")} rows={4} className={inputClass} placeholder="English description for /en site" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* 单图上传区域 */}
                            <div className="grid grid-cols-2 gap-4">
                                <ImageUploader
                                    label="クラブロゴ"
                                    value={form.watch("logo")}
                                    onChange={(url) => form.setValue("logo", url)}
                                    bucket="images"
                                />
                                <ImageUploader
                                    label="メイン画像"
                                    value={form.watch("mainImage")}
                                    onChange={(url) => form.setValue("mainImage", url)}
                                    bucket="images"
                                />
                            </div>

                            {/* メイン画像：卡片预览与位置调整（仅在有图时显示） */}
                            {form.watch("mainImage") && (
                                <MainImagePositionEditor
                                    imageUrl={form.watch("mainImage")}
                                    position={parsePositionString(form.watch("mainImagePosition"))}
                                    scale={parseScaleValue(form.watch("mainImageScale"))}
                                    rotation={parseRotationValue(form.watch("mainImageRotation"))}
                                    onPositionChange={(x, y) => form.setValue("mainImagePosition", formatPositionString({ x, y }), { shouldDirty: true })}
                                    onScaleChange={(s) => form.setValue("mainImageScale", String(s), { shouldDirty: true })}
                                    onRotationChange={(deg) => form.setValue("mainImageRotation", String(deg), { shouldDirty: true })}
                                />
                            )}

                            {/* ✨ 多图上传区域 (Sub Images) */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className={labelClass}>サブ画像 (ギャラリー用)</label>
                                    {/* 数量提示：如果不是偶数，显示红色警告 */}
                                    <span className={`text-[10px] font-bold ${currentSubImages.length % 2 !== 0 ? "text-red-500" : "text-gray-400"}`}>
                                        {currentSubImages.length}枚 (2枚または4枚必須)
                                    </span>
                                </div>

                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {/* 渲染已上传的图片 */}
                                    {currentSubImages.map((url, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                            <Image src={url} alt="sub" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeSubImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* 上传按钮 (没满4张时显示) */}
                                    {currentSubImages.length < 4 && (
                                        <div
                                            {...getRootProps()}
                                            className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? "border-sumo-brand bg-blue-50" : "border-gray-200 hover:border-sumo-brand"
                                                }`}
                                        >
                                            <input {...getInputProps()} />
                                            {isUploadingSub ? <Loader2 className="animate-spin text-gray-400" size={16} /> : <UploadCloud className="text-gray-300" size={20} />}
                                        </div>
                                    )}
                                </div>
                                {/* 错误提示 */}
                                {form.formState.errors.subImages && (
                                    <p className="text-red-500 text-xs font-bold">{form.formState.errors.subImages.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Section 2: 所在地情報 --- */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className={sectionHeading}>
                        <MapPin size={20} className="text-sumo-brand" /> 所在地情報
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelClass}>郵便番号</label>
                            <div className="relative flex items-center gap-2">
                                <input
                                    {...form.register("zipCode")}
                                    className={inputClass}
                                    placeholder="000-0000"
                                    onBlur={fetchAddressByZipCode}
                                />
                                {zipLookupLoading && (
                                    <span className="absolute right-3 text-gray-400" aria-hidden>
                                        <Loader2 className="animate-spin" size={18} />
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">入力後、フォーカスを外すと都道府県・市区町村を自動で入れます</p>
                        </div>
                        <div>
                            <label className={labelClass}>都道府県 <span className="text-red-500">*</span></label>
                            <select {...form.register("area")} className={inputClass}>
                                <option value="未設定">選択してください</option>

                                {/* ✨ 核心修改：利用您的 REGIONS 对象自动生成分组列表 */}
                                {Object.entries(REGIONS).map(([regionName, prefectures]) => (
                                    <optgroup key={regionName} label={regionName}>
                                        {prefectures.map((pref) => (
                                            <option key={pref} value={pref}>
                                                {pref}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}

                                {/* 补充额外的选项 */}
                                <optgroup label="その他">
                                    <option value="海外">海外</option>
                                    <option value="その他">その他</option>
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>市区町村</label>
                            <input {...form.register("city")} className={inputClass} placeholder="市区町村" />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>番地・建物名</label>
                            <input {...form.register("address")} className={inputClass} placeholder="番地・ビル名" />
                        </div>
                        <div>
                            <label className={labelClass}>Google Map URL</label>
                            <input {...form.register("mapUrl")} className={inputClass} placeholder="https://goo.gl/maps/..." />
                        </div>
                    </div>
                </div>

                {/* --- Section 3: 運営・連絡先 --- */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h2 className={sectionHeading}>
                        <Info size={20} className="text-sumo-brand" /> 運営・連絡先
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>スケジュール</label>
                            {/* ✨ 日程编辑器：生成 JSON 供前端渲染 */}
                            <ScheduleEditor
                                value={form.watch("schedule") || ""}
                                onChange={(val) => form.setValue("schedule", val, { shouldDirty: true })}
                            />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className={labelClass}>募集対象</label>
                                <TargetEditor
                                    value={form.watch("target") || ""}
                                    onChange={(val) => form.setValue("target", val, { shouldDirty: true })}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>代表者名</label>
                                <input {...form.register("representative")} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>電話番号</label>
                                <input {...form.register("phone")} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>メールアドレス</label>
                                <input {...form.register("email")} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Webサイト</label>
                                <input {...form.register("website")} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>SNS リンク (IDのみ)</label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">IG</span>
                                        <input {...form.register("instagram")} className={`${inputClass} pl-10`} placeholder="instagram_id" />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">X</span>
                                        <input {...form.register("twitter")} className={`${inputClass} pl-10`} placeholder="twitter_id" />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">TT</span>
                                        <input {...form.register("tiktok")} className={`${inputClass} pl-10`} placeholder="tiktok_id" />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">FB</span>
                                        <input {...form.register("facebook")} className={`${inputClass} pl-10`} placeholder="facebook_id" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </AdminFormLayout>
        </form>
    );
}