"use client";

import { useRef, useCallback, useState } from "react";
import { RotateCcw, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_POSITION = { x: 50, y: 50 };
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DEFAULT_SCALE = 1;
const ROTATION_OPTIONS = [0, 90, 180, 270] as const;

export type Position = { x: number; y: number };

interface MainImagePositionEditorProps {
    imageUrl: string;
    position: Position;
    scale: number;
    rotation?: number;
    onPositionChange: (x: number, y: number) => void;
    onScaleChange: (scale: number) => void;
    onRotationChange?: (deg: number) => void;
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

/** 解析缩放字符串或数字，1.0–4.0，非法则 1 */
export function parseScaleValue(value: string | number | null | undefined): number {
    if (value == null || value === "") return DEFAULT_SCALE;
    const n = typeof value === "number" ? value : parseFloat(String(value).trim());
    if (Number.isNaN(n)) return DEFAULT_SCALE;
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, n));
}

/** 解析旋转角度，0/90/180/270，非法则 0 */
export function parseRotationValue(value: string | number | null | undefined): number {
    if (value == null || value === "") return 0;
    const n = typeof value === "number" ? value : parseInt(String(value).trim(), 10);
    if (Number.isNaN(n)) return 0;
    return ROTATION_OPTIONS.includes(n as 0 | 90 | 180 | 270) ? n : 0;
}

export default function MainImagePositionEditor({
    imageUrl,
    position,
    scale,
    rotation = 0,
    onPositionChange,
    onScaleChange,
    onRotationChange,
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
            const newX = clamp(startRef.current.x - percentX);
            const newY = clamp(startRef.current.y - percentY);
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
        onScaleChange(DEFAULT_SCALE);
        onRotationChange?.(0);
    }, [onPositionChange, onScaleChange, onRotationChange]);

    const handleRotateLeft = useCallback(() => {
        const next = (rotation - 90 + 360) % 360;
        onRotationChange?.(next);
    }, [rotation, onRotationChange]);

    const handleRotateRight = useCallback(() => {
        const next = (rotation + 90) % 360;
        onRotationChange?.(next);
    }, [rotation, onRotationChange]);

    const scalePercent = Math.round(scale * 100);

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-400">
                    カードでの見え方（ドラッグで上下左右・スライダーで拡大率）
                </label>
                <div className="flex items-center gap-1">
                    {onRotationChange && (
                        <>
                            <button
                                type="button"
                                onClick={handleRotateLeft}
                                className="p-2 rounded-lg text-gray-500 hover:bg-sumo-brand/10 hover:text-sumo-brand transition-colors"
                                aria-label="左に90度回転"
                            >
                                <RotateCcw size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={handleRotateRight}
                                className="p-2 rounded-lg text-gray-500 hover:bg-sumo-brand/10 hover:text-sumo-brand transition-colors"
                                aria-label="右に90度回転"
                            >
                                <RotateCw size={16} />
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-sumo-brand rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <RotateCcw size={12} />
                        中央・100%に戻す
                    </button>
                </div>
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
                <div
                    className={cn("absolute inset-0 bg-no-repeat select-none", isDragging && "pointer-events-none")}
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: `${100 * scale}%`,
                        backgroundPosition: `${position.x}% ${position.y}%`,
                        transform: `rotate(${rotation}deg)`,
                    }}
                />
            </div>

            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider w-12 shrink-0">
                    拡大率
                </span>
                <input
                    type="range"
                    min={MIN_SCALE * 100}
                    max={MAX_SCALE * 100}
                    value={scalePercent}
                    onChange={(e) => onScaleChange(Number(e.target.value) / 100)}
                    className="flex-1 h-2 rounded-full appearance-none bg-gray-200 accent-sumo-brand cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-600 tabular-nums w-10">{scalePercent}%</span>
            </div>
        </div>
    );
}
