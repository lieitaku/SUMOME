"use client";

import React, { useState, useEffect, useRef, forwardRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Share2, X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import HTMLFlipBook from "react-pageflip";

// ==============================================================================
// 组件: 社交分享按钮 (保持不变)
// ==============================================================================
export function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        const title = document.title;
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch (err) { }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("リンクをコピーしました");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("コピーに失敗しました");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-2 py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all group active:scale-95 w-full"
        >
            {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} className="group-hover:scale-110 transition-transform text-gray-400 group-hover:text-gray-900" />}
            <span className="text-[10px] font-bold uppercase tracking-wider">{copied ? "Copied" : "Share"}</span>
        </button>
    );
}

// ==============================================================================
// 组件: 单页渲染组件 (保持不变)
// ==============================================================================
interface PageProps {
    src: string;
    pageNumber: number;
    isCover?: boolean;
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
    return (
        <div className="bg-white h-full w-full overflow-hidden shadow-inner relative select-none" ref={ref}>
            <div className="relative w-full h-full">
                <Image
                    src={props.src}
                    alt={`Page ${props.pageNumber}`}
                    fill
                    className="object-contain"
                    quality={100}
                    priority={props.pageNumber <= 4}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-transparent pointer-events-none mix-blend-multiply" />
            </div>

            {!props.isCover && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 font-mono">
                    - {props.pageNumber - 1} -
                </div>
            )}
        </div>
    );
});
Page.displayName = "Page";

// ==============================================================================
// 组件: 杂志阅读器主体
// ==============================================================================
type Spread = {
    left: string;
    right?: string;
};

interface MagazineReaderProps {
    spreads: Spread[];
    coverImage?: string | null;
}

export function MagazineReader({ spreads, coverImage }: MagazineReaderProps) {
    // 核心状态：控制 Portal 是否显示
    const [isOpen, setIsOpen] = useState(false);
    // 核心状态：✨ 新增 - 专门控制 FlipBook 组件是否开始渲染
    const [showFlipBook, setShowFlipBook] = useState(false);

    const [mounted, setMounted] = useState(false);
    const bookRef = useRef<any>(null);

    const [isMobile, setIsMobile] = useState(false);
    const [bookDimensions, setBookDimensions] = useState({ width: 400, height: 550 });

    // 1. 数据清洗 (使用 Set 强力去重)
    const pages = useMemo(() => {
        const uniqueUrls = new Set<string>();
        const flatPages: string[] = [];

        // 添加封面
        if (coverImage) {
            flatPages.push(coverImage);
            uniqueUrls.add(coverImage);
        }

        // 添加内页 (遇到已存在的 URL 则跳过)
        spreads.forEach(spread => {
            if (spread.left && !uniqueUrls.has(spread.left)) {
                flatPages.push(spread.left);
                uniqueUrls.add(spread.left);
            }
            if (spread.right && !uniqueUrls.has(spread.right)) {
                flatPages.push(spread.right);
                uniqueUrls.add(spread.right);
            }
        });

        return flatPages;
    }, [spreads, coverImage]);

    // 2. 客户端挂载检测
    useEffect(() => {
        setMounted(true);
        return () => { document.body.style.overflow = ""; };
    }, []);

    // ✨ 核心修复逻辑：延迟挂载 FlipBook
    // 当 Portal 打开时，不要立即渲染 FlipBook，等待 50ms 确保容器稳定
    // 这样可以避开 React StrictMode 的双重挂载冲突
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen) {
            timer = setTimeout(() => {
                setShowFlipBook(true);
            }, 50); // 极短的延迟
        } else {
            setShowFlipBook(false);
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    // 3. 打开逻辑
    const openBook = (startSpreadIndex: number = 0) => {
        setIsOpen(true);
        document.body.style.overflow = "hidden";

        // 翻页动作需要更长的延迟，等待 FlipBook 渲染完毕
        setTimeout(() => {
            if (bookRef.current) {
                const targetPage = coverImage ? (startSpreadIndex * 2) + 1 : startSpreadIndex * 2;
                // 增加 try-catch 防止未初始化完成报错
                try {
                    bookRef.current.pageFlip().flip(targetPage);
                } catch (e) { console.log('Flip not ready'); }
            }
        }, 600);
    };

    // 4. 关闭逻辑
    const closeBook = () => {
        setIsOpen(false);
        // ✨ 立即销毁 FlipBook 状态
        setShowFlipBook(false);
        document.body.style.overflow = "";
    };

    // 5. 尺寸计算
    const updateDimensions = useCallback(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ratio = 1.414;

        if (width < 768) {
            setIsMobile(true);
            const maxWidth = width - 20;
            const maxHeight = height - 100;
            let finalW = maxWidth;
            let finalH = finalW * ratio;
            if (finalH > maxHeight) {
                finalH = maxHeight;
                finalW = finalH / ratio;
            }
            setBookDimensions({ width: finalW, height: finalH });
        } else {
            setIsMobile(false);
            const maxWidth = (width - 120) / 2;
            const maxHeight = height - 100;
            let finalH = maxHeight;
            let finalW = finalH / ratio;
            if (finalW > maxWidth) {
                finalW = maxWidth;
                finalH = finalW * ratio;
            }
            setBookDimensions({ width: finalW, height: finalH });
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            updateDimensions();
            window.addEventListener("resize", updateDimensions);
            return () => window.removeEventListener("resize", updateDimensions);
        }
    }, [isOpen, updateDimensions]);

    const nextFlip = (e: React.MouseEvent) => { e.stopPropagation(); bookRef.current?.pageFlip().flipNext(); };
    const prevFlip = (e: React.MouseEvent) => { e.stopPropagation(); bookRef.current?.pageFlip().flipPrev(); };

    return (
        <>
            {/* 列表入口 (保持不变) */}
            <div className="space-y-12">
                {spreads.map((spread, idx) => {
                    const startPage = idx * 2 + 1;
                    const endPage = idx * 2 + 2;
                    return (
                        <div key={idx} className="group relative mb-12 last:mb-0">
                            <div
                                onClick={() => openBook(idx)}
                                className="flex shadow-lg rounded-sm overflow-hidden border border-gray-100 bg-white relative cursor-pointer transition-transform hover:scale-[1.01] duration-500"
                            >
                                <div className="flex-1 relative aspect-[3/4] border-r border-gray-200">
                                    <Image src={spread.left} alt={`Page ${startPage}`} fill className="object-cover" />
                                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
                                </div>
                                <div className="flex-1 relative aspect-[3/4] bg-gray-50">
                                    {spread.right ? (
                                        <>
                                            <Image src={spread.right} alt={`Page ${endPage}`} fill className="object-cover" />
                                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300 text-xs font-mono uppercase tracking-widest">End</div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                        <span>立ち読みする</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-3 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                Pages {startPage} - {spread.right ? endPage : "End"}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ✨ 核心修改：渲染控制 
          只有当 isOpen 为 true 且 Portal 挂载后才显示 Portal 容器。
      */}
            {mounted && isOpen && createPortal(
                <div
                    className="fixed inset-0 z-[100000] bg-[#333]/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300 cursor-default"
                >
                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-[100002] bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                        <div className="text-white/80 text-xs font-bold tracking-widest px-4 pointer-events-auto">
                            DIGITAL VIEWER
                        </div>
                        <button
                            onClick={closeBook}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all pointer-events-auto cursor-pointer"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <button onClick={prevFlip} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[100002] bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur transition-all hidden md:block cursor-pointer">
                        <ChevronLeft size={32} />
                    </button>
                    <button onClick={nextFlip} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100002] bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur transition-all hidden md:block cursor-pointer">
                        <ChevronRight size={32} />
                    </button>

                    <div
                        className="relative shadow-2xl"
                        style={{ perspective: '1500px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ✨ 核心修复：
                只有当 showFlipBook 为 true 时才渲染 HTMLFlipBook。
                这个 50ms 的时间差足以让 React 确定 Portal 已经稳定渲染，
                从而避免了 StrictMode 下的重复挂载问题。
            */}
                        {showFlipBook ? (
                            <HTMLFlipBook
                                width={bookDimensions.width}
                                height={bookDimensions.height}
                                size="fixed"
                                minWidth={300}
                                maxWidth={1000}
                                minHeight={400}
                                maxHeight={1533}
                                maxShadowOpacity={0.5}
                                showCover={true}
                                mobileScrollSupport={true}
                                className="mx-auto"
                                ref={bookRef}
                                style={{}}
                                startPage={0}
                                drawShadow={true}
                                flippingTime={800}
                                usePortrait={isMobile}
                                startZIndex={0}
                                autoSize={true}
                                clickEventForward={true}
                                useMouseEvents={true}
                                swipeDistance={30}
                                showPageCorners={true}
                                disableFlipByClick={false}
                            >
                                {pages.map((src, index) => (
                                    <Page
                                        // 使用唯一键值，确保不复用 DOM
                                        key={`page-${index}-${src.substring(src.length - 10)}`}
                                        src={src}
                                        pageNumber={index + 1}
                                        isCover={index === 0}
                                    />
                                ))}
                            </HTMLFlipBook>
                        ) : (
                            // Loading 占位，防止闪烁
                            <div className="text-white/50 text-xs tracking-widest animate-pulse">
                                LOADING BOOK...
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-6 text-white/50 text-[10px] uppercase tracking-widest font-medium pointer-events-none">
                        Swipe or Drag corners to Flip
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}