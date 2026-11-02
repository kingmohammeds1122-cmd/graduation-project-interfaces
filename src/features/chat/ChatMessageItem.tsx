"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  User,
  FileText,
  Table as TableIcon,
  BookmarkCheck,
  Copy,
  Check,
  ExternalLink,
  FileBarChart2,
  AlertTriangle,
  Brain,
  ChevronDown,
  ChevronUp,
  Globe,
  Database,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { ChatMessage, ChatScope } from "@/types/chat.types";
import ChatReasoningStepper from "./ChatReasoningStepper";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      let copyText = message.content;
      if (message.insights && message.insights.length > 0) {
        copyText += "\n\nالرؤى الأساسية:\n" + message.insights.map(i => `- ${i.title}: ${i.value || ""} (${i.description})`).join("\n");
      }
      if (message.table) {
        copyText += `\n\n${message.table.caption || "الجدول"}:\n` + message.table.headers.join(" | ") + "\n" + message.table.rows.map(r => r.join(" | ")).join("\n");
      }
      await navigator.clipboard.writeText(copyText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // تجاهل أخطاء النسخ
    }
  };

  const getScopeBadge = (scope?: ChatScope) => {
    switch (scope) {
      case "databases":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Database className="w-2.5 h-2.5" />
            <span>قواعد البيانات</span>
          </span>
        );
      case "documents":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <FileText className="w-2.5 h-2.5" />
            <span>المستندات</span>
          </span>
        );
      case "all":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            <Globe className="w-2.5 h-2.5" />
            <span>كافة المصادر</span>
          </span>
        );
    }
  };

  // 1. رسالة المستخدم
  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-2.5 sm:gap-3 max-w-3xl ml-auto animate-fade-in">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-end gap-2">
            {getScopeBadge(message.scope)}
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tl-xs px-4 py-3 shadow-md shadow-blue-500/20 text-xs sm:text-sm leading-relaxed max-w-xl text-right">
            {message.content}
          </div>
          <span className="text-[10px] text-slate-400 block px-1 text-left font-mono">
            {message.timestamp}
          </span>
        </div>

        <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-2xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // 2. بطاقة مساحة عمل المساعد الذكي
  return (
    <div className="w-full flex items-start gap-3 sm:gap-4 animate-fade-in">
      {/* أيقونة المساعد الذكي */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/25 mt-1">
        <Sparkles className="w-4.5 h-4.5" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {/* حاوية بطاقة مساحة العمل الزجاجية */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all p-5 sm:p-6 space-y-4 text-right text-slate-800 dark:text-slate-100">
          
          {/* ترويسة مساحة عمل الرد */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
                <span>المساعد التحليلي الذكي</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </span>
              {getScopeBadge(message.scope)}
            </div>

            <div className="flex items-center gap-2">
              {message.reasoningSteps && message.reasoningSteps.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowReasoning(!showReasoning)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/20 transition-colors cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5 text-violet-500" />
                  <span>{showReasoning ? "إخفاء مسار التفكير" : "مسار التفكير"}</span>
                  {showReasoning ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hidden sm:inline-flex font-mono">
                AI Engine
              </span>
            </div>
          </div>

          {/* مسار التفكير القابل للعرض والطي */}
          {showReasoning && message.reasoningSteps && (
            <div className="pt-1">
              <ChatReasoningStepper
                steps={message.reasoningSteps}
                isLiveLoading={false}
                scope={message.scope}
              />
            </div>
          )}

          {/* 1. ملخص الإجابة النصية */}
          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
            {message.content}
          </div>

          {/* 2. بطاقات الرؤى والتحليلات الأساسية */}
          {message.insights && message.insights.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                <span>الرؤى والمؤشرات المستخلصة:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {message.insights.map((insight, idx) => {
                  const borderBg =
                    insight.type === "positive"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-300"
                      : insight.type === "info"
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-300"
                      : insight.type === "warning"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-300"
                      : "bg-violet-500/10 border-violet-500/20 text-violet-900 dark:text-violet-300";

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${borderBg} space-y-1 shadow-2xs backdrop-blur-sm`}
                    >
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                        {insight.title}
                      </span>
                      {insight.value && (
                        <span className="text-base font-extrabold block tracking-tight tabular-nums font-mono">
                          {insight.value}
                        </span>
                      )}
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. تنبيه النتيجة الجزئية إن وجد */}
          {message.partialError && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300 shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">ملاحظة معالجة جزئية:</span>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  {message.partialError}
                </p>
              </div>
            </div>
          )}

          {/* 4. منطقة عرض البيانات الجدولية */}
          {message.table && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <TableIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>{message.table.caption || "البيانات الجدولية المستخرجة"}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {message.table.rows.length} سجلات
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/30 shadow-2xs">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-100/90 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-white/10 font-bold">
                      {message.table.headers.map((header, idx) => (
                        <th key={idx} className="p-3 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-white/5 bg-white dark:bg-white/[0.01]">
                    {message.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="p-3 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap tabular-nums font-mono"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. شارات اقتباس مراجع المستندات والمصادر */}
          {message.sources && message.sources.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-violet-500" />
                  <span>مراجع المستندات والمصادر (RAG Citations):</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {message.sources.length} مراجع
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.sources.map((src) => (
                  <div
                    key={src.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-colors space-y-1 text-right"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 truncate">
                        <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{src.documentName}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {src.pageNumber && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono">
                            ص {src.pageNumber}
                          </span>
                        )}
                        {src.confidence && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                            {src.confidence}
                          </span>
                        )}
                      </div>
                    </div>
                    {src.snippet && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {src.snippet}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. شريط الإجراءات التفاعلية السريعة */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {/* زر نسخ الإجابة */}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>نسخ الإجابة</span>
                  </>
                )}
              </button>

              {/* زر الانتقال لشاشة التحليلات */}
              <Link
                href="/analytics"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
                title="فتح لوحة التحليلات المتقدمة"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح في التحليلات</span>
              </Link>

              {/* زر إنشاء تقرير فوري */}
              <Link
                href="/reports"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 transition-colors"
                title="إنشاء تقرير مؤسسي فوري"
              >
                <FileBarChart2 className="w-3.5 h-3.5" />
                <span>إنشاء تقرير فوري</span>
              </Link>
            </div>

            <span className="text-[10px] text-slate-400 font-mono">
              {message.timestamp}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
