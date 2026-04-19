"use client";

import React, { useState } from "react";
import Link from "@/components/ui/TransitionLink";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createBrowserClient } from "@supabase/ssr";
import {
  ArrowRight,
  Lock,
  Mail,
  ChevronLeft,
  ShieldCheck,
  HelpCircle,
  Loader2,
  AlertCircle,
  X,
  Building2,
  User,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";
import { loginErrorForLocale } from "@/lib/auth-error-messages";
import { verifyIdentity, resetPassword } from "@/lib/actions/auth-reset";

const CHAMPAGNE_GLASS_BUTTON_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(193, 161, 78, 0.75)",
  borderColor: "rgba(193, 161, 78, 0.5)",
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow: "0 10px 15px -3px rgba(193, 161, 78, 0.25)",
};

function LineBreakText({
  text,
  breakClassName,
}: {
  text: string;
  breakClassName: string;
}) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br className={breakClassName} />}
          {line}
        </React.Fragment>
      ))}
    </>
  );
}

type ViewState = "login" | "verify" | "reset";

const LoginForm = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ManagerLogin");
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [view, setView] = useState<ViewState>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyClubName, setVerifyClubName] = useState("");
  const [verifyName, setVerifyName] = useState("");

  const [verifiedUserId, setVerifiedUserId] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const switchToVerify = () => {
    setView("verify");
    setErrorMsg(null);
    setVerifyEmail("");
    setVerifyClubName("");
    setVerifyName("");
  };

  const switchToLogin = () => {
    setView("login");
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg(t("errorEmpty"));
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg(t("errorInvalidCredentials"));
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMsg(t("errorEmailNotConfirmed"));
        } else if (error.message.includes("missing email")) {
          setErrorMsg(t("errorMissingEmail"));
        } else {
          setErrorMsg(loginErrorForLocale(error.message, locale));
        }
      } else {
        router.refresh();
        router.push("/admin/clubs");
      }
    } catch {
      setErrorMsg(t("errorUnexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await verifyIdentity(
        verifyEmail.trim(),
        verifyClubName.trim(),
        verifyName.trim(),
      );

      if (!result.verified || !result.userId) {
        setErrorMsg(result.error ?? t("errorVerifyMismatch"));
        setIsLoading(false);
        return;
      }

      setVerifiedUserId(result.userId);
      setVerifiedEmail(verifyEmail.trim());
      setNewPassword("");
      setConfirmPassword("");
      setView("reset");
      setErrorMsg(null);
    } catch {
      setErrorMsg(t("errorServer"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg(t("errorPasswordMismatch"));
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg(t("errorPasswordShort"));
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword(verifiedUserId, newPassword);

      if (!result.success) {
        setErrorMsg(result.error ?? t("errorResetFailed"));
        setIsLoading(false);
        return;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: verifiedEmail,
        password: newPassword,
      });

      if (loginError) {
        setErrorMsg(null);
        setEmail(verifiedEmail);
        setPassword("");
        setView("login");
        return;
      }

      router.refresh();
      router.push("/admin/clubs");
    } catch {
      setErrorMsg(t("errorUnexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  const heroTitle =
    view === "login"
      ? t("heroTitleLogin")
      : view === "verify"
        ? t("heroTitleVerify")
        : t("heroTitleReset");

  const heroDescKey =
    view === "login" ? "heroDescLogin" : view === "verify" ? "heroDescVerify" : "heroDescReset";

  return (
    <div className="bg-[#F4F5F7] font-sans flex flex-col selection:bg-sumo-brand selection:text-white">
      <header className="relative bg-sumo-brand text-white pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-linear-to-b from-sumo-brand to-[#2454a4]" />
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none leading-none mix-blend-overlay tracking-tighter font-sans">
          LOGIN
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
          <div className="flex justify-center mb-8">
            {view === "login" ? (
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
            ) : (
              <button
                type="button"
                onClick={switchToLogin}
                className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full transition-all duration-200 ease-in-out text-white group hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                style={CHAMPAGNE_GLASS_BUTTON_STYLE}
                aria-label={t("backLoginAria")}
              >
                <ChevronLeft
                  size={16}
                  className="shrink-0 group-hover:-translate-x-1 transition-transform duration-200 ease-in-out"
                  aria-hidden
                />
                <span className="text-xs font-bold tracking-wide">{t("backLogin")}</span>
              </button>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4 md:mb-6 text-white drop-shadow-sm">
            {heroTitle}
          </h1>

          <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed text-sm md:text-base px-1">
            <LineBreakText text={t(heroDescKey)} breakClassName="hidden md:inline" />
          </p>
        </div>
      </header>

      <section className="relative px-4 md:px-6 z-20 -mt-16 md:-mt-24 pb-12 sm:pb-16 md:pb-24">
        <div className="container mx-auto max-w-5xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden p-0"
          >
            <div className="flex flex-col md:flex-row min-h-0 md:min-h-[520px]">
              <div className="md:w-[38%] bg-[#FAFAFA] border-b border-gray-100 md:border-b-0 md:border-r md:border-gray-100 p-6 md:p-10 lg:p-12 relative overflow-hidden flex flex-col justify-between">
                <button
                  type="button"
                  onClick={() => setShowHelp(true)}
                  className="absolute top-4 right-4 z-20 md:hidden inline-flex items-center gap-1.5 rounded-full border border-gray-200/90 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 shadow-sm backdrop-blur-sm hover:border-sumo-brand/40 hover:text-sumo-brand transition-colors duration-200 ease-in-out"
                >
                  <HelpCircle size={12} className="shrink-0" aria-hidden />
                  {t("help")}
                </button>

                <div className="relative z-10 pr-18 md:pr-0">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sumo-brand shadow-sm mb-5 md:mb-6">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-sumo-dark mb-3 md:mb-4 leading-relaxed">
                    {view === "login" ? t("welcomeTitle") : t("verifySidebarTitle")}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                    <LineBreakText
                      text={view === "login" ? t("sidebarLogin") : t("sidebarVerify")}
                      breakClassName="hidden sm:inline"
                    />
                  </p>
                </div>

                <div className="relative z-10 mt-8 hidden md:mt-10 md:block pt-6 border-t border-gray-200">
                  <div className="w-8 h-1 bg-gray-200 mb-4" />
                  <button
                    type="button"
                    onClick={() => setShowHelp(true)}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-sumo-brand transition-colors duration-200 ease-in-out"
                  >
                    <HelpCircle size={12} className="shrink-0" />
                    {t("help")}
                  </button>
                </div>
              </div>

              <div className="md:w-[62%] bg-white p-5 md:p-12 lg:p-14 relative flex flex-col justify-center">
                {view === "login" && (
                  <>
                    <div className="mb-6 md:mb-10">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-sumo-dark">
                        {t("formLoginTitle")}
                      </h3>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col max-w-sm w-full md:max-w-md md:mx-auto">
                      {errorMsg && (
                        <div className="mb-6 md:mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                          <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                          <p className="text-sm text-red-600 font-bold leading-relaxed">{errorMsg}</p>
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5 pb-8 md:pb-6">
                        <label
                          htmlFor="login-email"
                          className="text-xs font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2"
                        >
                          <Mail size={14} /> {t("labelEmail")}
                        </label>
                        <input
                          type="email"
                          id="login-email"
                          name="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:border-sumo-brand focus:outline-none focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out text-base font-medium text-sumo-dark placeholder-gray-300"
                          placeholder="example@sumome.jp"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 pb-6 md:pb-8">
                        <label
                          htmlFor="login-password"
                          className="text-xs font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2"
                        >
                          <Lock size={14} /> {t("labelPassword")}
                        </label>
                        <input
                          type="password"
                          id="login-password"
                          name="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:border-sumo-brand focus:outline-none focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out text-base font-medium text-sumo-dark placeholder-gray-300"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <div className="relative flex items-center shrink-0">
                            <input
                              type="checkbox"
                              className="peer appearance-none w-3.5 h-3.5 border border-gray-300 rounded-[2px] checked:bg-sumo-brand checked:border-sumo-brand transition-all"
                            />
                            <svg
                              className="absolute inset-0 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                              viewBox="0 0 14 14"
                              fill="none"
                              aria-hidden
                            >
                              <path
                                d="M3 7L5.5 9.5L11 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {t("labelRemember")}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={switchToVerify}
                          className="text-xs font-bold text-gray-400 hover:text-sumo-brand transition-colors uppercase tracking-wider sm:text-right duration-200 ease-in-out"
                        >
                          {t("forgotPassword")}
                        </button>
                      </div>

                      <div className="pt-5 md:pt-8">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={cn(
                            "w-full py-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-3",
                            "bg-sumo-dark text-white hover:bg-sumo-brand active:scale-[0.98]",
                            isLoading ? "opacity-70 cursor-not-allowed" : "",
                          )}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={16} className="animate-spin" /> {t("submitLoggingIn")}
                            </>
                          ) : (
                            <>
                              {t("submitLogin")} <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
                      <p className="text-sm font-medium text-gray-500">
                        {t("signupPrompt")}
                        <Link
                          href="/manager/entry"
                          className="text-sumo-brand font-bold ml-2 hover:underline decoration-sumo-brand/30 underline-offset-4 transition-all"
                        >
                          {t("signupLink")}
                        </Link>
                      </p>
                    </div>
                  </>
                )}

                {view === "verify" && (
                  <>
                    <div className="mb-6 md:mb-10">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-sumo-dark">{t("verifyTitle")}</h3>
                      <p className="mt-2 text-xs md:text-sm text-gray-400 leading-relaxed font-medium">
                        {t("verifySubtitle")}
                      </p>
                    </div>

                    <form onSubmit={handleVerify} className="flex flex-col max-w-sm w-full md:max-w-md md:mx-auto">
                      {errorMsg && (
                        <div className="mb-6 md:mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                          <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                          <p className="text-sm text-red-600 font-bold leading-relaxed">{errorMsg}</p>
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5 pb-8 md:pb-6">
                        <label
                          htmlFor="verify-email"
                          className="text-xs font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2"
                        >
                          <Mail size={14} /> {t("labelEmail")}
                        </label>
                        <input
                          type="email"
                          id="verify-email"
                          required
                          value={verifyEmail}
                          onChange={(e) => setVerifyEmail(e.target.value)}
                          className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:border-sumo-brand focus:outline-none focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out text-base font-medium text-sumo-dark placeholder-gray-300"
                          placeholder={t("phVerifyEmail")}
                        />
                      </div>

                      <div className="group flex flex-col gap-1.5 pb-8 md:pb-6">
                        <label
                          htmlFor="verify-clubName"
                          className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors"
                        >
                          <Building2 size={14} /> {t("labelClubName")}
                        </label>
                        <input
                          type="text"
                          id="verify-clubName"
                          required
                          value={verifyClubName}
                          onChange={(e) => setVerifyClubName(e.target.value)}
                          className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:border-sumo-brand focus:outline-none focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out text-base font-medium text-sumo-dark placeholder-gray-300"
                          placeholder={t("phClubName")}
                        />
                      </div>

                      <div className="group flex flex-col gap-1.5 pb-3 md:pb-6">
                        <label
                          htmlFor="verify-name"
                          className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors"
                        >
                          <User size={14} /> {t("labelRepName")}
                        </label>
                        <input
                          type="text"
                          id="verify-name"
                          required
                          value={verifyName}
                          onChange={(e) => setVerifyName(e.target.value)}
                          className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:border-sumo-brand focus:outline-none focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out text-base font-medium text-sumo-dark placeholder-gray-300"
                          placeholder={t("phRepName")}
                        />
                      </div>

                      <div className="pt-5 md:pt-8">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={cn(
                            "w-full py-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-3",
                            "bg-sumo-dark text-white hover:bg-sumo-brand active:scale-[0.98]",
                            isLoading ? "opacity-70 cursor-not-allowed" : "",
                          )}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={16} className="animate-spin" /> {t("submitVerifying")}
                            </>
                          ) : (
                            <>
                              {t("submitVerify")} <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
                      <p className="text-sm font-medium text-gray-500">
                        {t("verifyFooterPrompt")}
                        <button
                          type="button"
                          onClick={switchToLogin}
                          className="text-sumo-brand font-bold ml-2 hover:underline decoration-sumo-brand/30 underline-offset-4 transition-all"
                        >
                          {t("verifyFooterLogin")}
                        </button>
                      </p>
                    </div>
                  </>
                )}

                {view === "reset" && (
                  <>
                    <div className="mb-6 md:mb-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                          <CheckCircle2 size={16} className="text-green-600" />
                        </div>
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider">{t("resetBadge")}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-sumo-dark">{t("resetTitle")}</h3>
                      <p className="mt-2 text-xs md:text-sm text-gray-400 leading-relaxed font-medium">{t("resetHint")}</p>
                    </div>

                    <form onSubmit={handleReset} className="flex flex-col max-w-sm w-full md:max-w-md md:mx-auto">
                      {errorMsg && (
                        <div className="mb-6 md:mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                          <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                          <p className="text-sm text-red-600 font-bold leading-relaxed">{errorMsg}</p>
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5 pb-8 md:pb-6">
                        <label
                          htmlFor="reset-password"
                          className="text-xs font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2"
                        >
                          <KeyRound size={14} /> {t("labelNewPassword")}
                        </label>
                        <input
                          type="password"
                          id="reset-password"
                          required
                          minLength={8}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:border-sumo-brand focus:outline-none focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out text-base font-medium text-sumo-dark placeholder-gray-300"
                          placeholder={t("phNewPassword")}
                        />
                      </div>

                      <div className="group flex flex-col gap-1.5 pb-3 md:pb-6">
                        <label
                          htmlFor="reset-confirm"
                          className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors"
                        >
                          <Lock size={14} /> {t("labelConfirmPassword")}
                        </label>
                        <input
                          type="password"
                          id="reset-confirm"
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:border-sumo-brand focus:outline-none focus-visible:outline-none ring-0 transition-colors duration-200 ease-in-out text-base font-medium text-sumo-dark placeholder-gray-300"
                          placeholder={t("phConfirmPassword")}
                        />
                      </div>

                      <div className="pt-5 md:pt-8">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={cn(
                            "w-full py-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-3",
                            "bg-sumo-dark text-white hover:bg-sumo-brand active:scale-[0.98]",
                            isLoading ? "opacity-70 cursor-not-allowed" : "",
                          )}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={16} className="animate-spin" /> {t("submitResetting")}
                            </>
                          ) : (
                            <>
                              {t("submitReset")} <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
                      <p className="text-sm font-medium text-gray-500">
                        {t("resetFooterPrompt")}
                        <button
                          type="button"
                          onClick={switchToVerify}
                          className="text-sumo-brand font-bold ml-2 hover:underline decoration-sumo-brand/30 underline-offset-4 transition-all"
                        >
                          {t("resetFooterVerify")}
                        </button>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Ceramic>
        </div>
      </section>

      {showHelp && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-sumo-dark flex items-center gap-2">
                <HelpCircle size={20} className="text-sumo-brand" />
                {t("helpTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="p-2 rounded-xl text-gray-500 hover:bg-sumo-brand/10 hover:text-sumo-brand transition-colors duration-200 ease-in-out"
                aria-label={t("closeAria")}
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <p className="leading-relaxed">{t("helpP1")}</p>
              <p className="leading-relaxed">{t("helpP2")}</p>
              <p className="leading-relaxed">{t("helpP3")}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="px-5 py-2.5 bg-sumo-brand text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all duration-200 ease-in-out active:scale-[0.98]"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
