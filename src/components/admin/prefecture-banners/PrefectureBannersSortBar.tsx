"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SortOrderBar, { type SortMode } from "@/components/admin/ui/SortOrderBar";

const BASE_PATH = "/admin/prefecture-banners";

export default function PrefectureBannersSortBar({ currentSort }: { currentSort: SortMode }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (value: SortMode) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "time") params.set("sort", "time");
        else params.delete("sort"); // 地域順为默认，不写 sort
        const qs = params.toString();
        router.push(qs ? `${BASE_PATH}?${qs}` : BASE_PATH);
    };

    return (
        <div className="flex flex-wrap items-center justify-end gap-4 mb-4">
            <SortOrderBar value={currentSort} onChange={handleChange} />
        </div>
    );
}
