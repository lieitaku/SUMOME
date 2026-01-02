"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import WaveDivider from "@/components/home/WaveDivider";
import Button from "@/components/ui/Button";

const ContactPage = () => {
  // 模拟表单提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // 模拟网络请求
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="bg-sumo-bg min-h-screen font-sans flex flex-col">
      {/* ==================== 1. Hero Section (保持全站统一的高级感) ==================== */}
      <section className="relative pt-40 pb-32 bg-sumo-dark text-white overflow-hidden">
        {/* 背景纹理 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay z-0"
          style={{
            backgroundImage: "url('/images/bg/washi.png')",
            backgroundRepeat: "repeat",
          }}
        ></div>

        {/* 装饰光晕 */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-sumo-brand/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 text-center relative z-10 reveal-up">
          <p className="text-sumo-gold text-xs font-bold tracking-[0.3em] mb-4 uppercase">
            CONTACT US
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            お問い合わせ
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-loose font-medium">
            クラブへの参加希望、取材のご依頼、その他ご質問など
            <br />
            お気軽にお問い合わせください。
          </p>
        </div>
      </section>

      {/* ==================== 2. Main Form Section (悬浮信纸) ==================== */}
      <section className="relative pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl relative z-10 -mt-20">
          <div className="bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* --- Left Side: Contact Info (侧边栏名片) --- */}
            <div className="lg:w-1/3 bg-[#1B1C24] text-white p-10 md:p-12 relative overflow-hidden">
              {/* 纹理背景 */}
              <div className="absolute inset-0 opacity-10 bg-[url('/images/bg/washi.png')] mix-blend-overlay pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-sumo-gold"></div>

              <h3 className="text-xl font-serif font-bold mb-8 relative z-10">
                Information
              </h3>

              <div className="space-y-8 relative z-10">
                {/* Email */}
                <div className="group">
                  <p className="text-xs text-gray-400 tracking-widest uppercase mb-2 font-bold">
                    EMAIL
                  </p>
                  <a
                    href="mailto:info@sumome.jp"
                    className="flex items-center gap-3 text-lg font-medium hover:text-sumo-gold transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-sumo-gold group-hover:text-white transition-all">
                      <Mail size={14} />
                    </div>
                    info@sumome.jp
                  </a>
                </div>

                {/* Phone */}
                <div className="group">
                  <p className="text-xs text-gray-400 tracking-widest uppercase mb-2 font-bold">
                    PHONE
                  </p>
                  <a
                    href="tel:03-1234-5678"
                    className="flex items-center gap-3 text-lg font-medium hover:text-sumo-gold transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-sumo-gold group-hover:text-white transition-all">
                      <Phone size={14} />
                    </div>
                    03-1234-5678
                  </a>
                  <p className="text-xs text-gray-500 mt-2 pl-11">
                    平日 10:00 - 18:00 (土日祝休)
                  </p>
                </div>

                {/* Office */}
                <div className="group">
                  <p className="text-xs text-gray-400 tracking-widest uppercase mb-2 font-bold">
                    OFFICE
                  </p>
                  <div className="flex items-start gap-3 text-base leading-relaxed text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin size={14} />
                    </div>
                    <span>
                      〒100-0001
                      <br />
                      東京都千代田区千代田1-1
                      <br />
                      SUMOMEビル 5F
                    </span>
                  </div>
                </div>
              </div>

              {/* 装饰图案 */}
              <div className="absolute bottom-[-10%] right-[-10%] opacity-5 text-sumo-gold pointer-events-none">
                <Send size={200} />
              </div>
            </div>

            {/* --- Right Side: The Form (表单区域) --- */}
            <div className="lg:w-2/3 p-8 md:p-14 bg-white relative">
              {/* 纸质纹理叠加 */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage:
                    "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                }}
              ></div>

              {isSent ? (
                // --- Success State (提交成功) ---
                <div className="h-full flex flex-col items-center justify-center py-20 text-center animate-fade-in relative z-10">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-sumo-dark mb-4">
                    お問い合わせ完了
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md leading-loose">
                    お問い合わせありがとうございます。
                    <br />
                    内容を確認の上、担当者より2営業日以内にご連絡させていただきます。
                  </p>
                  <Button href="/" variant="outline">
                    トップページへ戻る
                  </Button>
                </div>
              ) : (
                // --- Form State (填写表单) ---
                <form onSubmit={handleSubmit} className="relative z-10">
                  <h3 className="text-xl font-serif font-bold text-sumo-dark mb-8 border-l-4 border-sumo-gold pl-4 flex items-center justify-between">
                    入力フォーム
                    <span className="text-[10px] text-gray-400 font-sans font-normal tracking-normal bg-gray-100 px-2 py-1 rounded">
                      * は必須項目です
                    </span>
                  </h3>

                  <div className="space-y-10">
                    {/* Name Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-sumo-gold transition-colors">
                          お名前 (漢字) <span className="text-sumo-red">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="相撲 太郎"
                          className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-sumo-gold transition-all placeholder:text-gray-300 text-sumo-dark font-medium"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-sumo-gold transition-colors">
                          フリガナ <span className="text-sumo-red">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="スモウ タロウ"
                          className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-sumo-gold transition-all placeholder:text-gray-300 text-sumo-dark font-medium"
                        />
                      </div>
                    </div>

                    {/* Contact Info Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-sumo-gold transition-colors">
                          メールアドレス{" "}
                          <span className="text-sumo-red">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="example@sumome.jp"
                          className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-sumo-gold transition-all placeholder:text-gray-300 text-sumo-dark font-medium"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-sumo-gold transition-colors">
                          電話番号
                        </label>
                        <input
                          type="tel"
                          placeholder="090-1234-5678"
                          className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-sumo-gold transition-all placeholder:text-gray-300 text-sumo-dark font-medium"
                        />
                      </div>
                    </div>

                    {/* Inquiry Type */}
                    <div className="group">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 group-focus-within:text-sumo-gold transition-colors">
                        お問い合わせ種別{" "}
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
                            className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-sm hover:border-sumo-gold hover:bg-sumo-bg transition-all"
                          >
                            <input
                              type="radio"
                              name="type"
                              className="accent-sumo-gold w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="group">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-sumo-gold transition-colors">
                        お問い合わせ内容{" "}
                        <span className="text-sumo-red">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="ご質問やご相談内容をご記入ください"
                        className="w-full bg-gray-50 border border-gray-200 rounded-sm p-4 focus:outline-none focus:border-sumo-gold focus:ring-1 focus:ring-sumo-gold/20 transition-all placeholder:text-gray-300 text-sumo-dark font-medium resize-none"
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                          group w-full md:w-auto min-w-[200px] flex items-center justify-center gap-3 
                          bg-sumo-dark text-white font-bold py-4 px-8 rounded-sm
                          shadow-lg hover:shadow-xl hover:bg-sumo-red hover:-translate-y-1
                          transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed
                        `}
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">送信中...</span>
                        ) : (
                          <>
                            <span>送信する</span>
                            <ArrowRight
                              size={18}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-400 mt-4 text-center md:text-left">
                        ※ 送信することで、
                        <a href="#" className="underline hover:text-sumo-gold">
                          プライバシーポリシー
                        </a>
                        に同意したものとみなされます。
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
