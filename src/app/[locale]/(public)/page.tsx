import React, { Suspense } from "react";
import ScrollInitializer from "@/components/utils/ScrollInitializer";
import HomeContent from "@/components/home/HomeContent";
import HomeSkeleton from "@/components/home/HomeSkeleton";

/**
 * revalidate=60：启用 ISR，搭配 Suspense 流式渲染；
 * searchParams 已移至客户端（EmbeddedDetector），避免 dynamic 强制动态渲染。
 */
export const revalidate = 60;

export default async function Home({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <div className="w-full flex flex-col min-h-screen">
            <ScrollInitializer />
            <Suspense fallback={<HomeSkeleton />}>
                <HomeContent locale={locale} />
            </Suspense>
        </div>
    );
}
