"use client";

import { useState, useEffect } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
    value?: string;           // 现在的图片URL
    onChange: (url: string) => void; // 回调函数
    disabled?: boolean;       // 是否禁用
    bucket?: string;          // 存储桶名字
}

export default function ImageUpload({
    value,
    onChange,
    disabled,
    bucket = "images"
}: ImageUploadProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(value);

    // 解决 Hydration 问题
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 监听外部 value 变化
    useEffect(() => {
        setPreview(value);
    }, [value]);

    if (!isMounted) return null;

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            const supabase = createClient();

            // 1. 生成唯一文件名
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // 2. 上传
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 3. 获取公开链接
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            // 4. 更新
            setPreview(publicUrl);
            onChange(publicUrl);

        } catch (error) {
            console.error("Upload error:", error);
            alert("画像のアップロードに失敗しました。もう一度お試しください。");
        } finally {
            setIsLoading(false);
        }
    };

    const onRemove = () => {
        onChange("");
        setPreview("");
    };

    return (
        <div className="flex items-center gap-4">
            {/* 状态 A: 有图 -> 显示预览 */}
            {preview ? (
                <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200 shadow-sm group bg-white">
                    <Image
                        fill
                        src={preview}
                        alt="Uploaded image"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={onRemove}
                            disabled={disabled || isLoading}
                            type="button"
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                            title="画像を削除"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                // 状态 B: 没图 -> 显示上传框
                <div className="w-40 h-40">
                    <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-[#2454a4] transition-all group">

                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-[#2454a4]">
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-8 h-8 mb-2 animate-spin text-[#2454a4]" />
                                    <p className="text-xs font-medium">アップロード中...</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 mb-2 transition-transform group-hover:-translate-y-1" />
                                    <p className="text-xs font-bold">画像を選択</p>
                                </>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onUpload}
                            disabled={disabled || isLoading}
                        />
                    </label>
                </div>
            )}

            {/* 辅助说明文字 */}
            {!preview && (
                <div className="text-sm text-gray-500">
                    <p className="font-bold text-gray-700 text-xs uppercase tracking-wide mb-1">
                        推奨サイズ・形式
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-500">
                        <li>ファイルサイズ: <span className="font-medium text-gray-700">5MB以下</span></li>
                        <li>対応形式: <span className="font-medium text-gray-700">JPG, PNG, WebP</span></li>
                    </ul>
                </div>
            )}
        </div>
    );
}