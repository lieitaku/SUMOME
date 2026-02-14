"use client";

import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_POSITION = { x: 50, y: 50 };

export type Position = { x: number; y: number };

interface MainImagePositionEditorProps {
    imageUrl: string;
    position: Position;
    onPositionChange: (x: number, y: number) => void;
    className?: string;
}

/** 解析 "50,50" 为 { x: 50, y: 50 }，非法则返回默认中心 */
export function parsePositionString(value: string | null | undefined): Position {
    if (!value || typeof value !== "string") return { ...DEFAULT_POSITION };
    const parts = value.trim().split(",");
    if (parts.length !== 2) return { ...DEFAULT_POSITION };
    const x = Number(parts[0]);
    const y = Number(parts[1]);
    if (Number.isNaN(x) || Number.isNaN(y)) return { ...DEFAULT_POSITION };
    return {
        x: Math.min(100, Math.max(0, x)),
        y: Math.min(100, Math.max(0, y)),
    };
}

/** 将位置格式化为 "x,y" */
export function formatPositionString(pos: Position): string {
    return `${Math.round(pos.x)},${Math.round(pos.y)}`;
}

export default function MainImagePositionEditor({
    imageUrl,
    position,
    onPositionChange,
    className,
}: MainImagePositionEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const startRef = useRef({ clientX: 0, clientY: 0, x: 0, y: 0 });

    const clamp = useCallback((v: number) => Math.min(100, Math.max(0, v)), []);

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            e.preventDefault();
            if (!containerRef.current) return;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            setIsDragging(true);
            startRef.current = { clientX: e.clientX, clientY: e.clientY, x: position.x, y: position.y };
        },
        [position.x, position.y]
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isDragging || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const deltaX = e.clientX - startRef.current.clientX;
            const deltaY = e.clientY - startRef.current.clientY;
            const percentX = (deltaX / rect.width) * 100;
            const percentY = (deltaY / rect.height) * 100;
            const newX = clamp(startRef.current.x + percentX);
            const newY = clamp(startRef.current.y + percentY);
            onPositionChange(newX, newY);
            startRef.current = { ...startRef.current, clientX: e.clientX, clientY: e.clientY, x: newX, y: newY };
        },
        [isDragging, onPositionChange, clamp]
    );

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        setIsDragging(false);
    }, []);

    const handleReset = useCallback(() => {
        onPositionChange(DEFAULT_POSITION.x, DEFAULT_POSITION.y);
    }, [onPositionChange]);

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-400">
                    カードでの見え方（ドラッグで位置調整）
                </label>
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-sumo-brand rounded-lg hover:bg-blue-50 transition-colors"
                >
                    <RotateCcw size={12} />
                    中央に戻す
                </button>
            </div>
            <div
                ref={containerRef}
                role="presentation"
                className={cn(
                    "relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl border border-gray-200 bg-gray-100 shadow-sm",
                    isDragging && "cursor-grabbing"
                )}
                style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <Image
                    src={imageUrl}
                    alt="メイン画像プレビュー"
                    fill
                    className={cn("object-cover select-none", isDragging && "pointer-events-none")}
                    style={{ objectPosition: `${position.x}% ${position.y}%` }}
                    draggable={false}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
        </div>
    );
}
