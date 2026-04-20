import React from "react";
import { Link } from "@/i18n/navigation";
import {
  ChevronLeft,
  Clock,
  Users,
  Mail,
  Phone,
  Target,
  MapPin,
  Globe,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import Ceramic from "@/components/ui/Ceramic";
import { type Club } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";
import { clubDisplayRepresentative } from "@/lib/i18n-db";
import {
  clubWebsiteHref,
  clubInstagramHref,
  clubTwitterHref,
  clubFacebookHref,
  clubExternalLinkRel,
} from "@/lib/club-contact-urls";

const BRAND_BLUE = "#2454a4";

export default async function RecruitForm({ club }: { club: Club }) {
  const t = await getTranslations("RecruitPage");
  const locale = await getLocale();

  const showPhonePublic = Boolean(club.phone && club.phoneVisibleOnPublicSite);
  const websiteHref = clubWebsiteHref(club.website);
  const instagramHref = clubInstagramHref(club.instagram);
  const twitterHref = clubTwitterHref(club.twitter);
  const facebookHref = clubFacebookHref(club.facebook);
  const tiktokHref = clubWebsiteHref(club.tiktok);
  const mapHref = club.mapUrl ? clubWebsiteHref(club.mapUrl) : null;
  const representative = clubDisplayRepresentative(club, locale);

  const hasContact = Boolean(
    club.email ||
      showPhonePublic ||
      websiteHref ||
      instagramHref ||
      twitterHref ||
      facebookHref ||
      tiktokHref ||
      mapHref ||
      representative,
  );

  const extClass =
    "text-sm font-bold text-sumo-brand underline decoration-sumo-brand/30 underline-offset-2 hover:decoration-sumo-brand break-all";

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans selection:bg-[#2454a4] selection:text-white">
      <section className="relative bg-sumo-brand text-white pt-32 pb-32 md:pb-48 overflow-hidden shadow-xl">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, ${BRAND_BLUE}, #1a3a7a)` }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[18vw] font-black text-white opacity-[0.03] select-none pointer-events-none tracking-tighter mix-blend-overlay">
          JOIN
        </div>

        <div className="container mx-auto max-w-[1280px] relative z-10 px-6 text-center">
          <div className="flex justify-center mb-8">
            <Link
              href={`/clubs/${club.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200 ease-in-out text-white group active:scale-[0.98]"
            >
              <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{t("backToClub")}</span>
            </Link>
          </div>
          <div className="reveal-up delay-100">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight mb-4 md:mb-6 text-white drop-shadow-sm leading-tight">
              {club.name}
            </h1>
            <p className="max-w-xl mx-auto text-white/80 font-medium tracking-wide leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-20 px-4 pb-16 md:-mt-24 md:px-6 md:pb-24 lg:pb-32">
        <div className="container mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Ceramic
                interactive={false}
                className="bg-white border-b-[6px] shadow-lg overflow-hidden p-0"
                style={{ borderBottomColor: BRAND_BLUE }}
              >
                <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                  <Target size={18} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {t("requirementsHeading")}
                  </span>
                </div>
                <div className="p-8 md:p-10">
                  <div className="space-y-8">
                    <div className="flex gap-4 items-start">
                      <div className="mt-1 w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <Clock size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">{t("practiceLocation")}</h4>
                        <p className="text-sm text-gray-600 font-medium">{club.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="mt-1 w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                        <Users size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">{t("recruitTarget")}</h4>
                        <p className="text-sm text-gray-600 font-medium">
                          {club.target || t("targetFallback")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 my-8" />
                  <div className="bg-[#F8FAFC] rounded-md p-4 border border-blue-50">
                    <div className="flex gap-3">
                      <ShieldCheck size={20} className="text-blue-500 mt-0.5 shrink-0" aria-hidden />
                      <div className="text-xs text-gray-500 leading-relaxed font-medium">
                        <p className="mb-1 text-gray-900 font-bold">{t("beginnerNoteTitle")}</p>
                        {t("beginnerNoteBody")}
                      </div>
                    </div>
                  </div>
                </div>
              </Ceramic>
            </div>

            <div className="lg:col-span-7">
              <Ceramic
                interactive={false}
                className="bg-white border-b-[6px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-8 md:p-12 relative overflow-hidden"
                style={{ borderBottomColor: BRAND_BLUE }}
              >
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
                  style={{ backgroundColor: BRAND_BLUE }}
                />
                <div className="relative z-10">
                  <div className="mb-10">
                    <h2 className="text-2xl font-serif font-black text-gray-900 mb-2 flex items-center gap-3">
                      <Mail size={24} className="text-gray-400 shrink-0" /> {t("formTitle")}
                    </h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider pl-9">{t("formSubtitle")}</p>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-sumo-brand/40 pl-4">
                    {t("frozenNoticeBody")}
                  </p>

                  {!hasContact ? (
                    <p className="text-sm text-gray-500 font-medium bg-gray-50 border border-gray-100 rounded-md px-4 py-6 text-center">
                      {t("noContactListed")}
                    </p>
                  ) : (
                    <ul className="space-y-6">
                      {representative && (
                        <li className="flex gap-4 items-start">
                          <div className="mt-0.5 w-10 h-10 rounded-md bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
                            <Users size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              {t("contactRepresentative")}
                            </p>
                            <p className="text-sm font-bold text-gray-900">{representative}</p>
                          </div>
                        </li>
                      )}
                      {club.email && (
                        <li className="flex gap-4 items-start">
                          <div className="mt-0.5 w-10 h-10 rounded-md bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 border border-cyan-100">
                            <Mail size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              {t("labelEmail")}
                            </p>
                            <a href={`mailto:${club.email}`} className={extClass}>
                              {club.email}
                            </a>
                          </div>
                        </li>
                      )}
                      {showPhonePublic && club.phone && (
                        <li className="flex gap-4 items-start">
                          <div className="mt-0.5 w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                            <Phone size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              {t("labelPhone")}
                            </p>
                            <a href={`tel:${club.phone}`} className={extClass}>
                              {club.phone}
                            </a>
                          </div>
                        </li>
                      )}
                      {websiteHref && (
                        <li className="flex gap-4 items-start">
                          <div className="mt-0.5 w-10 h-10 rounded-md bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
                            <Globe size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              {t("contactWebsite")}
                            </p>
                            <a
                              href={websiteHref}
                              target="_blank"
                              rel={clubExternalLinkRel}
                              className={`inline-flex items-center gap-1.5 ${extClass}`}
                            >
                              {websiteHref.replace(/^https?:\/\//, "")}
                              <ExternalLink size={14} className="shrink-0 opacity-60" aria-hidden />
                            </a>
                          </div>
                        </li>
                      )}
                      {instagramHref && (
                        <li className="flex gap-4 items-start">
                          <div className="mt-0.5 w-10 h-10 rounded-md bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                            <Globe size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              {t("contactInstagram")}
                            </p>
                            <a
                              href={instagramHref}
                              target="_blank"
                              rel={clubExternalLinkRel}
                              className={`inline-flex items-center gap-1.5 ${extClass}`}
                            >
                              {t("contactInstagram")}
                              <ExternalLink size={14} className="shrink-0 opacity-60" aria-hidden />
                            </a>
                          </div>
                        </li>
                      )}
                      {twitterHref && (
                        <li className="flex gap-4 items-start">
                          <div className="mt-0.5 w-10 h-10 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                            <Globe size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              {t("contactTwitter")}
                            </p>
                            <a
                              href={twitterHref}
                              target="_blank"
                              rel={clubExternalLinkRel}
                              className={`inline-flex items-center gap-1.5 ${extClass}`}
                            >
                              {t("contactTwitter")}
                              <ExternalLink size={14} className="shrink-0 opacity-60" aria-hidden />
                            </a>
                          </div>
                        </li>
                      )}
                      {facebookHref && (
                        <li className="flex gap-4 items-start">
                          <div className="mt-0.5 w-10 h-10 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                            <Globe size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              {t("contactFacebook")}
                            </p>
                            <a
                              href={facebookHref}
                              target="_blank"
                              rel={clubExternalLinkRel}
                              className={`inline-flex items-center gap-1.5 ${extClass}`}
                            >
                              {t("contactFacebook")}
                              <ExternalLink size={14} className="shrink-0 opacity-60" aria-hidden />
                            </a>
                          </div>
                        </li>
                      )}
                      {tiktokHref && (
                        <li className="flex gap-4 items-start">
                          <div className="mt-0.5 w-10 h-10 rounded-md bg-gray-50 text-gray-800 flex items-center justify-center shrink-0 border border-gray-200">
                            <Globe size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              {t("contactTikTok")}
                            </p>
                            <a
                              href={tiktokHref}
                              target="_blank"
                              rel={clubExternalLinkRel}
                              className={`inline-flex items-center gap-1.5 ${extClass}`}
                            >
                              {t("contactTikTok")}
                              <ExternalLink size={14} className="shrink-0 opacity-60" aria-hidden />
                            </a>
                          </div>
                        </li>
                      )}
                      {mapHref && (
                        <li className="flex gap-4 items-start">
                          <div className="mt-0.5 w-10 h-10 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                            <MapPin size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              {t("contactMap")}
                            </p>
                            <a
                              href={mapHref}
                              target="_blank"
                              rel={clubExternalLinkRel}
                              className={`inline-flex items-center gap-1.5 ${extClass}`}
                            >
                              {t("contactMapLink")}
                              <ExternalLink size={14} className="shrink-0 opacity-60" aria-hidden />
                            </a>
                          </div>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </Ceramic>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
