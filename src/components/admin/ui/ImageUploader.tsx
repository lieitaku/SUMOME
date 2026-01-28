"use client";

import { useState, useRef } from "react";
import { Loader2, ImageIcon, CloudUpload, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ⚠️ 确保你的 .env 包含这两个变量
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ImageUploaderProps {
    value?: string | null; // 允许 null，兼容数据库
    onChange: (url: string) => void;
    label?: string;
    bucket?: string; // 默认 'images'
    className?: string;
}

export default function ImageUploader({
    value,
    onChange,
    label,
    bucket = 'images',
    className
}: ImageUploaderProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- 处理文件上传核心逻辑 ---
    const handleFile = async (file: File) => {
        if (!file) return;

        // 校验文件类型
        if (!file.type.startsWith("image/")) {
            toast.error("画像ファイルのみアップロード可能です");
            return;
        }

        // 校验文件大小 (例如 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("ファイルサイズは5MB以下にしてください");
            return;
        }

        try {
            setUploading(true);
            // 生成唯一文件名: timestamp-random.ext
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. 上传到 Supabase
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. 获取 Public URL
            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

            // 3. 回填 URL
            onChange(data.publicUrl);
            toast.success("画像をアップロードしました");
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : "不明なエラーが発生しました";
            toast.error("アップロード失敗", { description: message });
        } finally {
            setUploading(false);
        }
    };

    // --- 处理移除图片 ---
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation(); // 防止触发点击上传
        if (confirm("画像を削除しますか？")) {
            onChange(""); // 清空 URL
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>}

            <div
                // 点击触发文件选择
                onClick={() => fileInputRef.current?.click()}
                // 拖拽事件处理
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                }}
                className={cn(
                    "group relative w-full aspect-video md:aspect-[21/9] rounded-xl border-2 border-dashed overflow-hidden transition-all cursor-pointer flex flex-col items-center justify-center gap-3",
                    isDragOver
                        ? "border-sumo-brand bg-blue-50/50 scale-[0.99] ring-2 ring-sumo-brand/20"
                        : "border-gray-300 bg-gray-50 hover:border-sumo-brand hover:bg-white",
                    value ? "bg-white border-solid border-gray-200" : ""
                )}
            >
                {value ? (
                    <>
                        {/* 图片预览 */}
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />

                        {/* 悬停遮罩 */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                                <CloudUpload size={14} /> 変更
                            </div>
                            <button
                                onClick={handleRemove}
                                className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 hover:scale-105 transition-transform"
                                title="画像を削除"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* 空状态 / 上传中 */}
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="animate-spin text-sumo-brand" size={32} />
                                <span className="text-xs font-bold text-sumo-brand">アップロード中...</span>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ImageIcon className="text-gray-400 group-hover:text-sumo-brand transition-colors" size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-gray-600">
                                        クリック または ドラッグ＆ドロップ
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, GIF (Max 5MB)</p>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* 隐藏的 Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
            </div>

            {/* 备用：URL 手动输入 */}
            <div className="flex items-center gap-3 px-1">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">OR URL</span>
                <input
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://..."
                    // 阻止冒泡，防止点输入框触发上传
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 p-2 bg-transparent border-b border-gray-200 text-xs text-gray-600 focus:border-sumo-brand outline-none transition-colors font-mono"
                />
            </div>
        </div>
    );
}