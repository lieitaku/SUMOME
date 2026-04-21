import React from "react";

/** 与列表页 Content 顶部工具栏布局一致：视图切换 + 排序占位 */
export function MagazineListToolbarSkeleton() {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div
                className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit"
                aria-hidden
            >
                <div className="h-10 w-24 bg-white rounded-lg shadow-sm animate-pulse" />
                <div className="h-10 w-24 rounded-lg bg-gray-200/80 animate-pulse" />
            </div>
            <div className="h-10 min-w-[200px] flex-1 max-w-xs bg-gray-100 rounded-xl animate-pulse" />
        </div>
    );
}

/** 列表视图表格骨架（与 MagazinesListClient 表格列结构对应） */
export function MagazineListTableSkeleton({ rows = 10 }: { rows?: number }) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 w-[88px]" scope="col">
                                <span className="sr-only">表紙</span>
                                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" aria-hidden />
                            </th>
                            <th className="px-6 py-4" scope="col">
                                <span className="sr-only">タイトル</span>
                                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" aria-hidden />
                            </th>
                            <th className="px-6 py-4" scope="col">
                                <span className="sr-only">発行日</span>
                                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" aria-hidden />
                            </th>
                            <th className="px-6 py-4" scope="col">
                                <span className="sr-only">地域</span>
                                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" aria-hidden />
                            </th>
                            <th className="px-6 py-4" scope="col">
                                <span className="sr-only">状態</span>
                                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" aria-hidden />
                            </th>
                            <th className="px-6 py-4 text-right" scope="col">
                                <span className="sr-only">操作</span>
                                <div
                                    className="h-3 w-12 bg-gray-200 rounded animate-pulse ml-auto"
                                    aria-hidden
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {Array.from({ length: rows }).map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4">
                                    <div
                                        className="w-12 h-16 bg-gray-200 rounded-lg animate-pulse border border-gray-100"
                                        aria-hidden
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-2">
                                        <div className="h-4 w-full max-w-[280px] bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 w-32 max-w-full bg-gray-100 rounded animate-pulse" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" aria-hidden />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" aria-hidden />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-7 w-20 bg-gray-100 rounded-full animate-pulse" aria-hidden />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-3" aria-hidden>
                                        <div className="h-10 w-10 bg-gray-100 rounded-lg animate-pulse" />
                                        <div className="h-10 w-10 bg-gray-100 rounded-lg animate-pulse" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/** 雑誌（卡片）视图骨架 */
export function MagazineListGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
                >
                    <div className="aspect-3/4 bg-gray-200 animate-pulse" />
                    <div className="p-6 space-y-3">
                        <div className="flex gap-2">
                            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                            <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
                        </div>
                        <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
                        <div className="pt-4 border-t border-gray-50 flex justify-between">
                            <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
                            <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function MagazineListLoadingSkeleton({
    variant = "list",
}: {
    variant?: "list" | "grid";
}) {
    return (
        <div className="transition-opacity duration-200 ease-in-out">
            <MagazineListToolbarSkeleton />
            {variant === "list" ? (
                <MagazineListTableSkeleton />
            ) : (
                <MagazineListGridSkeleton />
            )}
        </div>
    );
}
