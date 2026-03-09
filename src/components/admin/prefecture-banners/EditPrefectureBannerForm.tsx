"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import MainImagePositionEditor, {
  parsePositionString,
  formatPositionString,
  parseScaleValue,
  parseRotationValue,
} from "@/components/admin/clubs/MainImagePositionEditor";
import { useFormAction } from "@/hooks/useFormAction";
import AdminFormLayout from "@/components/admin/ui/AdminFormLayout";
import PreviewModal from "@/components/admin/ui/PreviewModal";
import { upsertPrefectureBanner, deletePrefectureBanner } from "@/lib/actions/prefectureBanners";
import { PrefectureBanner } from "@prisma/client";
import { useState } from "react";
import { Trash2, Loader2, Eye } from "lucide-react";

const formSchema = z.object({
  pref: z.string().min(1),
  image: z.string().min(1, "画像をアップロードするか、URLを入力してください"),
  alt: z.string().optional(),
  imagePosition: z.string().optional(),
  imageScale: z.union([z.string(), z.number()]).optional(),
  imageRotation: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditPrefectureBannerFormProps {
  pref: string;
  prefectureName: string;
  initialBanner: PrefectureBanner | null;
  defaultDisplayImage?: string;
}

export default function EditPrefectureBannerForm({
  pref,
  prefectureName,
  initialBanner,
  defaultDisplayImage = "",
}: EditPrefectureBannerFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pref,
      image: initialBanner?.image ?? defaultDisplayImage ?? "",
      alt: initialBanner?.alt ?? "",
      imagePosition: initialBanner?.imagePosition ?? "50,50",
      imageScale: initialBanner?.imageScale != null ? String(initialBanner.imageScale) : "1",
      imageRotation: initialBanner?.imageRotation != null ? String(initialBanner.imageRotation) : "0",
    },
  });

  const { isSubmitting, handleSubmit } = useFormAction({
    successMessage: "バナーを保存しました",
    redirectUrl: "/admin/prefecture-banners",
  });

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("pref", data.pref);
    formData.append("image", data.image);
    formData.append("alt", data.alt ?? "");
    formData.append("imagePosition", data.imagePosition ?? "50,50");
    formData.append("imageScale", String(data.imageScale ?? "1"));
    formData.append("imageRotation", data.imageRotation ?? "0");
    handleSubmit(upsertPrefectureBanner, formData);
  };

  const handleDelete = async () => {
    if (!initialBanner || !confirm("カスタムバナーを削除し、デフォルト画像に戻しますか？")) return;
    setIsDeleting(true);
    try {
      const result = await deletePrefectureBanner(pref);
      if (result?.error) {
        alert(result.error);
      } else {
        window.location.href = "/admin/prefecture-banners";
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const sectionClass =
    "bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500";
  const labelClass =
    "block text-xs font-bold mb-1.5 uppercase tracking-wide text-gray-400";
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all text-sm focus:ring-2 focus:ring-sumo-brand focus:border-transparent font-medium";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <AdminFormLayout
        title={`${prefectureName} - バナー編集`}
        subTitle={`Prefecture Banner · ${pref}`}
        backLink="/admin/prefecture-banners"
        isSubmitting={isSubmitting}
        onDelete={initialBanner ? handleDelete : undefined}
        isDeleting={isDeleting}
        headerActions={
          <>
            <button
              type="button"
              disabled={isPreviewing}
              onClick={async () => {
                setIsPreviewing(true);
                try {
                  const values = form.getValues();
                  const res = await fetch("/admin/api/preview", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      type: "prefecture_banner",
                      redirectPath: `/prefectures/${pref}`,
                        payload: {
                        pref,
                        image: values.image,
                        alt: values.alt ?? "",
                        imagePosition: values.imagePosition ?? "50,50",
                        imageScale: values.imageScale ?? "1",
                        imageRotation: values.imageRotation ?? "0",
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
          </>
        }
      >
        <PreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} title="都道府県バナー プレビュー" />
        <div className="space-y-8">
          <div className={sectionClass}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>都道府県</label>
                <input
                  {...form.register("pref")}
                  readOnly
                  className={`${inputClass} bg-gray-50 text-gray-500 font-mono`}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  {prefectureName}（#{pref}）
                </p>
              </div>
              <div>
                <label className={labelClass}>画像の説明（alt）</label>
                <input
                  {...form.register("alt")}
                  className={inputClass}
                  placeholder="例：岩手県の相撲風景"
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <ImageUploader
              label="Feature Banner 画像"
              value={form.watch("image")}
              onChange={(url) => form.setValue("image", url)}
              bucket="images"
            />
            {form.watch("image") && (
              <MainImagePositionEditor
                imageUrl={form.watch("image")}
                position={parsePositionString(form.watch("imagePosition"))}
                scale={parseScaleValue(form.watch("imageScale"))}
                rotation={parseRotationValue(form.watch("imageRotation"))}
                onPositionChange={(x, y) =>
                  form.setValue("imagePosition", formatPositionString({ x, y }), { shouldDirty: true })
                }
                onScaleChange={(s) =>
                  form.setValue("imageScale", String(s), { shouldDirty: true })
                }
                onRotationChange={(deg) =>
                  form.setValue("imageRotation", String(deg), { shouldDirty: true })
                }
              />
            )}
            <p className="text-[11px] text-gray-500">
              該当県にクラブがない場合でも、ここで設定した画像が「プレースホルダー」として県ページに表示されます。
            </p>
            {form.formState.errors.image && (
              <p className="text-red-500 text-[10px] font-bold italic">
                {form.formState.errors.image.message}
              </p>
            )}
          </div>
        </div>
      </AdminFormLayout>
    </form>
  );
}
