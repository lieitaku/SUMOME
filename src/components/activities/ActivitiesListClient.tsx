"use client";

import React, { useEffect, useState } from "react";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import {
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 6;

type ActivityItem = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  category: string;
  mainImage: string | null;
  club: { name: string } | null;
};

type ApiResponse = {
  activities: ActivityItem[];
  totalItems: number;
  totalPages: number;
  page: number;
};

export default function ActivitiesListClient({
  initialPage,
}: {
  initialPage: number;
}) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const page = Math.max(1, initialPage);
    setLoading(true);
    setError(null);
    fetch(`/api/activities?page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((d: ApiResponse) => setData(d))
      .catch(() => setError("読み込みに失敗しました。"))
      .finally(() => setLoading(false));
  }, [initialPage]);

  if (error) {
    return (
      <section className="relative py-24 px-6 z-20" id="activity-list-top">
        <div className="container mx-auto max-w-6xl">
          <div className="py-24 text-center text-gray-500 text-sm">{error}</div>
        </div>
      </section>
    );
  }

  if (loading || !data) {
    return (
      <section className="relative py-24 px-6 z-20" id="activity-list-top">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center py-24">
            <span className="inline-block w-10 h-10 border-2 border-sumo-brand/30 border-t-sumo-brand rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  const { activities, totalPages, page: currentPage } = data;

  return (
    <section className="relative py-24 px-6 z-20" id="activity-list-top">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {activities.map((act) => {
            const date = new Date(act.date);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getFullYear();

            return (
              <div key={act.id} className="h-full">
                <Ceramic
                  as={Link}
                  href={`/activities/${act.id}`}
                  interactive={true}
                  className="flex flex-col h-full overflow-hidden p-0 bg-white border-b-sumo-brand md:border-b-gray-200 md:hover:border-b-sumo-brand"
                >
                  <div className="relative aspect-[3/4] bg-gray-100 group">
                    <Image
                      src={act.mainImage || "/images/placeholder.jpg"}
                      alt={act.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 text-center shadow-lg rounded-sm border-t-2 border-sumo-brand z-10">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                        {month}月
                      </span>
                      <span className="block text-xl font-serif font-black text-sumo-dark leading-none">
                        {day}
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-sumo-dark text-white text-[10px] font-bold px-3 py-1.5 tracking-widest uppercase">
                      {act.category}
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow p-6 group">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 leading-relaxed group-hover:text-sumo-brand transition-colors line-clamp-2">
                      {act.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-6 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-sumo-brand" />
                        <span className="line-clamp-1">
                          {act.location || act.club?.name}
                        </span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span>{year}.{month < 10 ? `0${month}` : month}.{day < 10 ? `0${day}` : day}</span>
                    </div>
                    <div className="w-full h-px bg-gray-100 mb-4"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-[0.1em] text-gray-400 group-hover:text-sumo-brand transition-colors uppercase">
                        View Details
                      </span>
                      <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-sumo-brand group-hover:bg-sumo-brand transition-all duration-300">
                        <ArrowRight size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Ceramic>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-24 flex justify-center items-center gap-3">
            <Link
              href={`/activities?page=${currentPage - 1}`}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all",
                currentPage === 1 ? "pointer-events-none opacity-20" : "hover:bg-white hover:shadow-md text-gray-500"
              )}
            >
              <ChevronLeft size={16} />
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/activities?page=${page}`}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold font-serif transition-all",
                  currentPage === page ? "bg-sumo-dark text-white shadow-lg scale-110" : "text-gray-500 hover:bg-white"
                )}
              >
                {page}
              </Link>
            ))}

            <Link
              href={`/activities?page=${currentPage + 1}`}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all",
                currentPage === totalPages ? "pointer-events-none opacity-20" : "hover:bg-white hover:shadow-md text-gray-500"
              )}
            >
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
