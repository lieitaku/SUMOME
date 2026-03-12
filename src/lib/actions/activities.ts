"use server";

import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { confirmAdmin } from "@/lib/auth-utils";
import { Prisma } from "@prisma/client";

// ==========================================
// 1. 定义统一的数据结构 (与前端 Editor 对应)
// ==========================================

// 积木块结构
interface Block {
  id: string;
  type: "text" | "image" | "subheading";
  value: string;
}

// Event 专属元数据
interface EventMeta {
  venue: string;
  fee: string;
  rsvpLink: string;
}

// 数据库存储的 JSON 结构
interface ContentDataSchema {
  blocks?: Block[];      // 通用积木数组 (News, Report, Event 共用)
  event?: EventMeta;     // Event 专用字段
  // 兼容旧数据 (可选)
  news?: { body?: string }; 
}

// ==========================================
// 2. 辅助函数
// ==========================================

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || 'post'}-${Date.now()}`;
}

// 核心：统一解析 FormData，提取 SEO 文本
function parseFormData(formData: FormData) {
  const title = formData.get("title") as string;
  const templateType = formData.get("templateType") as string;
  const contentDataRaw = formData.get("contentData") as string;
  
  let contentData: ContentDataSchema = {};
  let plainTextContent = "";

  // 解析 JSON 并提取纯文本 (用于搜索)
  if (contentDataRaw) {
    try {
      contentData = JSON.parse(contentDataRaw);
      
      // 提取 blocks 中的文本
      if (contentData.blocks && Array.isArray(contentData.blocks)) {
        plainTextContent = contentData.blocks
          .filter((b: Block) => b.type === 'text' || b.type === 'subheading')
          .map((b: Block) => b.value)
          .join("\n");
      }
      // 兼容：如果是旧的 Event 数据
      if (templateType === 'event' && contentData.event) {
         // Event 的 SEO 文本通常包含 venue 等信息，这里简单处理追加
         plainTextContent += ` ${contentData.event.venue || ''}`;
      }
    } catch (e) {
      console.error("JSON Parse Error:", e);
    }
  }

  return {
    title,
    slug: generateSlug(title), // 注意：Update 时通常不更新 slug，需在 Update 函数里剔除
    date: new Date(formData.get("date") as string),
    templateType,
    category: templateType === "news" ? "News" : templateType === "event" ? "Event" : "Report",
    location: formData.get("location") as string || null,
    mainImage: formData.get("mainImage") as string || null,
    customRoute: formData.get("customRoute") as string || null,
    contentData: (contentData as unknown as Prisma.InputJsonValue),
    content: plainTextContent, // 自动生成的纯文本
    clubId: formData.get("clubId") as string,
  };
}

// ==========================================
// 3. Server Actions
// ==========================================

// --- A. 创建占位符 (保留以兼容旧流程) ---
export async function createPlaceholderActivity(templateType: string) {
  const admin = await confirmAdmin();
  if (!admin) throw new Error("Unauthorized");

  const defaultClub = await prisma.club.findFirst();
  if (!defaultClub) throw new Error("No club found. Please create a club first.");

  try {
    const activity = await prisma.activity.create({
      data: {
        title: "無題の記事",
        slug: `draft-${crypto.randomUUID().slice(0, 8)}`,
        date: new Date(),
        templateType: templateType,
        category: templateType === "news" ? "News" : "Report",
        clubId: defaultClub.id,
        authorId: admin.id,
        published: false,
      }
    });
    return { id: activity.id };
  } catch (error) {
    console.error("Placeholder Creation Error:", error);
    return null;
  }
}

// --- B. 正式创建 (Create) ---
export async function createActivityAction(formData: FormData) {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません" };

  try {
    // 1. 解析数据
    const data = parseFormData(formData);

    // 2. 校验必填项
    if (!data.clubId) return { error: "クラブを選択してください" };

    // 3. 写入数据库
    const newActivity = await prisma.activity.create({
      data: {
        ...data,
        published: true, // 新建即发布
        authorId: admin.id, // 绑定作者
      },
    });
    return { success: true, id: newActivity.id };

  }catch (error) { // ❌ 去掉 : any，让 TS 自动推断为 unknown
    console.error("🔥 DATABASE ERROR:", error);

    // ✅ 方案：检查错误是否属于 Prisma 的已知错误类型
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 只有在这里，TS 才知道 error 里面一定有 .code 属性
      if (error.code === 'P2025') {
        return { error: "保存失敗：関連付けられたClubまたはUserが見つかりません (P2025)" };
      }
      if (error.code === 'P2003') {
        return { error: "保存失敗：Club ID が無効です (P2003)" };
      }
    }

    // ✅ 处理常规 Error (获取 .message)
    if (error instanceof Error) {
      return { error: `システムエラー: ${error.message}` };
    }

    // 处理其他未知错误
    return { error: "不明なエラーが発生しました" };
  }
}

// --- C. 更新 (Update) ---
export async function updateActivityAction(id: string, formData: FormData) {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません" };

  try {
    // 1. 解析数据
    const data = parseFormData(formData);

    // 2. 剔除不应更新的字段 (Slug 和 Author)
    // 我们不希望每次保存都改变 URL，也不希望改变作者
    const { slug, ...updateData } = data;

    // 3. 执行更新
    await prisma.activity.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/activities");
    revalidatePath(`/activities/${id}`);
    revalidatePath("/activities");
    revalidateTag("activities");
    revalidateTag("admin-stats");

    return { success: true };

  } catch (dbError) {
    console.error("Database Update Error:", dbError);
    return { error: "更新に失敗しました" };
  }
}

// --- D. 删除 (Delete) ---
export async function deleteActivityAction(id: string) {
  const admin = await confirmAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    await prisma.activity.delete({ where: { id } });
  } catch (error) {
    return { error: "削除に失敗しました" };
  }

  revalidatePath("/admin/activities");
  revalidatePath("/activities");
  revalidateTag("activities");
  revalidateTag("admin-stats");
  return { success: true };
}