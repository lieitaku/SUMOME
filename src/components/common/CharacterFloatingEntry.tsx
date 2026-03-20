"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * 角色悬浮球总开关（改这里即可，无需动 layout）
 * - `true`：在首页显示悬浮球
 * - `false`：全局不渲染悬浮球
 */
export const SHOW_CHARACTER_FLOATING_ENTRY = false;

const FLOAT_SIZE = 56;
const FLOAT_GAP = 16;
const STORAGE_KEY = "sumome-character-float-position";
const DRAG_THRESHOLD = 4;

function CharacterFloatingEntryInner() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const pointerStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const hasMovedRef = useRef(false);
  const isDraggingRef = useRef(false);

  const clampPosition = useCallback((x: number, y: number) => {
    const maxX = window.innerWidth - FLOAT_SIZE - FLOAT_GAP;
    const maxY = window.innerHeight - FLOAT_SIZE - FLOAT_GAP;
    return {
      x: Math.min(Math.max(FLOAT_GAP, x), maxX),
      y: Math.min(Math.max(FLOAT_GAP, y), maxY),
    };
  }, []);

  useEffect(() => {
    const defaultX = window.innerWidth - FLOAT_SIZE - FLOAT_GAP;
    const defaultY = Math.max(FLOAT_GAP, window.innerHeight / 2 - FLOAT_SIZE / 2);
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      setPosition(clampPosition(defaultX, defaultY));
      setMounted(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as { x: number; y: number };
      setPosition(clampPosition(parsed.x, parsed.y));
    } catch {
      setPosition(clampPosition(defaultX, defaultY));
    } finally {
      setMounted(true);
    }
  }, [clampPosition]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  }, [mounted, position]);

  useEffect(() => {
    if (!mounted) return;
    const handleResize = () => {
      setPosition((prev) => clampPosition(prev.x, prev.y));
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.documentElement.classList.remove("char-drag-no-select");
      document.body.classList.remove("char-drag-no-select");
      if (preventSelectRef.current) {
        document.removeEventListener("selectstart", preventSelectRef.current);
        preventSelectRef.current = null;
      }
    };
  }, [mounted, clampPosition]);

  const preventSelectRef = useRef<(e: Event) => void | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    document.documentElement.classList.add("char-drag-no-select");
    document.body.classList.add("char-drag-no-select");
    const preventSelect = (ev: Event) => ev.preventDefault();
    preventSelectRef.current = preventSelect;
    document.addEventListener("selectstart", preventSelect);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    hasMovedRef.current = false;
    isDraggingRef.current = true;
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    window.getSelection()?.removeAllRanges();
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      hasMovedRef.current = true;
    }
    const next = clampPosition(
      pointerStartRef.current.posX + dx,
      pointerStartRef.current.posY + dy,
    );
    setPosition(next);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    document.documentElement.classList.remove("char-drag-no-select");
    document.body.classList.remove("char-drag-no-select");
    if (preventSelectRef.current) {
      document.removeEventListener("selectstart", preventSelectRef.current);
      preventSelectRef.current = null;
    }
    window.getSelection()?.removeAllRanges();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
    setDragging(false);

    if (!hasMovedRef.current) {
      router.push("/characters");
      return;
    }

    const leftDist = position.x;
    const rightDist = window.innerWidth - position.x - FLOAT_SIZE;
    const snapX = leftDist < rightDist ? FLOAT_GAP : window.innerWidth - FLOAT_SIZE - FLOAT_GAP;
    setPosition({ x: snapX, y: position.y });
  };

  if (pathname !== "/") return null;

  return (
    <div data-embedded-hide className={cn("print:hidden", "fixed inset-0 z-50 pointer-events-none")}>
      {!mounted ? null : (
        <motion.div
          animate={{ x: position.x, y: position.y }}
          transition={dragging ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "pointer-events-auto fixed left-0 top-0 grid h-14 w-14 place-items-center rounded-full",
            "border border-white/50 bg-sumo-brand text-white shadow-[0_12px_30px_rgba(0,71,171,0.35)]",
            "select-none touch-none",
            dragging ? "cursor-grabbing" : "cursor-grab",
          )}
          role="button"
          tabIndex={0}
          aria-label="角色介绍"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              router.push("/characters");
            }
          }}
        >
          <span className="absolute inset-0 rounded-full bg-white/20 blur-sm opacity-70" />
          <Sparkles className="relative pointer-events-none" size={20} strokeWidth={2.6} />
        </motion.div>
      )}
    </div>
  );
}

export default function CharacterFloatingEntry() {
  if (!SHOW_CHARACTER_FLOATING_ENTRY) return null;
  return <CharacterFloatingEntryInner />;
}
