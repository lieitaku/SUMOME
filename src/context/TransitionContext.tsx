"use client";

import React, { createContext, useContext, useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type TransitionContextType = {
    isLoading: boolean;
    startLoading: () => void;
};

const TransitionContext = createContext<TransitionContextType>({
    isLoading: false,
    startLoading: () => { },
});

// 内部组件：处理路由变化的监听逻辑
// useSearchParams 需要在 Suspense 边界内使用
function TransitionStateManager({
    setIsLoading,
}: {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 当路径发生变化时（说明新页面加载完了），取消 Loading 状态
    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams, setIsLoading]);

    return null;
}

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => setIsLoading(true);

    return (
        <TransitionContext.Provider value={{ isLoading, startLoading }}>
            {/* useSearchParams 需要被 Suspense 包裹 */}
            <Suspense fallback={null}>
                <TransitionStateManager setIsLoading={setIsLoading} />
            </Suspense>
            {children}
        </TransitionContext.Provider>
    );
};

export const useTransition = () => useContext(TransitionContext);