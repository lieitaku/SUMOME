"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2, ImageIcon, Type, Heading, Calendar,
    LayoutTemplate, FileText, ExternalLink,
    ArrowUp, ArrowDown, Trash2, LucideIcon, Eye
} from "lucide-react";
import { useState } from "react";
import { Activity, Club } from "@prisma/client";

// ✨ 1. 引入我们的“三剑客”
import ImageUploader from "@/components/admin/ui/ImageUploader";
import { useFormAction } from "@/hooks/useFormAction";
import AdminFormLayout from "@/components/admin/ui/AdminFormLayout";
import PreviewModal from "@/components/admin/ui/PreviewModal";

// ✨ 2. 引入 Server Actions
import { updateActivityAction, createActivityAction, deleteActivityAction } from "@/lib/actions/activities";

// --- Schema 定义 (保持不变) ---
const BlockSchema = z.object({
    id: z.string(),
    type: z.enum(["text", "image", "subheading"]),
    value: z.string(),
});

type Block = z.infer<typeof BlockSchema>;

const EventMetaSchema = z.object({
    venue: z.string().optional(),
    fee: z.string().optional(),
    rsvpLink: z.string().optional(),
    description: z.string().optional(),
});

const formSchema = z.object({
    title: z.string().min(1, "タイトルを入力してください"),
    date: z.string(),
    clubId: z.string().min(1, "クラブを選択してください"),
    mainImage: z.string().optional(),
    customRoute: z.string().optional(),
    blocks: z.array(BlockSchema).optional(),
    event: EventMetaSchema.optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SavedContentData {
    blocks?: Block[];
    event?: { venue?: string; fee?: string; rsvpLink?: string; description?: string };
    news?: { body?: string };
}

// --- 组件主体 ---
export default function EditActivityForm({
    initialData,
    clubs,
    isNew = false
}: {
    initialData: Activity,
    clubs: Club[],
    isNew?: boolean
}) {
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const templateType = (initialData.templateType || "news") as "news" | "report" | "event" | "custom";
    const savedData = (initialData.contentData ? initialData.contentData : {}) as SavedContentData;

    // 初始化 Blocks
    let initialBlocks: Block[] = [];
    if (savedData.blocks && Array.isArray(savedData.blocks)) {
        initialBlocks = savedData.blocks;
    } else if (savedData.news?.body) {
        initialBlocks = [{ id: crypto.randomUUID(), type: "text", value: savedData.news.body }];
    } else {
        initialBlocks = [{ id: crypto.randomUUID(), type: "text", value: "" }];
    }

    // 1. 初始化表单
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData.title || "",
            date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            clubId: initialData.clubId || (clubs.length > 0 ? clubs[0].id : ""),
            mainImage: initialData.mainImage || "",
            customRoute: initialData.customRoute || "",
            blocks: initialBlocks,
            event: savedData.event || { venue: "", fee: "", rsvpLink: "", description: "" },
        }
    });

    const { fields: blockFields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "blocks",
    });

    // ✨ 2. 使用通用 Hook 处理保存
    const { isSubmitting, handleSubmit } = useFormAction({
        successMessage: isNew ? "記事を公開しました！" : "変更を保存しました",
        redirectUrl: "/admin/activities"
    });

    // ✨ 3. 使用通用 Hook 处理删除
    const { isSubmitting: isDeleting, handleSubmit: handleDeleteAction } = useFormAction({
        successMessage: "記事を削除しました",
        redirectUrl: "/admin/activities"
    });

    // 包装保存函数
    const onSubmit = (values: FormValues) => {
        const formData = new FormData();

        // 基础字段封装
        formData.append("title", values.title);
        formData.append("date", values.date);
        formData.append("clubId", values.clubId);
        formData.append("templateType", templateType);
        if (values.mainImage) formData.append("mainImage", values.mainImage);
        if (values.customRoute) formData.append("customRoute", values.customRoute);

        // 复杂 JSON 数据封装
        const contentDataPayload: SavedContentData = { blocks: values.blocks };
        if (templateType === "event" && values.event) {
            contentDataPayload.event = values.event;
            if (values.event.venue) formData.append("location", values.event.venue);
        }
        formData.append("contentData", JSON.stringify(contentDataPayload));

        // 根据新建还是编辑，调用不同的 Action
        if (isNew) {
            handleSubmit(createActivityAction, formData);
        } else {
            // Update 需要 ID，我们用匿名函数包装一下以适配 Hook
            handleSubmit(async (fd) => updateActivityAction(initialData.id, fd), formData);
        }
    };

    // 包装删除函数
    const onDelete = async () => {
        if (!confirm("本当にこの記事を削除しますか？\nこの操作は取り消せません。")) return;
        await handleDeleteAction(deleteActivityAction, initialData.id);
    };

    // 辅助样式
    const sectionClass = "bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4";
    const labelClass = "block text-xs font-bold mb-1.5 uppercase tracking-wide text-gray-400";
    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all text-sm focus:ring-2 focus:ring-sumo-brand focus:border-transparent font-medium";

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* ✨ 4. 使用通用布局 */}
            <AdminFormLayout
                title={isNew ? "新規記事作成" : "記事編集"}
                subTitle={`${templateType.toUpperCase()} EDITOR`}
                backLink="/admin/activities"
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                onDelete={!isNew ? onDelete : undefined} // 新建模式不显示删除
                headerActions={
                    <>
                        <button
                            type="button"
                            disabled={isPreviewing}
                            onClick={async () => {
                                setIsPreviewing(true);
                                try {
                                    const values = form.getValues();
                                    const activityId = isNew ? "preview" : initialData.id;
                                    const slug = isNew ? "preview" : (initialData as Activity & { slug?: string }).slug;
                                    const selectedClub = clubs.find((c) => c.id === values.clubId);
                                    const club = selectedClub
                                        ? { id: selectedClub.id, name: selectedClub.name }
                                        : { id: "preview", name: "クラブ" };
                                    const contentData = { blocks: values.blocks, event: values.event };
                                    const res = await fetch("/admin/api/preview", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            type: "activity",
                                            redirectPath: `/activities/${activityId}`,
                                            payload: {
                                                id: activityId,
                                                slug: slug ?? "preview",
                                                title: values.title,
                                                date: values.date,
                                                clubId: values.clubId,
                                                mainImage: values.mainImage,
                                                templateType,
                                                category: initialData.category,
                                                blocks: values.blocks,
                                                event: values.event,
                                                contentData,
                                                club,
                                            },
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
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${templateType === 'news' ? 'bg-orange-100 text-orange-600' :
                            templateType === 'event' ? 'bg-emerald-100 text-emerald-600' :
                                templateType === 'report' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                            }`}>
                        {templateType === 'news' && <FileText size={14} />}
                        {templateType === 'event' && <Calendar size={14} />}
                        {templateType === 'report' && <LayoutTemplate size={14} />}
                        {templateType === 'custom' && <ExternalLink size={14} />}
                        {templateType} Mode
                    </div>
                    </>
                }
            >
                <PreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} title="活動 プレビュー" />

                {/* Section 1: 基础信息 */}
                <div className={sectionClass}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className={labelClass}>タイトル <span className="text-red-500">*</span></label>
                                <input
                                    {...form.register("title")}
                                    className={`${inputClass} text-lg md:text-xl font-bold`}
                                    placeholder="記事のタイトル..."
                                />
                                {form.formState.errors.title && <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>}
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className={labelClass}>所属クラブ</label>
                                    <select {...form.register("clubId")} className={inputClass}>
                                        {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="w-40">
                                    <label className={labelClass}>公開日</label>
                                    <input type="date" {...form.register("date")} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* ✨ 使用通用 ImageUploader */}
                        <div>
                            <ImageUploader
                                label="カバー画像 (メイン)"
                                value={form.watch("mainImage")}
                                onChange={(url) => form.setValue("mainImage", url)}
                                bucket="images"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Template Specific Fields */}
                {templateType === "event" && (
                    <div className={`${sectionClass} border-emerald-100 bg-emerald-50/30`}>
                        <h3 className="text-emerald-800 font-bold flex items-center gap-2 text-sm uppercase tracking-wider mb-2">
                            <Calendar size={16} /> イベント詳細情報
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-bold text-emerald-600 uppercase mb-1 block">開催場所 (Venue)</label>
                                <input {...form.register("event.venue")} className={inputClass} placeholder="例: 東京武道館" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-emerald-600 uppercase mb-1 block">参加費 (Fee)</label>
                                <input {...form.register("event.fee")} className={inputClass} placeholder="例: 無料" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-emerald-600 uppercase mb-1 block">申込リンク (RSVP URL)</label>
                                <input {...form.register("event.rsvpLink")} className={inputClass} placeholder="https://..." />
                            </div>
                        </div>
                    </div>
                )}

                {templateType === "custom" && (
                    <div className={`${sectionClass} border-purple-100 bg-purple-50/30`}>
                        <label className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block mb-1">Custom Route ID</label>
                        <input
                            {...form.register("customRoute")}
                            placeholder="act-01, act-02, act-03, act-04..."
                            className={`${inputClass} font-mono`}
                        />
                        <p className="text-xs text-purple-400 mt-2">
                            可用的自定义模板: act-01, act-02, act-03, act-04
                        </p>
                    </div>
                )}

                {/* Section 3: Content Blocks Editor */}
                {templateType !== "custom" && (
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <LayoutTemplate size={14} /> Content Blocks
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {blockFields.map((field, index) => (
                                <div key={field.id} className="relative group bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-sumo-brand/50 hover:shadow-md transition-all">

                                    {/* 操作栏 (移动 + 删除) */}
                                    <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg p-1 border shadow-sm z-10">
                                        <button
                                            type="button"
                                            onClick={() => index > 0 && move(index, index - 1)}
                                            disabled={index === 0}
                                            className="p-1.5 text-gray-400 hover:text-sumo-brand hover:bg-gray-100 rounded disabled:opacity-30"
                                        >
                                            <ArrowUp size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => index < blockFields.length - 1 && move(index, index + 1)}
                                            disabled={index === blockFields.length - 1}
                                            className="p-1.5 text-gray-400 hover:text-sumo-brand hover:bg-gray-100 rounded disabled:opacity-30"
                                        >
                                            <ArrowDown size={14} />
                                        </button>
                                        <div className="w-px h-4 bg-gray-200 mx-1" />
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Block Type Indicator */}
                                    <div className="absolute -left-3 top-6 -translate-y-1/2 bg-gray-100 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded rotate-[-90deg] origin-center w-max opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest pointer-events-none">
                                        {form.watch(`blocks.${index}.type`)}
                                    </div>

                                    {/* Block Content */}
                                    {form.watch(`blocks.${index}.type`) === "subheading" && (
                                        <input
                                            {...form.register(`blocks.${index}.value`)}
                                            placeholder="見出しを入力..."
                                            className="w-full text-lg font-bold border-l-4 border-sumo-brand pl-3 py-1 outline-none placeholder:text-gray-300 bg-transparent"
                                        />
                                    )}

                                    {form.watch(`blocks.${index}.type`) === "text" && (
                                        <textarea
                                            {...form.register(`blocks.${index}.value`)}
                                            placeholder="本文を入力..."
                                            className="w-full min-h-[120px] resize-none outline-none text-base leading-relaxed placeholder:text-gray-300 bg-transparent"
                                        />
                                    )}

                                    {form.watch(`blocks.${index}.type`) === "image" && (
                                        <div className="space-y-2">
                                            {/* ✨ 积木内也复用了 ImageUploader */}
                                            <ImageUploader
                                                label="Block Image"
                                                value={form.watch(`blocks.${index}.value`)}
                                                onChange={(url) => form.setValue(`blocks.${index}.value`, url)}
                                                bucket="images"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Buttons */}
                        <div className="flex justify-center gap-3 py-8">
                            <AddBlockBtn onClick={() => append({ id: crypto.randomUUID(), type: "subheading", value: "" })} icon={Heading} label="見出し" />
                            <AddBlockBtn onClick={() => append({ id: crypto.randomUUID(), type: "text", value: "" })} icon={Type} label="文章" />
                            <AddBlockBtn onClick={() => append({ id: crypto.randomUUID(), type: "image", value: "" })} icon={ImageIcon} label="画像" />
                        </div>
                    </div>
                )}

            </AdminFormLayout>
        </form>
    );
}

// 辅助组件：添加按钮
function AddBlockBtn({ onClick, icon: Icon, label }: { onClick: () => void, icon: LucideIcon, label: string }) {
    return (
        <button type="button" onClick={onClick} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:border-sumo-brand hover:text-sumo-brand hover:shadow-md active:scale-95 transition-all group">
            <Icon size={16} className="text-gray-400 group-hover:text-sumo-brand transition-colors" />
            <span className="text-xs font-bold text-gray-500 group-hover:text-sumo-brand transition-colors">{label} 追加</span>
        </button>
    );
}