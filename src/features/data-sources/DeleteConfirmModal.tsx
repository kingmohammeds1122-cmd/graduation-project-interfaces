"use client";

import React from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { DataSource } from "@/types/dataSources.types";

interface DeleteConfirmModalProps {
  source: DataSource | null;
  onClose: () => void;
  onConfirm: (sourceId: string) => void;
  isLoading: boolean;
}

export default function DeleteConfirmModal({
  source,
  onClose,
  onConfirm,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-md overflow-hidden text-right p-6 space-y-4 text-slate-800 dark:text-slate-100">
        {/* أيقونة التحذير وزر الإغلاق */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            aria-label="إلغاء"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* الرسالة والتوضيح */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            تأكيد حذف مصدر البيانات
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            هل أنت متأكد من رغبتك في إزالة مصدر البيانات:
            <span className="font-bold text-slate-800 dark:text-white block mt-1">«{source.name}»؟</span>
            سيتم إلغاء فهرسة مخطط الجداول وفصل الارتباط الدلالي بنواة الذكاء الاصطناعي.
          </p>
        </div>

        {/* أزرار الإجراءات */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => onConfirm(source.id)}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جاري الحذف...</span>
              </>
            ) : (
              <span>تأكيد الحذف</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
