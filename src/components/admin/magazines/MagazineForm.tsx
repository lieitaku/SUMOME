"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    rectSortingStrategy, useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Calendar, X, MapPin, ImageIcon, Plus, Info,
    Link as LinkIcon, FileText, Layout, UploadCloud, Loader2, Trash2, AlertCircle, Eye
} from "lucide-react";
import { Magazine } from "@prisma/client";
import Image from "next/image";

import { useFormAction } from "@/hooks/useFormAction";
import AdminFormLayout from "@/components/admin/ui/AdminFormLayout";
import PreviewModal from "@/components/admin/ui/PreviewModal";
import { createMagazine, updateMagazine, deleteMagazine } from "@/lib/actions/magazines";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner"; // 确保安装了 sonner，如果没有请删除这行用 alert

/**
 * 日本地域定义数据
 */
const JAPAN_REGIONS = {
    "北海道・東北": ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
    "関東": ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
    "中部": ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
    "近畿": ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
    "中国": ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
    "四国": ["徳島県", "香川県", "愛媛県", "高知県"],
    "九州・沖縄": ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"]
};

/**
 * Zod 校验 Schema
 */
const formSchema = z.object({
    title: z.string().min(1, "タイトルを入力してください"), // 必填
    slug: z.string().min(1, "IDを入力してください").regex(/^[a-z0-9-]+$/, "半角英数字(小文字)とハイフンのみ使用可能です"),
    region: z.string().min(1, "都道府県を一つ選択してください"), // 必须选一个县
    issueDate: z.string().min(1, "発行日を選択してください"),
    coverImage: z.string().optional(),
    pdfUrl: z.string().optional(),
    readLink: z.string().optional(),
    description: z.string().optional(),
    published: z.boolean(),
    images: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

// 辅助组件：显示错误信息
const ErrorMsg = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
        <p className="flex items-center gap-1 text-[10px] text-red-500 font-bold mt-2 animate-pulse">
            <AlertCircle size={10} />
            {message}
        </p>
    );
};

/**
 * 排序子组件 (内面图片卡片)
 */
function SortableGalleryItem({ url, index, onRemove }: { url: string; index: number; onRemove: (i: number) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group relative aspect-[3/4] w-full bg-white rounded-2xl overflow-hidden shadow-sm transition-all border-4 border-white cursor-grab active:cursor-grabbing",
                isDragging && "shadow-2xl scale-105 z-[100] border-sumo-brand opacity-80"
            )}
        >
            <Image src={url} alt={`page-${index}`} fill className="object-cover pointer-events-none" />
            <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-[110] shadow-lg"
            >
                <X size={14} />
            </button>
            <div className="absolute bottom-2 left-2 bg-white/95 px-2 py-0.5 rounded shadow-sm text-[9px] font-black text-sumo-brand">PAGE {index + 1}</div>
        </div>
    );
}

/**
 * 主表单组件
 */
export default function MagazineForm({ initialData, isNew = false }: { initialData?: Magazine, isNew?: boolean }) {
    const [selectedRegionTab, setSelectedRegionTab] = useState<string>("関東");
    const [isUploading, setIsUploading] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            region: initialData?.region || "",
            issueDate: initialData?.issueDate ? new Date(initialData.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            coverImage: initialData?.coverImage || "",
            pdfUrl: initialData?.pdfUrl || "",
            readLink: initialData?.readLink || "",
            description: initialData?.description || "",
            published: initialData?.published ?? true,
            images: initialData?.images || [],
        },
    });

    // 获取错误对象
    const { errors } = form.formState;

    const { isSubmitting, handleSubmit: runAction } = useFormAction({
        successMessage: isNew ? "登録しました" : "保存しました",
        redirectUrl: "/admin/magazines"
    });

    const { isSubmitting: isDeleting, handleSubmit: handleDeleteAction } = useFormAction({
        successMessage: "広報誌を削除しました",
        redirectUrl: "/admin/magazines"
    });

    const onDelete = async () => {
        if (!initialData) return;
        if (!confirm("本当にこの広報誌を削除しますか？\nこの操作は取り消せません。")) return;
        await handleDeleteAction(deleteMagazine, initialData.id);
    };

    const currentImages = form.watch("images");
    const currentPrefecture = form.watch("region");
    const currentCover = form.watch("coverImage");

    // Supabase 上传逻辑
    const uploadFile = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const { data, error } = await supabase.storage.from('magazines').upload(fileName, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('magazines').getPublicUrl(fileName);
        return publicUrl;
    };

    // 封面上传
    const onDropCover = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setIsUploading(true);
        try {
            const url = await uploadFile(acceptedFiles[0]);
            form.setValue("coverImage", url, { shouldDirty: true });
        } catch (error) {
            alert("アップロードに失敗しました");
        } finally {
            setIsUploading(false);
        }
    }, [form]);

    const { getRootProps: getCoverProps, getInputProps: getCoverInputProps, isDragActive: isCoverActive } = useDropzone({
        onDrop: onDropCover,
        accept: { 'image/*': [] },
        multiple: false,
        noClick: !!currentCover
    });

    // 拖拽排序
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = currentImages.indexOf(active.id as string);
            const newIndex = currentImages.indexOf(over.id as string);
            form.setValue("images", arrayMove(currentImages, oldIndex, newIndex), { shouldDirty: true });
        }
    };

    // 画廊上传
    const onDropGallery = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setIsUploading(true);
        try {
            const urls = await Promise.all(acceptedFiles.map(file => uploadFile(file)));
            form.setValue("images", [...currentImages, ...urls], { shouldDirty: true });
        } catch (error) {
            alert("アップロードに失敗しました");
        } finally {
            setIsUploading(false);
        }
    }, [form, currentImages]);

    const { getRootProps: getGalleryProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryActive } = useDropzone({
        onDrop: onDropGallery,
        accept: { 'image/*': [] }
    });

    const removeImage = (index: number) => {
        form.setValue("images", currentImages.filter((_, i) => i !== index), { shouldDirty: true });
    };

    const labelClass = "text-[10px] font-black mb-2 uppercase tracking-[0.2em] text-gray-400 block";
    const inputClass = "w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white outline-none transition-all text-sm focus:ring-2 focus:ring-sumo-brand font-medium shadow-none";
    const errorInputClass = "border-red-300 bg-red-50 focus:ring-red-200"; // 错误时的样式
    const cardClass = "bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all";

    return (
        <form
            onSubmit={form.handleSubmit(
                // ✅ 成功回调
                (data) => {
                    const formData = new FormData();
                    formData.append("title", data.title);
                    formData.append("slug", data.slug);
                    formData.append("region", data.region);
                    formData.append("pdfUrl", data.pdfUrl || "");
                    formData.append("readLink", data.readLink || "");
                    formData.append("description", data.description || "");
                    formData.append("published", String(data.published));
                    if (data.coverImage) formData.append("coverImage", data.coverImage);

                    if (data.issueDate) {
                        const isoDate = new Date(data.issueDate).toISOString();
                        formData.append("issueDate", isoDate);
                    }

                    if (data.images && data.images.length > 0) {
                        data.images.forEach(img => formData.append("images", img));
                    }

                    if (isNew) runAction(createMagazine, formData);
                    else if (initialData) runAction((fd) => updateMagazine(initialData.id, fd), formData);
                },
                // ❌ 失败回调：打印并弹窗提示
                (errors) => {
                    console.error("❌ VALIDATION FAILED:", errors);
                    toast.error("入力内容に不備があります。赤字の項目を確認してください。");
                }
            )}
            className="pb-20"
        >

            <AdminFormLayout
                title={isNew ? "広報誌登録" : "編集"}
                backLink="/admin/magazines"
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                onDelete={!isNew ? onDelete : undefined}
                headerActions={
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
                                            type: "magazine",
                                            redirectPath: `/magazines/${slug}`,
                                            payload: { ...values, id: initialData?.id ?? "" },
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
                }
            >
                <PreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} title="広報誌 プレビュー" />
                <div className="space-y-8">

                    {/* Section 1: 标题 (必填) */}
                    <div className={cn(cardClass, errors.title && "border-red-200 bg-red-50/30")}>
                        <div className="flex items-center gap-2 mb-6">
                            <Layout size={18} className={cn("text-sumo-brand", errors.title && "text-red-500")} />
                            <h2 className="text-xs font-black uppercase text-gray-900">Publication Title <span className="text-red-500">*</span></h2>
                        </div>
                        <input
                            {...form.register("title")}
                            className={cn(
                                "w-full px-0 py-2 bg-transparent border-b-2 outline-none text-4xl font-serif font-black transition-all shadow-none",
                                errors.title ? "border-red-300 placeholder:text-red-300" : "border-gray-100 focus:border-sumo-brand"
                            )}
                            placeholder="タイトルを入力..."
                        />
                        <ErrorMsg message={errors.title?.message} />
                    </div>

                    {/* Section 2: 封面图与信息 */}
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                        <div className={cn("lg:w-1/3 flex flex-col", cardClass)}>
                            <label className={labelClass}>表紙カバー (3:4)</label>
                            <div
                                {...getCoverProps()}
                                className={cn(
                                    "relative flex-grow aspect-[3/4] w-full rounded-[1.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden group",
                                    isCoverActive ? "border-sumo-brand bg-sumo-brand/5" : "border-gray-200 bg-gray-50",
                                    !currentCover && "cursor-pointer hover:border-sumo-brand"
                                )}
                            >
                                <input {...getCoverInputProps()} />
                                {currentCover ? (
                                    <div className="relative w-full h-full">
                                        <Image src={currentCover} alt="Cover" fill className="object-cover" />
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => form.setValue("coverImage", "", { shouldDirty: true })}
                                                className="bg-white/90 backdrop-blur text-red-500 p-2.5 rounded-full hover:bg-red-50 shadow-lg border border-red-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-sumo-brand text-center px-4">
                                        {isUploading ? <Loader2 className="animate-spin text-sumo-brand" /> : <UploadCloud size={32} strokeWidth={1.5} />}
                                        <p className="text-[10px] font-black uppercase tracking-widest">表紙アップロード</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={cn("lg:w-2/3 flex flex-col justify-between py-10", cardClass)}>
                            <div className="space-y-10">
                                {/* SLUG (必填) */}
                                <div>
                                    <label className={labelClass}>管理ID (Slug) <span className="text-red-500">*</span></label>
                                    <input
                                        {...form.register("slug")}
                                        className={cn(inputClass, errors.slug && errorInputClass)}
                                        placeholder="vol-15"
                                    />
                                    <ErrorMsg message={errors.slug?.message} />
                                    <p className="text-[9px] text-gray-400 mt-3 flex items-center gap-1 px-1">
                                        <Info size={10} /> 半角英数字(小文字)とハイフンのみ。例: vol-12
                                    </p>
                                </div>
                                {/* 发行日 (必填) */}
                                <div>
                                    <label className={labelClass}>発行日 <span className="text-red-500">*</span></label>
                                    <div className="relative group overflow-hidden rounded-2xl">
                                        <input
                                            type="date"
                                            {...form.register("issueDate")}
                                            onClick={(e) => {
                                                const input = e.currentTarget;
                                                if (typeof input.showPicker === 'function') {
                                                    try { input.showPicker(); } catch (err) { }
                                                }
                                            }}
                                            className={cn(
                                                inputClass,
                                                "relative z-10 cursor-pointer select-none bg-transparent pr-12 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0",
                                                errors.issueDate && errorInputClass
                                            )}
                                        />
                                        <Calendar size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none z-0 group-focus-within:text-sumo-brand transition-colors" />
                                    </div>
                                    <ErrorMsg message={errors.issueDate?.message} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: 地区设定 (必填) */}
                    <div className={cn(cardClass, errors.region && "border-red-200 bg-red-50/30")}>
                        <div className="flex items-center justify-between border-b border-gray-50 pb-6 mb-8">
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className={cn("text-sumo-brand", errors.region && "text-red-500")} />
                                <h2 className="text-sm font-black uppercase text-gray-900">発行地域設定 <span className="text-red-500">*</span></h2>
                            </div>
                            <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black transition-all", currentPrefecture ? "bg-sumo-brand text-white shadow-md shadow-sumo-brand/20" : "bg-gray-200 text-gray-500")}>
                                {currentPrefecture ? `現在選択：${currentPrefecture}` : "未選択 (必須)"}
                            </div>
                        </div>

                        {/* 错误提示放在最上面醒目 */}
                        <ErrorMsg message={errors.region?.message} />

                        <div className="space-y-10 mt-4">
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(JAPAN_REGIONS).map(r => (
                                    <button key={r} type="button" onClick={() => setSelectedRegionTab(r)} className={cn("px-6 py-2.5 rounded-full text-[11px] font-black transition-all border", selectedRegionTab === r ? "bg-sumo-brand border-sumo-brand text-white shadow-md" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200")}>{r}</button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {JAPAN_REGIONS[selectedRegionTab as keyof typeof JAPAN_REGIONS].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => {
                                            form.setValue("region", p, { shouldValidate: true, shouldDirty: true });
                                            form.clearErrors("region"); // 点击后清除错误
                                        }}
                                        className={cn(
                                            "px-3 py-2.5 rounded-full text-[10px] font-black border transition-all",
                                            currentPrefecture === p
                                                ? "bg-sumo-brand border-sumo-brand text-white shadow-md"
                                                : "bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-sumo-brand"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section 4: 画廊 */}
                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
                            <ImageIcon size={18} className="text-sumo-brand" />
                            <h2 className="text-sm font-black uppercase text-gray-900">内面ギャラリー ({currentImages.length})</h2>
                        </div>

                        <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={currentImages} strategy={rectSortingStrategy}>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {currentImages.map((url, idx) => (
                                            <SortableGalleryItem key={url} url={url} index={idx} onRemove={removeImage} />
                                        ))}
                                        <div
                                            {...getGalleryProps()}
                                            className={cn(
                                                "relative aspect-[3/4] w-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group bg-white",
                                                isGalleryActive ? "border-sumo-brand bg-sumo-brand/5" : "border-gray-200 hover:border-sumo-brand"
                                            )}
                                        >
                                            <input {...getGalleryInputProps()} />
                                            <div className="flex flex-col items-center gap-2 text-gray-300 group-hover:text-sumo-brand transition-colors text-center p-4">
                                                {isUploading ? <Loader2 className="animate-spin text-sumo-brand" /> : <Plus size={24} />}
                                                <span className="text-[9px] font-black uppercase leading-tight text-gray-400">ドラッグ＆ドロップで<br />ページを追加</span>
                                            </div>
                                        </div>
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>

                    {/* Section 5: 数字资产与描述 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        <div className={cn(cardClass, "flex flex-col")}>
                            <div className="flex items-center gap-3 mb-8"><LinkIcon size={18} className="text-sumo-brand" /><h2 className="text-sm font-black uppercase text-gray-900">Digital Assets</h2></div>
                            <div className="space-y-6 flex-grow">
                                <div><label className={labelClass}>PDF Download URL</label><input {...form.register("pdfUrl")} className={inputClass} /></div>
                                <div><label className={labelClass}>Reader Link</label><input {...form.register("readLink")} className={inputClass} /></div>
                            </div>
                        </div>

                        <div className={cn(cardClass, "flex flex-col")}>
                            <div className="flex items-center gap-3 mb-8"><FileText size={18} className="text-sumo-brand" /><h2 className="text-sm font-black uppercase text-gray-900">Description</h2></div>
                            <textarea
                                {...form.register("description")}
                                className={cn(inputClass, "resize-none min-h-[140px] flex-grow")}
                                placeholder="誌面の紹介を入力..."
                            />
                        </div>
                    </div>
                </div>
            </AdminFormLayout>
        </form>
    );
}