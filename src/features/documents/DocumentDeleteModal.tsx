"use client";

import React from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { DocumentItem } from "@/types/documents.types";

interface DocumentDeleteModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onConfirm: (documentId: string) => void;
  isLoading: boolean;
}

export default function DocumentDeleteModal({
  document,
  onClose,
  onConfirm,
  isLoading,
}: DocumentDeleteModalProps) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-right p-6 space-y-4">
        {/* أيقونة التحذير وزر الإغلاق */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="إلغاء"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* الرسالة والتوضيح */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900">
            تأكيد حذف المستند التجريبي
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            هل أنت متأكد من رغبتك في حذف هذا المستند من العرض التجريبي:
            <span className="font-bold text-slate-800 block mt-1 font-mono">
              «{document.name}»
            </span>
            سيتم حذفه من القائمة المحلية فقط لأغراض المعاينة.
          </p>
        </div>

        {/* أزرار الإجراءات */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => onConfirm(document.id)}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs shadow-rose-600/30 transition-all disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جاري الحذف...</span>
              </>
            ) : (
              <span>تأكيد الحذف التجريبي</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
