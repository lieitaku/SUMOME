"use client";

import React, { createContext, useContext, useState, useEffect, Suspense } from "react";
import { usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

type TransitionContextType = {
    isLoading: boolean;
    startLoading: () => void;
};

const TransitionContext = createContext<TransitionContextType>({
    isLoading: false,
    startLoading: () => { },
});

/**
 * 仅用 pathname 结束「迷雾」加载。
 * 必须放在 Suspense 外：若与 useSearchParams 同组件并包在 Suspense 内，
 * 在部分导航/水合场景下子树会挂起，useEffect 不跑 → isLoading 永远 true，
 * 全屏 PageLoader 盖住 Hero 视频且无法播放。
 */
function PathnameLoadingReset({
    setIsLoading,
}: {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const pathname = usePathname();
    useEffect(() => {
        setIsLoading(false);
    }, [pathname, setIsLoading]);
    return null;
}

/** 仅 query 变化时也要收起加载层；useSearchParams 需 Suspense */
function SearchParamsLoadingReset({
    setIsLoading,
}: {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const searchParams = useSearchParams();
    useEffect(() => {
        setIsLoading(false);
    }, [searchParams, setIsLoading]);
    return null;
}

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => setIsLoading(true);

    return (
        <TransitionContext.Provider value={{ isLoading, startLoading }}>
            <PathnameLoadingReset setIsLoading={setIsLoading} />
            <Suspense fallback={null}>
                <SearchParamsLoadingReset setIsLoading={setIsLoading} />
            </Suspense>
            {children}
        </TransitionContext.Provider>
    );
};

export const useTransition = () => useContext(TransitionContext);
