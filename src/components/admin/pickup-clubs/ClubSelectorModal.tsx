"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Search, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ClubOption = { id: string; name: string; mainImage: string | null };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (clubId: string) => void;
  clubs: ClubOption[];
  currentSelectedId?: string | null;
}

export default function ClubSelectorModal({ isOpen, onClose, onSelect, clubs, currentSelectedId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevent scrolling background
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const filteredClubs = useMemo(() => {
    if (!searchQuery) return clubs;
    const q = searchQuery.toLowerCase();
    return clubs.filter((c) => c.name.toLowerCase().includes(q));
  }, [clubs, searchQuery]);

  // Reset to first page when search changes or clubs list变化
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, clubs.length]);

  const totalPages = Math.max(1, Math.ceil(filteredClubs.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedClubs = filteredClubs.slice(startIndex, startIndex + pageSize);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">クラブを選択</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {filteredClubs.length === clubs.length && !searchQuery
                ? `全 ${clubs.length} 件`
                : `検索結果: ${filteredClubs.length} 件`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="クラブ名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sumo-brand transition-all text-sm font-medium"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {filteredClubs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              クラブが見つかりませんでした
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paginatedClubs.map((club) => {
                const isSelected = currentSelectedId === club.id;
                return (
                  <button
                    key={club.id}
                    onClick={() => {
                      onSelect(club.id);
                      onClose();
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border text-left transition-all group",
                      isSelected
                        ? "border-sumo-brand bg-sumo-brand/5 ring-1 ring-sumo-brand"
                        : "border-gray-100 hover:border-sumo-brand/50 hover:bg-gray-50"
                    )}
                  >
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-200 border border-gray-100">
                      {club.mainImage ? (
                        <Image
                          src={club.mainImage}
                          alt={club.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-[10px] font-bold">
                          NO IMG
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate group-hover:text-sumo-brand transition-colors">
                        {club.name}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">ID: {club.id.slice(0, 8)}...</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-sumo-brand text-white flex items-center justify-center shrink-0">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer: Pagination + Cancel */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Pagination controls */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={cn(
                "px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1",
                currentPage === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-600 hover:bg-white"
              )}
            >
              前へ
            </button>
            <span className="text-[11px] font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={cn(
                "px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1",
                currentPage === totalPages
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-600 hover:bg-white"
              )}
            >
              次へ
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
