"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // إعادة ضبط ارتفاع الـ textarea تلقائياً حسب المحتوى
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="bg-white rounded-2xl border border-slate-200/90 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-xs p-2 sm:p-2.5 flex items-end gap-2">
        {/* حقل الإدخال المتعدد الأسطر */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب استفسارك التجريبي هنا... (مثلاً: اعرض عينة جدول، أو استفسر عن مستند)"
          disabled={isLoading}
          rows={1}
          className="flex-1 max-h-36 resize-none bg-transparent p-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed disabled:opacity-60"
          dir="rtl"
        />

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 sm:p-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 text-white font-bold transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
          aria-label="إرسال الاستفسار"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          ) : (
            <Send className="w-4 h-4 rtl:rotate-180" />
          )}
        </button>
      </div>

      {/* شريط المساعدة والاختصارات */}
      <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-slate-400">
        <span className="hidden sm:inline">
          اضغط <kbd className="px-1 py-0.5 rounded bg-slate-100 font-mono text-slate-600">Enter</kbd> للإرسال، أو <kbd className="px-1 py-0.5 rounded bg-slate-100 font-mono text-slate-600">Shift + Enter</kbd> لسطر جديد
        </span>
        <span className="text-slate-400 sm:mr-auto">
          محاكاة واجهة • لن يتم إرسال بيانات حقيقية
        </span>
      </div>
    </form>
  );
}
