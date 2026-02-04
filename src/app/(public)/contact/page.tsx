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
  Send,
  AlertCircle,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";
import { createInquiry } from "@/lib/actions/inquiries";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 表单数据状态
  const [formData, setFormData] = useState({
    name: "",
    furigana: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createInquiry(formData);

      if (result.success) {
        setIsSent(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(result.error || "送信に失敗しました");
      }
    } catch {
      setError("送信中にエラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans flex flex-col selection:bg-sumo-brand selection:text-white">
      {/* ==================== 1. Header (纯净碧空) ==================== */}
      <header className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
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
          CONTACT
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 reveal-up">
            <Send size={12} className="text-white" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
              Get in Touch
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6 text-white drop-shadow-sm reveal-up delay-100">
            お問い合わせ
          </h1>

          <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200">
            クラブへの参加希望、取材のご依頼、その他ご質問など、<br />担当者からご連絡いたします。
          </p>
        </div>
      </header>

      {/* ==================== 2. Main Form Section (雅致白瓷) ==================== */}
      <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
        <div className="container mx-auto max-w-6xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-0"
          >
            <div className="flex flex-col lg:flex-row min-h-[700px]">
              {/* --- A. Left Side: Info Panel (改为淡雅灰白) --- */}
              <div className="lg:w-1/3 bg-[#FAFAFA] border-r border-gray-100 p-10 md:p-14 relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  {/* 标题 */}
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-10 border-b border-gray-200 pb-4">
                    Contact Info
                  </h3>

                  <div className="space-y-10">
                    {/* Address */}
                    <div className="group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center text-sumo-brand shadow-sm mt-1">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-sumo-dark mb-2">
                            所在地
                          </h4>
                          <p className="text-gray-500 leading-relaxed text-sm font-medium">
                            〒103-0016
                            <br />
                            東京都中央区日本橋小網町4-94-9
                            <br />
                            恵和ビル 3F
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center text-sumo-brand shadow-sm">
                          <Mail size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-sumo-dark mb-2">
                            メール
                          </h4>
                          <a
                            href="mailto:info@sumome.jp"
                            className="text-gray-500 hover:text-sumo-brand transition-colors text-sm font-mono border-b border-transparent hover:border-sumo-brand pb-0.5"
                          >
                            info@sumome.jp
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center text-sumo-brand shadow-sm">
                          <Phone size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-sumo-dark mb-2">
                            電話番号
                          </h4>
                          <a
                            href="tel:03-1234-5678"
                            className="text-gray-500 hover:text-sumo-brand transition-colors text-sm font-mono border-b border-transparent hover:border-sumo-brand pb-0.5"
                          >
                            000-1234-5678
                          </a>
                          <p className="text-[10px] text-gray-400 mt-1 font-bold">
                            平日 10:00 - 18:00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部 Logo / 装饰 */}
                <div className="relative z-10 mt-12 lg:mt-0">
                  <div className="w-8 h-1 bg-sumo-gold mb-3"></div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    Sumome Official
                  </p>
                </div>
              </div>

              {/* --- B. Right Side: The Form (纯白输入区) --- */}
              <div className="lg:w-2/3 bg-white p-8 md:p-14 lg:p-16 relative">
                {isSent ? (
                  // --- Success State ---
                  <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-sumo-dark mb-4">
                      お問い合わせ完了
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-md leading-relaxed font-medium">
                      お問い合わせありがとうございます。
                      <br />
                      内容を確認の上、担当者より2営業日以内にご連絡させていただきます。
                    </p>
                    <Link href="/">
                      <button className="px-8 py-3 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest rounded hover:bg-sumo-brand hover:text-white transition-all">
                        トップページへ戻る
                      </button>
                    </Link>
                  </div>
                ) : (
                  // --- Form State ---
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="mb-10 border-b border-gray-100 pb-6">
                      <h3 className="text-2xl font-serif font-bold text-sumo-dark mb-2">
                        入力フォーム
                      </h3>
                      <p className="text-sm text-gray-400 font-medium">
                        以下の項目にご記入ください（
                        <span className="text-sumo-red">*</span>は必須項目）
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    {/* Name & Furigana */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3 group">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                          <User size={12} /> お名前{" "}
                          <span className="text-sumo-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="相撲 太郎"
                          className="w-full h-12 px-4 bg-gray-50 border-b-2 border-gray-200 rounded-t-sm focus:outline-none focus:border-sumo-brand focus:bg-sumo-brand/[0.02] transition-all font-medium text-sumo-dark placeholder-gray-300"
                        />
                      </div>
                      <div className="space-y-3 group">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                          フリガナ
                        </label>
                        <input
                          type="text"
                          name="furigana"
                          value={formData.furigana}
                          onChange={handleInputChange}
                          placeholder="スモウ タロウ"
                          className="w-full h-12 px-4 bg-gray-50 border-b-2 border-gray-200 rounded-t-sm focus:outline-none focus:border-sumo-brand focus:bg-sumo-brand/[0.02] transition-all font-medium text-sumo-dark placeholder-gray-300"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3 group">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                          <AtSign size={12} /> メールアドレス{" "}
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
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                          <Phone size={12} /> 電話番号
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

                    {/* Inquiry Type */}
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Building2 size={12} /> お問い合わせ種別{" "}
                        <span className="text-sumo-red">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          "クラブ参加・見学について",
                          "取材・メディア関連",
                          "協賛・スポンサーについて",
                          "その他",
                        ].map((type) => (
                          <label
                            key={type}
                            className={cn(
                              "relative flex items-center gap-3 p-4 border rounded cursor-pointer hover:border-sumo-brand/50 hover:bg-gray-50 transition-all group",
                              formData.inquiryType === type
                                ? "border-sumo-brand bg-sumo-brand/[0.04] shadow-sm"
                                : "border-gray-200"
                            )}
                          >
                            <input
                              type="radio"
                              name="inquiryType"
                              value={type}
                              checked={formData.inquiryType === type}
                              onChange={() => handleRadioChange(type)}
                              required
                              className="w-4 h-4 accent-sumo-brand border-gray-300"
                            />
                            <span className={cn(
                              "text-sm font-bold",
                              formData.inquiryType === type ? "text-sumo-dark" : "text-gray-600"
                            )}>
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-3 group">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                        <MessageSquare size={12} /> お問い合わせ内容{" "}
                        <span className="text-sumo-red">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="ご質問やご相談内容をご記入ください"
                        className="w-full p-4 bg-gray-50 border-b-2 border-gray-200 rounded-t-sm focus:outline-none focus:border-sumo-brand focus:bg-sumo-brand/[0.02] transition-all font-medium text-sumo-dark placeholder-gray-300 resize-none"
                      ></textarea>
                    </div>

                    {/* Submit Action */}
                    <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                      <p className="text-xs text-gray-400 text-center md:text-left leading-relaxed">
                        <a
                          href="/privacy"
                          className="underline decoration-gray-300 hover:text-sumo-brand hover:decoration-sumo-brand transition-all"
                        >
                          プライバシーポリシー
                        </a>
                        に同意の上、
                        <br className="hidden md:inline" />
                        送信してください。
                      </p>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "group relative overflow-hidden px-10 py-4 bg-sumo-dark text-white text-xs font-bold uppercase tracking-widest rounded shadow-lg transition-all",
                          isSubmitting
                            ? "opacity-80 cursor-not-allowed"
                            : "hover:bg-sumo-brand hover:-translate-y-1 hover:shadow-xl",
                        )}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isSubmitting ? "送信中..." : "送信する"}
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
