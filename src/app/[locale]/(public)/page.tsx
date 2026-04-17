import React, { Suspense } from "react";
import ScrollInitializer from "@/components/utils/ScrollInitializer";
import HomeContent from "@/components/home/HomeContent";
import HomeSkeleton from "@/components/home/HomeSkeleton";

/** 与 unstable_cache（banner / pickup 等）对齐；显式去掉 force-dynamic 以便配合流式与缓存 */
export const revalidate = 60;

export default async function Home({
    searchParams,
    params,
}: {
    searchParams: Promise<{ embedded?: string }>;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const { embedded } = await searchParams;
    const isEmbedded = embedded === "1";

    return (
        <div className="w-full flex flex-col min-h-screen">
            <ScrollInitializer />
            <Suspense fallback={<HomeSkeleton />}>
                <HomeContent locale={locale} isEmbedded={isEmbedded} />
            </Suspense>
        </div>
    );
}
