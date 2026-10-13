"use client";

import React from "react";
import { X, FileText, Info, CheckCircle2, Clock, AlertCircle } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden text-right">
        {/* الترويسة */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-xs">
                تفاصيل المستند (معاينة)
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">
                بطاقة معلومات افتراضية
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم النافذة */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* اسم المستند وحجمه */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-slate-500">
              <span className="font-bold">اسم الملف:</span>
              <span className="font-mono text-slate-900 font-bold truncate max-w-[200px]">
                {document.name}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-500">
              <span className="font-bold">النوع والامتداد:</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                {document.type}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-500">
              <span className="font-bold">الحجم التقديري:</span>
              <span className="font-sans font-bold text-slate-900">
                {document.size}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-500">
              <span className="font-bold">تاريخ الرفع:</span>
              <span className="font-medium text-slate-700">
                {document.uploadedAt}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-500">
              <span className="font-bold">حالة المعالجة:</span>
              <div className="font-bold">
                {document.status === "completed" && (
                  <span className="text-emerald-700 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    مكتمل الفهرسة (محاكاة)
                  </span>
                )}
                {document.status === "processing" && (
                  <span className="text-amber-700 inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    قيد المعالجة (محاكاة)
                  </span>
                )}
                {document.status === "uploaded" && (
                  <span className="text-cyan-700 inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-600" />
                    مرفوع حديثاً (محاكاة)
                  </span>
                )}
                {document.status === "failed" && (
                  <span className="text-rose-700 inline-flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    فشل المعالجة (محاكاة)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* الوصف */}
          {document.description && (
            <div className="space-y-1">
              <span className="font-bold text-slate-700 block">الملاحظات:</span>
              <p className="text-slate-500 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                {document.description}
              </p>
            </div>
          )}

          {/* تنبيه الشفافية */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              تنبيه: لا يتم تنفيذ أي عمليات تقسيم (Chunks) أو تضمين (Embeddings) أو معالجة Vector Search في واجهة المتصفح، حيث تُسند هذه المهام كلياً للـ Backend لاحقاً.
            </span>
          </div>
        </div>

        {/* التذييل */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
