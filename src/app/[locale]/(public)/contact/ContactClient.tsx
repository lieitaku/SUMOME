"use client";

import React, { useState } from "react";
import Link from "@/components/ui/TransitionLink";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  User,
  AtSign,
  Building2,
  AlertCircle,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";
import { createInquiry } from "@/lib/actions/inquiries";
import { CAPTCHA_VERIFY_FAILED } from "@/lib/captcha-constants";
import {
  executeRecaptcha,
  isRecaptchaSiteKeyConfigured,
} from "@/lib/recaptcha-client";
import { useRecaptchaLoader } from "@/hooks/useRecaptchaLoader";
import { useTranslations } from "next-intl";

const INQUIRY_TYPE_IDS = ["club_visit", "media", "sponsor", "other"] as const;
type InquiryTypeId = (typeof INQUIRY_TYPE_IDS)[number];

const ContactPage = () => {
  const t = useTranslations("Contact");
  const { ready: recaptchaReady } = useRecaptchaLoader();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    furigana: "",
    email: "",
    phone: "",
    inquiryTypeId: "" as "" | InquiryTypeId,
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: InquiryTypeId) => {
    setFormData((prev) => ({ ...prev, inquiryTypeId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecaptchaSiteKeyConfigured() && !recaptchaReady) {
      setError(t("captchaLoading"));
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      let recaptchaToken: string | undefined;
      if (isRecaptchaSiteKeyConfigured()) {
        const tok = await executeRecaptcha("contact");
        if (!tok) {
          setError(t("errorCaptcha"));
          return;
        }
        recaptchaToken = tok;
      }

      const inquiryType = t(`inquiryStorage_${formData.inquiryTypeId}`);
      const result = await createInquiry({
        name: formData.name,
        furigana: formData.furigana,
        email: formData.email,
        phone: formData.phone,
        inquiryType,
        message: formData.message,
        recaptchaToken,
      });

      if (result.success) {
        setIsSent(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (result.error === CAPTCHA_VERIFY_FAILED) {
        setError(t("errorCaptcha"));
      } else {
        setError(result.error || t("errorSendFailed"));
      }
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const addressLines = t("addressLines").split("\n");

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans flex flex-col selection:bg-sumo-brand selection:text-white">
      {/* ==================== 1. Header (纯净碧空) ==================== */}
      <header className="relative bg-sumo-brand text-white pt-32 pb-20 md:pb-48 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none leading-none mix-blend-overlay tracking-tighter font-sans">
          {t("watermark")}
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6 text-white drop-shadow-sm reveal-up delay-100">
            {t("heroTitle")}
          </h1>

          <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200">
            {t("heroLead")}
          </p>
        </div>
      </header>

      {/* ==================== 2. Main Form Section (雅致白瓷) ==================== */}
      <section className="relative px-4 md:px-6 z-20 -mt-10 md:-mt-24 pb-32">
        <div className="container mx-auto max-w-6xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-0"
          >
            <div className="flex flex-col lg:flex-row min-h-[700px]">
              {/* --- A. Left Side: Info Panel --- */}
              <div className="lg:w-1/3 bg-[#FAFAFA] border-r border-gray-100 p-10 md:p-14 relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <h3 className="text-sm md:text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-10 border-b border-gray-200 pb-4">
                    {t("sideHeading")}
                  </h3>

                  <div className="space-y-10">
                    <div className="group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center text-sumo-brand shadow-sm mt-1">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h4 className="text-base md:text-sm font-bold text-sumo-dark mb-2">
                            {t("addressHeading")}
                          </h4>
                          <p className="text-gray-500 leading-relaxed text-base md:text-sm font-medium">
                            {addressLines.map((line, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && <br />}
                                {line}
                              </React.Fragment>
                            ))}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center text-sumo-brand shadow-sm">
                          <Mail size={18} />
                        </div>
                        <div>
                          <h4 className="text-base md:text-sm font-bold text-sumo-dark mb-2">
                            {t("emailHeading")}
                          </h4>
                          <a
                            href="mailto:info@memory-pb.com"
                            className="text-gray-500 hover:text-sumo-brand transition-colors text-base md:text-sm font-mono border-b border-transparent hover:border-sumo-brand pb-0.5"
                          >
                            info@memory-pb.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-12 lg:mt-0">
                  <div className="w-8 h-1 bg-sumo-gold mb-3"></div>
                  <p className="text-xs md:text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    {t("officialLine")}
                  </p>
                </div>
              </div>

              {/* --- B. Right Side: The Form (纯白输入区) --- */}
              <div className="lg:w-2/3 bg-white p-8 md:p-14 lg:p-16 relative">
                {isSent ? (
                  <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-sumo-dark mb-4">
                      {t("successTitle")}
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-md leading-relaxed font-medium">
                      {t("successBody")}
                    </p>
                    <Link href="/">
                      <button className="px-8 py-3 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest rounded hover:bg-sumo-brand hover:text-white transition-all">
                        {t("successHome")}
                      </button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="mb-10 border-b border-gray-100 pb-6">
                      <h3 className="text-2xl font-serif font-bold text-sumo-dark mb-2">
                        {t("formTitle")}
                      </h3>
                      <p className="text-base md:text-sm text-gray-400 font-medium">
                        {t("formHint")}
                      </p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-base md:text-sm">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3 group">
                        <label className="text-sm md:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                          <User size={12} /> {t("fieldName")}{" "}
                          <span className="text-sumo-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder={t("placeholderName")}
                          className="w-full h-12 px-4 bg-gray-50 border-b-2 border-gray-200 rounded-t-sm focus:outline-none focus:border-sumo-brand focus:bg-sumo-brand/[0.02] transition-all font-medium text-sumo-dark placeholder-gray-300"
                        />
                      </div>
                      <div className="space-y-3 group">
                        <label className="text-sm md:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                          {t("fieldFurigana")}
                        </label>
                        <input
                          type="text"
                          name="furigana"
                          value={formData.furigana}
                          onChange={handleInputChange}
                          placeholder={t("placeholderFurigana")}
                          className="w-full h-12 px-4 bg-gray-50 border-b-2 border-gray-200 rounded-t-sm focus:outline-none focus:border-sumo-brand focus:bg-sumo-brand/[0.02] transition-all font-medium text-sumo-dark placeholder-gray-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3 group">
                        <label className="text-sm md:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                          <AtSign size={12} /> {t("fieldEmail")}{" "}
                          <span className="text-sumo-red">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="example@sumome.jp"
                          className="w-full h-12 px-4 bg-gray-50 border-b-2 border-gray-200 rounded-t-sm focus:outline-none focus:border-sumo-brand focus:bg-sumo-brand/[0.02] transition-all font-medium text-sumo-dark placeholder-gray-300"
                        />
                      </div>
                      <div className="space-y-3 group">
                        <label className="text-sm md:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                          <Phone size={12} /> {t("fieldPhone")}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="090-1234-5678"
                          className="w-full h-12 px-4 bg-gray-50 border-b-2 border-gray-200 rounded-t-sm focus:outline-none focus:border-sumo-brand focus:bg-sumo-brand/[0.02] transition-all font-medium text-sumo-dark placeholder-gray-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm md:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Building2 size={12} /> {t("fieldInquiryType")}{" "}
                        <span className="text-sumo-red">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {INQUIRY_TYPE_IDS.map((id) => {
                          const label = t(`inquiryType_${id}`);
                          return (
                            <label
                              key={id}
                              className={cn(
                                "relative flex items-center gap-3 p-4 border rounded cursor-pointer hover:border-sumo-brand/50 hover:bg-gray-50 transition-all group",
                                formData.inquiryTypeId === id
                                  ? "border-sumo-brand bg-sumo-brand/[0.04] shadow-sm"
                                  : "border-gray-200"
                              )}
                            >
                              <input
                                type="radio"
                                name="inquiryTypeId"
                                value={id}
                                checked={formData.inquiryTypeId === id}
                                onChange={() => handleRadioChange(id)}
                                required
                                className="w-4 h-4 accent-sumo-brand border-gray-300"
                              />
                              <span className={cn(
                                "text-base md:text-sm font-bold",
                                formData.inquiryTypeId === id ? "text-sumo-dark" : "text-gray-600"
                              )}>
                                {label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3 group">
                      <label className="text-sm md:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                        <MessageSquare size={12} /> {t("fieldMessage")}{" "}
                        <span className="text-sumo-red">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder={t("placeholderMessage")}
                        className="w-full p-4 bg-gray-50 border-b-2 border-gray-200 rounded-t-sm focus:outline-none focus:border-sumo-brand focus:bg-sumo-brand/[0.02] transition-all font-medium text-sumo-dark placeholder-gray-300 resize-none"
                      ></textarea>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                      {process.env.NODE_ENV === "development" &&
                        !isRecaptchaSiteKeyConfigured() && (
                          <p className="text-sm md:text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-md p-4 leading-relaxed">
                            {t("devCaptchaHint")}
                          </p>
                        )}
                      {isRecaptchaSiteKeyConfigured() && (
                        <p className="text-sm md:text-xs text-gray-400 leading-relaxed">
                          {t.rich("recaptchaLegal", {
                            privacy: (chunks) => (
                              <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-gray-300 hover:text-sumo-brand"
                              >
                                {chunks}
                              </a>
                            ),
                            terms: (chunks) => (
                              <a
                                href="https://policies.google.com/terms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-gray-300 hover:text-sumo-brand"
                              >
                                {chunks}
                              </a>
                            ),
                          })}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <p className="text-sm md:text-xs text-gray-400 text-center md:text-left leading-relaxed">
                        {t.rich("privacyConsent", {
                          privacy: (chunks) => (
                            <Link
                              href="/privacy"
                              className="underline decoration-gray-300 hover:text-sumo-brand hover:decoration-sumo-brand transition-all"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </p>

                      <button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          (isRecaptchaSiteKeyConfigured() && !recaptchaReady)
                        }
                        className={cn(
                          "group relative overflow-hidden px-10 py-4 bg-sumo-dark text-white text-sm md:text-xs font-bold uppercase tracking-widest rounded shadow-lg transition-all duration-200 ease-in-out",
                          isSubmitting ||
                            (isRecaptchaSiteKeyConfigured() && !recaptchaReady)
                            ? "opacity-50 grayscale cursor-not-allowed"
                            : "hover:bg-sumo-brand hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]",
                        )}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isSubmitting ? t("submitting") : t("submit")}
                          {!isSubmitting && (
                            <ArrowRight
                              size={14}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          )}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Ceramic>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
