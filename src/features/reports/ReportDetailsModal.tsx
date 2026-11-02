"use client";

import React from "react";
import { X, FileText, Layers, User, Calendar, HardDrive, ShieldCheck } from "lucide-react";
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
                تفاصيل التقرير والبيانات الوصفية
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Report ID: {report.id}
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
        <div className="p-5 sm:p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* عنوان ووصف التقرير */}
          <div className="space-y-1.5 bg-slate-50/80 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
              {report.title}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              {report.description}
            </p>
          </div>

          {/* الخصائص والبيانات الأساسية */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-500" />
                <span>التصنيف:</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                {report.categoryLabel}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-purple-500" />
                <span>الصيغة والحجم:</span>
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">
                {report.format} • {report.size}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-500" />
                <span>تاريخ التوليد:</span>
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300 block truncate">
                {report.createdAt}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <User className="w-3 h-3 text-amber-500" />
                <span>المولّد بواسطة:</span>
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300 block truncate">
                {report.generatedBy}
              </span>
            </div>
          </div>

          {/* تفاصيل النطاق والفلاتر المطبقة */}
          {report.details && (
            <div className="space-y-2 bg-slate-50/80 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 text-[11px]">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span className="font-bold">نطاق التقرير:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{report.details.scope}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span className="font-bold">الفلاتر المطبقة:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{report.details.filtersApplied}</span>
              </div>

              {report.details.estimatedPages && (
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span className="font-bold">الصفحات التقديرية:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{report.details.estimatedPages} صفحة</span>
                </div>
              )}

              {report.details.estimatedRows && (
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span className="font-bold">الصفوف المضمنة:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{report.details.estimatedRows.toLocaleString()} صف</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">ملاحظات التحليل والتدقيق:</span>
                <p>{report.details.summaryNotes}</p>
              </div>
            </div>
          )}

          {/* تنبيه الأمان */}
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-slate-700 dark:text-slate-300 text-[11px] flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <span>
              سجل التقرير خاضع لسياسة التدقيق المؤسسي (Audit Trail Logged). أي تصدير يتم تسجيله مع عنوان الـ IP وهوية المستخدم لضمان أعلى معايير الامتثال والحوكمة.
            </span>
          </div>
        </div>

        {/* التذييل */}
        <div className="p-4 bg-slate-50/80 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/10 flex justify-end">
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
