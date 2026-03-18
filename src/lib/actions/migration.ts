"use server";

import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { confirmAdmin } from "@/lib/auth-utils";

/**
 * 将单个图片 URL 迁移到 WebP
 * @param url 原始图片 URL
 * @param bucket 存储桶名称
 * @returns 迁移后的新 URL，如果跳过则返回原 URL
 */
async function migrateImageUrl(url: string | null | undefined, bucket: string): Promise<string | null> {
    if (!url || url.endsWith(".webp") || !url.includes("supabase.co")) {
        return url || null;
    }

    try {
        console.log(`Migrating image: ${url}`);
        
        // 1. 下载图片
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. 使用 sharp 转换
        const processedBuffer = await sharp(buffer)
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        // 3. 生成新路径 (保持原文件名但换后缀)
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const originalFileName = pathParts[pathParts.length - 1];
        const fileNameWithoutExt = originalFileName.split('.').slice(0, -1).join('.') || `migrated-${Date.now()}`;
        const newFileName = `${fileNameWithoutExt}-${Math.random().toString(36).substring(2, 5)}.webp`;
        
        // 提取原始路径中的目录结构 (如果有)
        // URL 格式: /storage/v1/object/public/bucket/path/to/file
        const bucketIndex = pathParts.indexOf(bucket);
        const relativePath = bucketIndex !== -1 ? pathParts.slice(bucketIndex + 1, -1).join('/') : "";
        const filePath = relativePath ? `${relativePath}/${newFileName}` : newFileName;

        // 4. 上传到 Supabase
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, processedBuffer, {
                contentType: "image/webp",
                upsert: false
            });

        if (uploadError) throw uploadError;

        // 5. 获取新 URL
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        console.log(`Successfully migrated to: ${data.publicUrl}`);
        return data.publicUrl;
    } catch (error) {
        console.error(`Failed to migrate image ${url}:`, error);
        return url; // 失败则保留原样
    }
}

export async function migrateAllImages() {
    const admin = await confirmAdmin();
    if (!admin) return { success: false, error: "権限がありません。" };

    const stats = {
        clubs: 0,
        activities: 0,
        magazines: 0,
        banners: 0,
        prefectureBanners: 0,
        errors: 0
    };

    try {
        // 1. 迁移俱乐部图片
        const clubs = await prisma.club.findMany();
        for (const club of clubs) {
            let updated = false;
            const newLogo = await migrateImageUrl(club.logo, "images");
            const newMainImage = await migrateImageUrl(club.mainImage, "images");
            
            const newSubImages = [];
            for (const subImg of club.subImages) {
                const migrated = await migrateImageUrl(subImg, "images");
                newSubImages.push(migrated || "");
                if (migrated !== subImg) updated = true;
            }

            if (newLogo !== club.logo || newMainImage !== club.mainImage || updated) {
                await prisma.club.update({
                    where: { id: club.id },
                    data: {
                        logo: newLogo,
                        mainImage: newMainImage,
                        subImages: newSubImages
                    }
                });
                stats.clubs++;
            }
        }

        // 2. 迁移活动图片
        const activities = await prisma.activity.findMany();
        for (const activity of activities) {
            const newMainImage = await migrateImageUrl(activity.mainImage, "images");
            if (newMainImage !== activity.mainImage) {
                await prisma.activity.update({
                    where: { id: activity.id },
                    data: { mainImage: newMainImage }
                });
                stats.activities++;
            }
        }

        // 3. 迁移杂志图片
        const magazines = await prisma.magazine.findMany();
        for (const magazine of magazines) {
            let updated = false;
            const newCover = await migrateImageUrl(magazine.coverImage, "magazines");
            
            const newImages = [];
            for (const img of magazine.images) {
                const migrated = await migrateImageUrl(img, "magazines");
                newImages.push(migrated || "");
                if (migrated !== img) updated = true;
            }

            if (newCover !== magazine.coverImage || updated) {
                await prisma.magazine.update({
                    where: { id: magazine.id },
                    data: {
                        coverImage: newCover,
                        images: newImages
                    }
                });
                stats.magazines++;
            }
        }

        // 4. 迁移 Banner
        const banners = await prisma.banner.findMany();
        for (const banner of banners) {
            const newImg = await migrateImageUrl(banner.image, "images");
            if (newImg !== banner.image) {
                await prisma.banner.update({
                    where: { id: banner.id },
                    data: { image: newImg }
                });
                stats.banners++;
            }
        }

        // 5. 迁移都道府县 Banner
        const prefBanners = await prisma.prefectureBanner.findMany();
        for (const prefBanner of prefBanners) {
            const newImg = await migrateImageUrl(prefBanner.image, "images");
            if (newImg !== prefBanner.image) {
                await prisma.prefectureBanner.update({
                    where: { id: prefBanner.id },
                    data: { image: newImg }
                });
                stats.prefectureBanners++;
            }
        }

        revalidatePath("/", "layout");
        return { success: true, stats };
    } catch (error: any) {
        console.error("Migration failed:", error);
        return { success: false, error: error.message };
    }
}
