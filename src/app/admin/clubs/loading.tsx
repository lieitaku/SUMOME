import React from "react";

export default function AdminClubsLoading() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-56 bg-gray-100 rounded" />
                </div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg" />
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="h-10 max-w-md bg-gray-100 rounded-lg" />
                <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-8 w-20 bg-gray-100 rounded-lg" />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                        <div className="h-5 w-2/3 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-100 rounded" />
                        <div className="h-4 w-1/2 bg-gray-100 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
