"use client";

import React, { useState } from "react";
import { Send, ChevronDown, ChevronUp, CheckCircle2, Clock } from "lucide-react";
import { replyToInquiry } from "@/lib/actions/inquiries";

interface Props {
  inquiryId: string;
  toEmail: string;
  repliedAt: string | null;
  lastReplyBody: string | null;
}

export default function ReplyToInquiryForm({ inquiryId, toEmail, repliedAt, lastReplyBody }: Props) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const hasPrevReply = !!repliedAt && !!lastReplyBody;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await replyToInquiry(inquiryId, body);

    if (result.success) {
      setSuccess(true);
      setBody("");
    } else {
      setError(result.error ?? "エラーが発生しました。");
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* 已发送历史 */}
      {hasPrevReply && (
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-blue-500 font-bold mb-3 hover:text-blue-700 transition-colors duration-200"
        >
          <CheckCircle2 size={13} />
          返信済み
          <Clock size={12} className="text-gray-400" />
          <span className="text-gray-400 font-normal">
            {new Date(repliedAt!).toLocaleString("ja-JP")}
          </span>
          {showHistory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      )}
      {showHistory && lastReplyBody && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-gray-600 whitespace-pre-wrap">
          {lastReplyBody}
        </div>
      )}

      {/* 成功提示 */}
      {success && (
        <div className="flex items-center gap-2 text-xs text-green-600 font-bold mb-3 p-2 bg-green-50 border border-green-100 rounded-lg">
          <CheckCircle2 size={14} />
          {toEmail} に返信メールを送信しました。
        </div>
      )}

      {/* 返信表单 */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
          返信する（送信先：{toEmail}）
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="返信内容を入力してください..."
          disabled={loading}
          className="w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg resize-y
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand focus-visible:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        />
        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-300">{body.length} / 2000</span>
          <button
            type="submit"
            disabled={loading || !body.trim()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-sumo-brand rounded-lg
              hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed
              transition-all duration-200"
          >
            <Send size={13} />
            {loading ? "送信中..." : "メール送信"}
          </button>
        </div>
      </form>
    </div>
  );
}
