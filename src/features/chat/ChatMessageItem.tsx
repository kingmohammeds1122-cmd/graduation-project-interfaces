"use client";

import React from "react";
import { Sparkles, User, FileText, Table as TableIcon, BookmarkCheck } from "lucide-react";
import { ChatMessage } from "@/types/chat.types";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-2.5 sm:gap-3 max-w-3xl ml-auto">
        <div className="space-y-1 text-left">
          <div className="bg-blue-600 text-white rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs text-xs sm:text-sm leading-relaxed max-w-xl text-right">
            {message.content}
          </div>
          <span className="text-[10px] text-slate-400 block px-1 text-left">
            {message.timestamp}
          </span>
        </div>

        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // رسالة المساعد الذكي (AI Assistant)
  return (
    <div className="flex items-start gap-2.5 sm:gap-3.5 max-w-4xl mr-auto">
      {/* أيقونة المساعد الذكي بهوية البنفسجي */}
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-violet-500/25 mt-0.5">
        <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </div>

      <div className="space-y-3 flex-1 min-w-0">
        {/* صندوق الرسالة الرئيسي */}
        <div className="bg-white rounded-2xl rounded-tr-xs border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5 text-right">
          {/* ترويسة الرسالة مع شارة المحاكاة الصريحة */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="text-violet-700">مساعد الذكاء الاصطناعي</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              إجابة محاكاة تجريبية • عينة توضيحية
            </span>
          </div>

          {/* محتوى النص الأساسي */}
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
            {message.content}
          </p>

          {/* 1. العرض المشروط للجدول (يعرض فقط إذا توفر في بيانات الرسالة) */}
          {message.table && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>{message.table.caption || "بيانات جدول محاكى"}</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/50">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
                      {message.table.headers.map((header, idx) => (
                        <th key={idx} className="p-2.5 sm:p-3 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 bg-white">
                    {message.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 sm:p-3 text-slate-700 font-medium whitespace-nowrap">
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

          {/* 2. العرض المشروط لمراجع المستندات (يعرض فقط إذا توفرت في بيانات الرسالة) */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <BookmarkCheck className="w-3.5 h-3.5 text-violet-600" />
                <span>مراجع المستندات التجريبية المستند إليها (عينة محاكاة):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.sources.map((src) => (
                  <div
                    key={src.id}
                    className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1 text-right"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 truncate">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{src.documentName}</span>
                      </div>
                      {src.pageNumber && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500 shrink-0">
                          ص {src.pageNumber}
                        </span>
                      )}
                    </div>
                    {src.snippet && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-normal">
                        {src.snippet}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* الوقت */}
        <span className="text-[10px] text-slate-400 block px-1 text-right">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
