"use client";

import React from "react";
import { X, FileText, Info, Layers, User, Calendar, HardDrive } from "lucide-react";
import { ReportItem } from "@/types/reports.types";

interface ReportDetailsModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export default function ReportDetailsModal({
  report,
  onClose,
}: ReportDetailsModalProps) {
  if (!report) return null;

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
                تفاصيل التقرير (معاينة)
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">
                بطاقة المعلومات الوصفية
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
        <div className="p-5 sm:p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* عنوان ووصف التقرير */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h4 className="font-bold text-sm text-slate-900 leading-snug">
              {report.title}
            </h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {report.description}
            </p>
          </div>

          {/* الخصائص والبيانات الأساسية */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                <span>التصنيف:</span>
              </span>
              <span className="font-bold text-slate-800 block truncate">
                {report.categoryLabel}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-slate-400" />
                <span>الصيغة والحجم:</span>
              </span>
              <span className="font-bold text-slate-800 block">
                {report.format} • {report.size}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>تاريخ الإنشاء:</span>
              </span>
              <span className="font-medium text-slate-700 block truncate">
                {report.createdAt}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>المولّد بواسطة:</span>
              </span>
              <span className="font-medium text-slate-700 block truncate">
                {report.generatedBy}
              </span>
            </div>
          </div>

          {/* تفاصيل النطاق والفلاتر المطبقة */}
          {report.details && (
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-[11px]">
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-bold">نطاق التقرير:</span>
                <span className="font-medium text-slate-800">{report.details.scope}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="font-bold">الفلاتر المطبقة:</span>
                <span className="font-medium text-slate-800">{report.details.filtersApplied}</span>
              </div>

              {report.details.estimatedPages && (
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-bold">الصفحات التقديرية:</span>
                  <span className="font-mono font-bold text-slate-800">{report.details.estimatedPages} صفحة</span>
                </div>
              )}

              {report.details.estimatedRows && (
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-bold">الصفوف التقديرية:</span>
                  <span className="font-mono font-bold text-slate-800">{report.details.estimatedRows.toLocaleString()} صف متضمن</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700 block mb-0.5">ملاحظات التحليل:</span>
                <p>{report.details.summaryNotes}</p>
              </div>
            </div>
          )}

          {/* تنبيه الشفافية */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              تنبيه: ميزة توليد التقارير وتصديرها الفعلي إلى ملفات تتطلب الاتصال بنقاط نهاية الـ Backend، والبيانات المعروضة هنا هي محاكاة بصرية.
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
