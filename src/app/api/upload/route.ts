import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import sharp from "sharp";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const bucket = (formData.get("bucket") as string) || "images";

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 1. 将 File 转为 Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // 2. 使用 sharp 处理图片
        // - 转换为 webp
        // - 限制最大宽度为 1920px (可选)
        // - 压缩质量设为 80
        const processedBuffer = await sharp(buffer)
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        // 3. 生成唯一文件名
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
        const filePath = `${fileName}`;

        // 4. 上传到 Supabase
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, processedBuffer, {
                contentType: "image/webp",
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // 5. 获取 Public URL
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

        return NextResponse.json({ url: data.publicUrl });
    } catch (error: any) {
        console.error("Upload API error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
