"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Camera,
  ArrowRight,
  Info,
  ChevronLeft,
  UserPlus,
  ExternalLink,
} from "lucide-react";

import { clubsData } from "@/data/clubs";
import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { getSponsorsByPrefecture } from "@/data/sponsorsData";
import ScrollToTop from "@/components/common/ScrollToTop";
import MiniSponsorBanner from "@/components/common/MiniSponsorBanner";
import RikishiTable from "@/components/clubs/RikishiTable";
import ClubCard from "@/components/clubs/ClubCard";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";
import { getPrefectureTheme } from "@/lib/prefectureThemes";

const PrefecturePage = () => {
  const params = useParams();
  const prefSlug = params.pref as string;

  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  const prefData = PREFECTURE_DATABASE[prefSlug];
  const displayData = prefData || {
    name: prefSlug.toUpperCase(),
    introTitle: `${prefSlug}の相撲事情`,
    introText: "現在、この地域の詳細情報は準備中です。",
    bannerImg: "",
    rikishiList: [],
  };

  const filteredClubs = clubsData.filter((club) =>
    club.area.includes(displayData.name),
  );
  const localSponsors = getSponsorsByPrefecture(prefSlug);
  const theme = getPrefectureTheme(prefSlug);

  const featuredClub = filteredClubs.length > 0 ? filteredClubs[0] : null;
  const bannerTitle = featuredClub
    ? `${featuredClub.name}の相撲風景`
    : `${displayData.name}の相撲風景`;
  const magazineLink = featuredClub ? `/magazines/${featuredClub.id}` : "#";
  const recruitLink = featuredClub ? `/clubs/${featuredClub.id}/recruit` : "#";

  const ceramicStyle = {
    borderBottomColor: theme.color,
    boxShadow: `0 4px 10px -2px ${theme.shadow}, 0 2px 4px -2px ${theme.shadow}`,
  };

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="relative pt-40 pb-32 overflow-hidden text-white shadow-xl bg-gray-900 transition-colors duration-500">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b opacity-100",
              theme.gradient,
            )}
          ></div>
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[18vw] font-black text-white opacity-[0.04] select-none pointer-events-none leading-none z-0 mix-blend-overlay uppercase tracking-tighter font-sans">
            {prefSlug}
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="mb-8 reveal-up">
              <Link
                href="/clubs"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase group"
              >
                <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white transition-all duration-300">
                  <ChevronLeft
                    size={14}
                    className="text-current group-hover:text-gray-900 transition-colors"
                  />
                </div>
                Back to Map
              </Link>
            </div>

            <div className="reveal-up delay-100">
              <div className="flex items-center gap-3 mb-4 opacity-80">
                <span className="h-[1px] w-10 bg-white/50"></span>
                <span className="text-xs font-bold tracking-[0.3em] uppercase">
                  Prefecture Info
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-md">
                {displayData.name}
              </h1>
              <p className="text-white/80 font-medium tracking-wide max-w-xl leading-relaxed">
                {displayData.name}の相撲クラブ・道場情報、
                <br className="hidden md:inline" />
                および出身力士のデータベース。
              </p>
            </div>
          </div>
        </section>

        <section className="relative px-6 z-20">
          <div className="container mx-auto max-w-6xl relative -mt-20">
            <Ceramic
              interactive={false}
              className="border border-gray-100 border-b-[6px]"
              style={ceramicStyle}
            >
              <div className="p-8 md:p-12 text-center">
                <div className="mb-8 flex justify-center">
                  <span
                    className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border"
                    style={{
                      backgroundColor: `${theme.color}0D`,
                      color: theme.color,
                      borderColor: `${theme.color}33`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.color }}
                    ></span>
                    Official Top Partners
                  </span>
                </div>
                <div className="max-w-4xl mx-auto">
                  <MiniSponsorBanner />
                </div>
              </div>
            </Ceramic>
          </div>
        </section>

        <section className="relative pb-24 px-6 pt-20">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start flex flex-col gap-8">
                <Ceramic
                  interactive={false}
                  className="p-8 border border-gray-100 border-b-[6px]"
                  style={ceramicStyle}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: theme.color,
                        color: "white",
                      }}
                    >
                      <Info size={16} />
                    </div>
                    {displayData.introTitle}
                  </h3>
                  <p className="text-sm text-gray-500 leading-[1.8] text-justify font-medium">
                    {displayData.introText}
                  </p>
                </Ceramic>

                <Ceramic
                  interactive={false}
                  className="p-0 border border-gray-100 border-b-[6px]"
                  style={ceramicStyle}
                >
                  <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <p className="text-[10px] text-gray-400 tracking-widest font-bold uppercase">
                      Local Supporters
                    </p>
                    <span
                      className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono font-bold shadow-sm"
                      style={{ color: theme.color }}
                    >
                      {localSponsors.length}
                    </span>
                  </div>
                  <div className="relative py-10 bg-white group overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="flex gap-6 animate-infinite-scroll hover:[animation-play-state:paused] w-max px-6">
                      {[...localSponsors, ...localSponsors].map(
                        (sponsor, idx) => (
                          <div
                            key={`${sponsor.id}-${idx}`}
                            className="flex-shrink-0"
                          >
                            <div className="w-40 aspect-[3/4] bg-white rounded-xl border border-gray-100 flex items-center justify-center p-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative group/item">
                              <img
                                src={sponsor.img}
                                alt={sponsor.name}
                                className="w-full h-full rounded-lg object-cover opacity-80 grayscale group-hover/item:opacity-100 group-hover/item:grayscale-0 transition-all duration-500"
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="block py-4 bg-gray-50 text-center border-t border-gray-100 transition-colors group"
                    style={
                      {
                        "--hover-text": theme.color,
                      } as React.CSSProperties
                    }
                  >
                    <span className="text-[10px] font-bold tracking-wider flex items-center justify-center gap-2 relative z-10 text-gray-500 group-hover:text-[var(--hover-text)] transition-colors">
                      スポンサーについてのお問い合わせ
                      <ArrowRight
                        size={10}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </Link>
                </Ceramic>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-12">
                {displayData.bannerImg && (
                  <div
                    className="group relative aspect-[21/9] rounded-2xl overflow-hidden shadow-lg block ceramic-3d-hover ring-1 ring-black/5"
                    style={
                      {
                        "--hover-shadow": theme.shadow,
                      } as React.CSSProperties
                    }
                  >
                    <img
                      src={displayData.bannerImg}
                      alt={bannerTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <Link
                      href={magazineLink}
                      className="absolute inset-0 z-0"
                      aria-label="View Magazine"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 pointer-events-none">
                      <div className="text-white w-full flex justify-between items-end">
                        <div className="pointer-events-auto">
                          <p className="text-[10px] font-bold tracking-widest mb-2 flex items-center gap-2 opacity-80 border-b border-white/30 pb-2 inline-block">
                            <Camera size={12} /> LOCAL FEATURE
                          </p>
                          <p
                            className="font-serif font-bold text-xl md:text-2xl tracking-wide flex items-center gap-2 transition-colors"
                            style={{ color: "white" }}
                          >
                            {bannerTitle}
                            <ArrowRight
                              size={20}
                              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                            />
                          </p>
                        </div>
                        <div className="hidden md:block pointer-events-auto relative z-10">
                          <Link
                            href={recruitLink}
                            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-bold text-xs tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:brightness-110"
                            style={{ backgroundColor: theme.color }}
                          >
                            <UserPlus size={14} />
                            募集中
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 md:hidden pointer-events-auto relative z-10">
                      <Link
                        href={recruitLink}
                        className="flex items-center gap-1 text-white px-3 py-1.5 rounded-full font-bold text-[10px] shadow-md"
                        style={{ backgroundColor: theme.color }}
                      >
                        <UserPlus size={12} />
                        募集中
                      </Link>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200/60">
                    <div>
                      <h2
                        className="text-3xl font-serif font-black flex items-center gap-3"
                        style={{ color: theme.color }}
                      >
                        クラブ一覧
                      </h2>
                      <p className="text-xs text-gray-400 font-bold tracking-widest mt-2 uppercase">
                        Registered Sumo Clubs
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-4xl font-serif font-black"
                        style={{ color: theme.color }}
                      >
                        {filteredClubs.length}
                      </span>
                      <span className="text-xs text-gray-400 font-bold ml-1">
                        件
                      </span>
                    </div>
                  </div>

                  {filteredClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredClubs.map((club, idx) => (
                        <div
                          key={club.id}
                          className="reveal-up"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <ClubCard club={club} accentColor={theme.color} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Ceramic
                      interactive={false}
                      className="p-16 text-center border border-gray-100 border-b-[6px]"
                      style={{ borderBottomColor: theme.color }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{
                          backgroundColor: `${theme.color}1A`,
                          color: theme.color,
                        }}
                      >
                        <MapPin size={24} />
                      </div>
                      <p className="text-gray-400 font-medium">
                        現在、この地域の掲載クラブはありません。
                      </p>
                    </Ceramic>
                  )}
                </div>

                <div>
                  <Ceramic
                    interactive={false}
                    className="p-0 border border-gray-100 border-b-[6px] overflow-hidden"
                    style={ceramicStyle}
                  >
                    <RikishiTable
                      rikishiList={displayData.rikishiList}
                      prefectureName={displayData.name}
                      accentColor={theme.color}
                    />
                  </Ceramic>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-12 overflow-hidden">
          <div
            className={cn("absolute inset-0 bg-gradient-to-b", theme.gradient)}
          ></div>
          <div className="absolute inset-0 opacity-10 bg-[url('/images/bg/noise.png')] mix-blend-overlay pointer-events-none"></div>

          <div className="container mx-auto px-6 relative z-10 text-center text-white">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <MapPin size={24} />
            </div>

            {/* Updated Copy */}
            <h3 className="text-2xl md:text-3xl font-serif font-black mb-4 drop-shadow-md">
              {displayData.name}の相撲文化を深堀り
            </h3>

            <p className="text-white/80 max-w-lg mx-auto mb-8 text-sm font-medium">
              {displayData.name}
              の相撲文化をさらに深く知るための情報を提供しています。
              地域のイベントや活動にもぜひご注目ください。
            </p>

            {/* Animated Button */}
            <Link
              href="/contact"
              className={cn(
                "group inline-flex items-center gap-2 bg-white px-8 py-3 rounded-full font-bold text-sm tracking-wider shadow-lg",
                "transition-all duration-300 ease-out",
                "hover:shadow-xl hover:-translate-y-0.5",
                "active:scale-[0.98] active:translate-y-0 active:shadow-md",
              )}
              style={{ color: theme.color }}
            >
              地域に関するお問い合わせ
              <ExternalLink
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>
      </main>
      <ScrollToTop />
    </div>
  );
};

export default PrefecturePage;
