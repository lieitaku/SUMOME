"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type TransitionContextType = {
    isLoading: boolean;
    startLoading: () => void;
};

const TransitionContext = createContext<TransitionContextType>({
    isLoading: false,
    startLoading: () => { },
});

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 当路径发生变化时（说明新页面加载完了），取消 Loading 状态
    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams]);

    const startLoading = () => setIsLoading(true);

    return (
        <TransitionContext.Provider value={{ isLoading, startLoading }}>
            {children}
        </TransitionContext.Provider>
    );
};

export const useTransition = () => useContext(TransitionContext);