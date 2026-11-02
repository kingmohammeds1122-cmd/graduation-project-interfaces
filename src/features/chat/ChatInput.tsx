"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Globe, Database, FileText, Sparkles } from "lucide-react";
import { ChatScope } from "@/types/chat.types";

interface ChatInputProps {
  onSendMessage: (text: string, scope?: ChatScope) => void;
  isLoading: boolean;
  initialScope?: ChatScope;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  initialScope = "all",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [scope, setScope] = useState<ChatScope>(initialScope);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ضبط ارتفاع حقل الإدخال تلقائياً
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

    onSendMessage(input.trim(), scope);
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
    <form onSubmit={handleSubmit} className="relative w-full space-y-2.5">
      {/* 1. محدد نطاق المعرفة الذكي (Context Scope Selector) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 pl-1 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span>نطاق الاستفسار:</span>
          </span>

          <button
            type="button"
            onClick={() => setScope("all")}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              scope === "all"
                ? "bg-blue-600 text-white shadow-xs shadow-blue-600/30 ring-2 ring-blue-500/20"
                : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>🌐 كافة المصادر والمستندات</span>
          </button>

          <button
            type="button"
            onClick={() => setScope("databases")}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              scope === "databases"
                ? "bg-blue-600 text-white shadow-xs shadow-blue-600/30 ring-2 ring-blue-500/20"
                : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>🗄️ قواعد البيانات المركزية</span>
          </button>

          <button
            type="button"
            onClick={() => setScope("documents")}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              scope === "documents"
                ? "bg-blue-600 text-white shadow-xs shadow-blue-600/30 ring-2 ring-blue-500/20"
                : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📄 قاعدة المعرفة والمستندات</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-mono hidden lg:inline">
          RAG Context Router v2
        </span>
      </div>

      {/* 2. حاوية حقل الإدخال وزر الإرسال */}
      <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/90 dark:border-white/10 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs p-2 sm:p-2.5 flex items-end gap-2">
        {/* حقل الإدخال المتعدد الأسطر */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اطرح استفسارك التحليلي... (مثال: ما هو نمو الإيرادات مقارنة بالربع السابق؟ أو اعرض مؤشرات المصادر)"
          disabled={isLoading}
          rows={1}
          className="flex-1 max-h-36 resize-none bg-transparent p-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none leading-relaxed disabled:opacity-60"
          dir="rtl"
        />

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 sm:p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 dark:disabled:bg-white/5 disabled:text-slate-300 dark:disabled:text-slate-600 text-white font-bold transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-blue-600/25"
          aria-label="إرسال الاستفسار"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4 rtl:rotate-180" />
          )}
        </button>
      </div>

      {/* 3. شريط المساعدة والاختصارات */}
      <div className="flex items-center justify-between px-2 text-[10px] text-slate-400">
        <span className="hidden sm:inline">
          اضغط <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">Enter</kbd> للإرسال، أو <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">Shift + Enter</kbd> لسطر جديد
        </span>
        <span className="text-slate-400 sm:mr-auto font-mono">
          Agent Planner v2 • Multi-Modal RAG
        </span>
      </div>
    </form>
  );
}
