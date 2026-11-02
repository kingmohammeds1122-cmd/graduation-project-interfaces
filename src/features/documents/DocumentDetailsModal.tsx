"use client";

import React from "react";
import { X, FileText, CheckCircle2, Clock, AlertCircle, Cpu, ShieldCheck } from "lucide-react";
import { DocumentItem } from "@/types/documents.types";

interface DocumentDetailsModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export default function DocumentDetailsModal({
  document,
  onClose,
}: DocumentDetailsModalProps) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl w-full max-w-lg overflow-hidden text-right text-slate-800 dark:text-slate-100">
        {/* الترويسة */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-xs">
                ميتاداتا المستند (RAG Metadata)
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                Vector ID: {document.id}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم النافذة */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* اسم المستند وحجمه */}
          <div className="bg-slate-50/80 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium">اسم الملف الأصلي:</span>
              <span className="font-mono text-slate-900 dark:text-white font-bold truncate max-w-[220px]">
                {document.name}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium">الامتداد ونوع الملف:</span>
              <span className="font-mono font-bold px-2.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white">
                {document.type}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium">الحجم الفعلي:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {document.size}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium">تاريخ الرفع:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {document.uploadedAt}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium">حالة خط الأنابيب:</span>
              <div className="font-bold">
                {document.status === "completed" && (
                  <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    مكتمل الفهرسة (Ready)
                  </span>
                )}
                {document.status === "processing" && (
                  <span className="text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    قيد المعالجة (Embedding)
                  </span>
                )}
                {document.status === "uploaded" && (
                  <span className="text-cyan-600 dark:text-cyan-400 inline-flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    مرفوع حديثاً (Queued)
                  </span>
                )}
                {document.status === "failed" && (
                  <span className="text-rose-600 dark:text-rose-400 inline-flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3.5 h-3.5" />
                    فشل المعالجة (Failed)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* الوصف */}
          {document.description && (
            <div className="space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">الملخص الدلالي:</span>
              <p className="text-slate-600 dark:text-slate-400 bg-white dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/10 leading-relaxed">
                {document.description}
              </p>
            </div>
          )}

          {/* تنبيه الأمان وتشفير المتجهات */}
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-slate-700 dark:text-slate-300 text-[11px] flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-blue-600 dark:text-blue-400 block">
                تأمين البيانات والخصوصية الفائقة:
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                يتم استخراج النصوص وتحويلها إلى متجهات مشفرة ومحمية ببروتوكولات Role-Based Access Control لضمان عدم تسريب المعلومات خارج نطاق الصلاحيات المصرح بها.
              </p>
            </div>
          </div>
        </div>

        {/* التذييل */}
        <div className="p-4 bg-slate-50/80 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Dimensions: 3072</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-xs transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
