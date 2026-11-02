"use client";

import React from "react";
import { Sparkles, MessageSquareQuote, ArrowLeft } from "lucide-react";
import { QuickPrompt } from "@/types/chat.types";

interface ChatWelcomeScreenProps {
  prompts: QuickPrompt[];
  onSelectPrompt: (promptText: string) => void;
}

export default function ChatWelcomeScreen({
  prompts,
  onSelectPrompt,
}: ChatWelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto text-center space-y-6 text-slate-800 dark:text-slate-100">
      {/* 1. الترويسة والشعار الذكي */}
      <div className="space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25 border border-white/20">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            مساعد ذكاء الأعمال والتحليلات AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            بيئة محادثة ذكية لتحليل البيانات وقواعد البيانات واسترجاع المعرفة عبر RAG. اطرح سؤالك أو اختر أحد النماذج المقترحة:
          </p>
        </div>
      </div>

      {/* 2. شبكة الأسئلة المقترحة السريعة */}
      <div className="w-full space-y-2 text-right">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block px-1">
          نماذج استفسارات تحليلية مقترحة:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {prompts.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className="p-3.5 rounded-xl border border-slate-200/90 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/40 bg-white/80 dark:bg-slate-900/60 hover:bg-violet-50/40 dark:hover:bg-white/[0.04] text-right transition-all group shadow-2xs hover:shadow-xs flex flex-col justify-between cursor-pointer backdrop-blur-sm"
            >
              <div className="flex items-start gap-2.5 mb-2">
                <MessageSquareQuote className="w-4 h-4 text-violet-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="line-clamp-1">{item.prompt}</span>
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-500 rtl:rotate-0 transform group-hover:-translate-x-0.5 transition-all shrink-0 mr-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. شارة الأمان والشفافية */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 text-[10px] font-mono">
        <span>Zero-Trust Enterprise LLM Orchestration</span>
      </div>
    </div>
  );
}
