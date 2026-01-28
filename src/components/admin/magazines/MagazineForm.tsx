"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
    Calendar, X, MapPin, ImageIcon, Plus,
    Info, Link as LinkIcon, FileText, Layout, UploadCloud, Loader2, Trash2
} from "lucide-react";
import { Magazine } from "@prisma/client";
import Image from "next/image";

import { useFormAction } from "@/hooks/useFormAction";
import AdminFormLayout from "@/components/admin/ui/AdminFormLayout";
import { createMagazine, updateMagazine, deleteMagazine } from "@/lib/actions/magazines";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

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
 * 表单校验规则
 */
const formSchema = z.object({
    title: z.string().min(1, "タイトルは必須です"),
    slug: z.string().min(1, "IDは必須です").regex(/^[a-z0-9-]+$/, "半角英数字とハイフンのみ"),
    region: z.string().min(1, "地域を選択してください"),
    issueDate: z.string().min(1, "発行日は必須です"),
    coverImage: z.string().optional(),
    pdfUrl: z.string().optional(),
    readLink: z.string().optional(),
    description: z.string().optional(),
    published: z.boolean(),
    images: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export default function MagazineForm({ initialData, isNew = false }: { initialData?: Magazine, isNew?: boolean }) {
    const [selectedRegionTab, setSelectedRegionTab] = useState<string>("関東");
    const [isUploading, setIsUploading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 1. 初始化表单
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

    // 2. 表单提交与删除逻辑
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

    // 响应式状态监听
    const currentImages = form.watch("images");
    const currentPrefecture = form.watch("region");
    const currentCover = form.watch("coverImage");

    /**
     * Supabase 文件上传核心逻辑
     */
    const uploadFile = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        // 使用时间戳+随机字符串防止文件名冲突
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const { data, error } = await supabase.storage.from('magazines').upload(fileName, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('magazines').getPublicUrl(fileName);
        return publicUrl;
    };

    /**
     * 封面上传处理 (react-dropzone)
     */
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
        noClick: !!currentCover // 已有封面时禁用点击，仅允许通过删除按钮清除
    });

    /**
     * 内面画廊拖拽排序处理 (@hello-pangea/dnd)
     */
    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;
        if (!destination || (destination.index === source.index)) return;

        const items = Array.from(currentImages);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        form.setValue("images", items, { shouldDirty: true });
    };

    /**
     * 内面画廊多图上传处理
     */
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

    // UI 样式类
    const labelClass = "text-[10px] font-black mb-2 uppercase tracking-[0.2em] text-gray-400 block";
    const inputClass = "w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white outline-none transition-all text-sm focus:ring-2 focus:ring-sumo-brand font-medium shadow-none";
    const cardClass = "bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all";

    return (
        <form onSubmit={form.handleSubmit((data) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'images' && Array.isArray(value)) {
                    value.forEach(img => formData.append("images", img));
                } else {
                    formData.append(key, typeof value === 'boolean' ? String(value) : String(value || ""));
                }
            });
            if (isNew) runAction(createMagazine, formData);
            else if (initialData) runAction((fd) => updateMagazine(initialData.id, fd), formData);
        })} className="pb-20">

            <AdminFormLayout
                title={isNew ? "広報誌登録" : "編集"}
                backLink="/admin/magazines"
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                onDelete={!isNew ? onDelete : undefined}
            >
                <div className="space-y-8">

                    {/* Section 1: 主标题 */}
                    <div className={cardClass}>
                        <div className="flex items-center gap-2 mb-6">
                            <Layout size={18} className="text-sumo-brand" />
                            <h2 className="text-xs font-black uppercase text-gray-900">Main Publication Title</h2>
                        </div>
                        <input
                            {...form.register("title")}
                            className="w-full px-0 py-2 bg-transparent border-b-2 border-gray-100 outline-none text-4xl font-serif font-black focus:border-sumo-brand transition-all shadow-none"
                            placeholder="タイトルを入力..."
                        />
                    </div>

                    {/* Section 2: 封面与核心信息 (高度对齐) */}
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
                                                onClick={() => form.setValue("coverImage", "")}
                                                className="bg-white/90 backdrop-blur text-red-500 p-2.5 rounded-full hover:bg-red-50 shadow-lg border border-red-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-sumo-brand text-center px-4">
                                        {isUploading ? <Loader2 className="animate-spin text-sumo-brand" /> : <UploadCloud size={32} strokeWidth={1.5} />}
                                        <p className="text-[10px] font-black uppercase">表紙アップロード</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={cn("lg:w-2/3 flex flex-col justify-between py-10", cardClass)}>
                            <div className="space-y-10">
                                <div>
                                    <label className={labelClass}>管理ID (Slug)</label>
                                    <input {...form.register("slug")} className={inputClass} placeholder="vol-15" />
                                    <p className="text-[9px] text-gray-400 mt-3 px-1 flex items-center gap-1">
                                        <Info size={10} /> URLの一部として使用されます。
                                    </p>
                                </div>
                                <div>
                                    <label className={labelClass}>発行日</label>
                                    <div className="relative group">
                                        <input
                                            type="date"
                                            {...form.register("issueDate")}
                                            onClick={(e) => {
                                                const input = e.currentTarget;
                                                if (typeof input.showPicker === 'function') {
                                                    try { input.showPicker(); } catch (err) { }
                                                }
                                            }}
                                            className={cn(inputClass, "relative z-10 cursor-pointer select-none bg-transparent pr-12 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0")}
                                        />
                                        <Calendar size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none z-0 group-focus-within:text-sumo-brand" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: 地区选择 */}
                    <div className={cardClass}>
                        <div className="flex items-center justify-between border-b border-gray-50 pb-6 mb-8">
                            <div className="flex items-center gap-3"><MapPin size={18} className="text-sumo-brand" /><h2 className="text-sm font-black uppercase text-gray-900">発行地域設定</h2></div>
                            <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black transition-all", currentPrefecture ? "bg-sumo-brand text-white shadow-md shadow-sumo-brand/20" : "bg-gray-50 text-gray-300")}>
                                {currentPrefecture ? `現在選択：${currentPrefecture}` : "未選択"}
                            </div>
                        </div>
                        <div className="space-y-10">
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(JAPAN_REGIONS).map(r => (
                                    <button key={r} type="button" onClick={() => setSelectedRegionTab(r)} className={cn("px-6 py-2.5 rounded-full text-[11px] font-black transition-all border", selectedRegionTab === r ? "bg-sumo-brand border-sumo-brand text-white shadow-md" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200")}>{r}</button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {JAPAN_REGIONS[selectedRegionTab as keyof typeof JAPAN_REGIONS].map(p => (
                                    <button key={p} type="button" onClick={() => form.setValue("region", p, { shouldDirty: true })} className={cn("px-3 py-2.5 rounded-full text-[10px] font-black border transition-all", currentPrefecture === p ? "bg-sumo-brand border-sumo-brand text-white shadow-md" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200")}>{p}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section 4: 内面画廊 (全卡片拖拽排序) */}
                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
                            <ImageIcon size={18} className="text-sumo-brand" />
                            <h2 className="text-sm font-black uppercase text-gray-900">内面ギャラリー ({currentImages.length})</h2>
                        </div>

                        <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 min-h-[200px]">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="gallery-list" direction="horizontal">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex flex-wrap gap-6"
                                        >
                                            {currentImages.map((url, idx) => (
                                                <Draggable key={`img-${url}-${idx}`} draggableId={`img-${url}-${idx}`} index={idx}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={cn(
                                                                "group relative aspect-[3/4] w-[140px] sm:w-[160px] bg-white rounded-2xl overflow-hidden shadow-sm transition-all border-4 border-white cursor-grab active:cursor-grabbing",
                                                                snapshot.isDragging && "shadow-2xl scale-105 z-[100] border-sumo-brand"
                                                            )}
                                                        >
                                                            <Image src={url} alt={`page-${idx}`} fill className="object-cover pointer-events-none" />

                                                            {/* 右上角删除按钮 (阻止冒泡防止触发拖拽) */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeImage(idx);
                                                                }}
                                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-[110] shadow-lg"
                                                            >
                                                                <X size={14} />
                                                            </button>

                                                            <div className="absolute bottom-2 left-2 bg-white/95 px-2 py-0.5 rounded shadow-sm text-[9px] font-black text-sumo-brand tracking-tighter">PAGE {idx + 1}</div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}

                                            {/* 追加上传入口 */}
                                            <div
                                                {...getGalleryProps()}
                                                className={cn(
                                                    "relative aspect-[3/4] w-[140px] sm:w-[160px] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group",
                                                    isGalleryActive ? "border-sumo-brand bg-sumo-brand/5" : "border-gray-200 bg-white hover:border-sumo-brand"
                                                )}
                                            >
                                                <input {...getGalleryInputProps()} />
                                                <div className="flex flex-col items-center gap-2 text-gray-300 group-hover:text-sumo-brand transition-colors text-center p-4">
                                                    {isUploading ? <Loader2 className="animate-spin text-sumo-brand" /> : <Plus size={24} />}
                                                    <span className="text-[9px] font-black uppercase leading-tight text-gray-400">ドラッグ＆ドロップで<br />ページを追加</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </div>

                    {/* Section 5: 附属资产与描述 */}
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