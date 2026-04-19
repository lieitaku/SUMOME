"use client";

import React, { useState, useRef } from "react";
import Link from "@/components/ui/TransitionLink";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createBrowserClient } from "@supabase/ssr";
import {
  Building2,
  User,
  Mail,
  Lock,
  ArrowRight,
  Check,
  ShieldCheck,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

import { signUp, type SignUpState } from "@/lib/actions/auth-signup";
import { loginErrorForLocale } from "@/lib/auth-error-messages";

const CHAMPAGNE_GLASS_BUTTON_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(193, 161, 78, 0.75)",
  borderColor: "rgba(193, 161, 78, 0.5)",
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow: "0 10px 15px -3px rgba(193, 161, 78, 0.25)",
};

const RegistrationForm = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ManagerEntry");
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<SignUpState>({});

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setState({});

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    let result: SignUpState;
    try {
      result = await signUp({}, formData);
    } catch (err) {
      console.error("Registration signUp Server Action failed:", err);
      setState({
        message: t("errorNetwork"),
      });
      setIsSubmitting(false);
      return;
    }

    if (!result.success) {
      setState(result);
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setState({
          message: t("msgCreatedLoginIssue", {
            detail: loginErrorForLocale(loginError.message, locale),
          }),
          inputs: result.inputs,
        });
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Registration signInWithPassword failed:", err);
      setState({
        message: t("msgCreatedAutoLoginFailed"),
        inputs: result.inputs,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      router.refresh();
      router.push("/admin/clubs");
    } catch (err) {
      console.error("Registration navigation failed:", err);
      setState({
        message: t("msgNavFailed"),
        inputs: result.inputs,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4F5F7] font-sans flex flex-col selection:bg-sumo-brand selection:text-white">
      <header className="relative bg-sumo-brand text-white pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]" />
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none leading-none mix-blend-overlay tracking-tighter font-sans">
          JOIN
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center md:text-left">
          <div className="flex justify-center mb-6 md:mb-8">
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full transition-all duration-200 ease-in-out text-white group hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              style={CHAMPAGNE_GLASS_BUTTON_STYLE}
              aria-label={t("backPartnersAria")}
            >
              <ChevronLeft
                size={16}
                className="shrink-0 group-hover:-translate-x-1 transition-transform duration-200 ease-in-out"
                aria-hidden
              />
              <span className="text-xs font-bold tracking-wide">{t("backPartners")}</span>
            </Link>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4 md:mb-6 text-white drop-shadow-sm reveal-up delay-100 text-center">
            {t("heroTitle")}
          </h1>

          <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200 text-center">
            {t("heroLine1")}
            <br className="hidden md:inline" />
            {t("heroLine2")}
          </p>
        </div>
      </header>

      <section className="relative px-4 md:px-6 z-20 -mt-16 md:-mt-24 pb-12 sm:pb-16 md:pb-24">
        <div className="container mx-auto max-w-5xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden p-0"
          >
            <div className="flex flex-col-reverse lg:flex-row min-h-0 lg:min-h-[700px]">
              <div className="lg:w-5/12 bg-[#FAFAFA] border-r border-gray-100 p-6 md:p-14 relative overflow-hidden flex flex-col">
                <div className="relative z-10 flex-grow">
                  <div className="mb-6 md:mb-10 flex flex-col-reverse md:flex-col gap-4 md:gap-0 md:border-b md:border-gray-200 md:pb-4">
                    <span className="inline-flex w-fit items-center justify-center px-3 py-1 bg-sumo-brand/10 text-sumo-brand text-[10px] font-bold tracking-widest uppercase rounded-full">
                      {t("sideBadge")}
                    </span>
                    <div className="w-full border-b border-gray-200 md:hidden" aria-hidden />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-sumo-dark mb-5 md:mb-8 leading-tight">
                    {t("sideTitleLine1")}
                    <br />
                    {t("sideTitleLine2")}
                  </h2>

                  <div className="space-y-4 md:space-y-8">
                    {(
                      [
                        { title: t("benefit1Title"), desc: t("benefit1Desc") },
                        { title: t("benefit2Title"), desc: t("benefit2Desc") },
                        { title: t("benefit3Title"), desc: t("benefit3Desc") },
                      ] as const
                    ).map((item, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div
                          className={cn(
                            "mt-1 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-sm shrink-0",
                            "bg-sumo-brand text-white",
                            "md:group-hover:scale-110 md:group-hover:shadow-md",
                          )}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 mb-1 group-hover:text-sumo-brand transition-colors duration-200 ease-in-out">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 opacity-60">
                    <ShieldCheck size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{t("sideFootnote")}</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-7/12 bg-white p-6 md:p-14 lg:p-16 relative">
                <div className="mb-8 md:mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-sumo-brand rounded-md text-[10px] font-bold tracking-widest uppercase mb-4 border border-blue-100">
                    <User size={12} />
                    {t("formBadge")}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-black text-sumo-dark tracking-tight">{t("formTitle")}</h3>
                  <p className="text-sm text-gray-500 mt-3 font-medium leading-relaxed">{t("formSubtitle")}</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col">
                  {state?.message && (
                    <div className="mb-6 md:mb-8 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                      ⚠️ {state.message}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 pb-8 md:pb-6">
                    <label
                      htmlFor="reg-clubName"
                      className="text-xs font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2"
                    >
                      <Building2 size={14} /> {t("labelClubName")} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="reg-clubName"
                      name="clubName"
                      type="text"
                      required
                      defaultValue={state?.inputs?.clubName}
                      placeholder={t("phClubName")}
                      className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out font-medium text-base text-sumo-dark placeholder-gray-300"
                    />
                    {state?.error?.clubName && (
                      <p className="text-red-500 text-xs font-bold">{state.error.clubName[0]}</p>
                    )}
                  </div>

                  <div className="group flex flex-col gap-1.5 pb-8 md:pb-6">
                    <label
                      htmlFor="reg-name"
                      className="text-xs font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2 transition-colors"
                    >
                      <User size={14} /> {t("labelRepName")} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="reg-name"
                      name="name"
                      type="text"
                      required
                      defaultValue={state?.inputs?.name}
                      placeholder={t("phRepName")}
                      className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out font-medium text-base text-sumo-dark placeholder-gray-300"
                    />
                    {state?.error?.name && <p className="text-red-500 text-xs font-bold">{state.error.name[0]}</p>}
                  </div>

                  <div className="group flex flex-col gap-1.5 pb-8 md:pb-7">
                    <label
                      htmlFor="reg-email"
                      className="text-xs font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2 transition-colors"
                    >
                      <Mail size={14} /> {t("labelEmail")} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      required
                      defaultValue={state?.inputs?.email}
                      placeholder="example@sumome.jp"
                      className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out font-medium text-base text-sumo-dark placeholder-gray-300"
                    />
                    {state?.error?.email && <p className="text-red-500 text-xs font-bold">{state.error.email[0]}</p>}
                  </div>

                  <div className="group flex flex-col gap-1.5 pb-3 md:pb-7">
                    <label
                      htmlFor="reg-password"
                      className="text-xs font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2 transition-colors"
                    >
                      <Lock size={14} /> {t("labelPassword")} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="reg-password"
                      name="password"
                      type="password"
                      required
                      placeholder={t("phPassword")}
                      className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out font-medium text-base text-sumo-dark placeholder-gray-300"
                    />
                    {state?.error?.password && (
                      <p className="text-red-500 text-xs font-bold">{state.error.password[0]}</p>
                    )}
                  </div>

                  <div className="pt-1 md:pt-8">
                    <div className="mb-6">
                      <div className="flex items-center gap-1.5 mb-2 text-gray-500 font-bold text-xs">
                        <ShieldCheck size={14} className="text-sumo-brand/80" />
                        {t("consentLead")}
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed pl-5">
                        {t.rich("consentLine", {
                          terms: (chunks) => (
                            <Link href="/terms" className="underline hover:text-sumo-brand transition-colors duration-200 ease-in-out">
                              {chunks}
                            </Link>
                          ),
                          privacy: (chunks) => (
                            <Link href="/privacy" className="underline hover:text-sumo-brand transition-colors duration-200 ease-in-out">
                              {chunks}
                            </Link>
                          ),
                        })}
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full py-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-3",
                        "bg-sumo-dark text-white hover:bg-sumo-brand active:scale-[0.98]",
                        isSubmitting ? "opacity-70 cursor-not-allowed" : "",
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> {t("submitting")}
                        </>
                      ) : (
                        <>
                          {t("submit")}
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
                  <p className="text-sm font-medium text-gray-500">
                    {t("footerPrompt")}
                    <Link
                      href="/manager/login"
                      className="text-sumo-brand font-bold ml-2 hover:underline tracking-wide"
                    >
                      {t("footerLogin")}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </Ceramic>
        </div>
      </section>
    </div>
  );
};

export default RegistrationForm;
