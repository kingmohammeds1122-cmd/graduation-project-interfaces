"use client";

import React from "react";
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Download,
  RotateCcw,
  Loader2,
  Layers,
} from "lucide-react";
import { ReportItem, ReportStatus, ReportFormat } from "@/types/reports.types";

interface ReportsTableProps {
  reports: ReportItem[];
  onViewDetails: (report: ReportItem) => void;
  onPreview: (report: ReportItem) => void;
  onRetry: (report: ReportItem) => void;
  retryingReportId: string | null;
}

export default function ReportsTable({
  reports,
  onViewDetails,
  onPreview,
  onRetry,
  retryingReportId,
}: ReportsTableProps) {
  // أيقونة صيغة التقرير
  const renderFormatBadge = (format: ReportFormat) => {
    switch (format) {
      case "PDF":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <FileText className="w-3 h-3 text-rose-500" />
            <span>PDF</span>
          </span>
        );
      case "XLSX":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <FileSpreadsheet className="w-3 h-3 text-emerald-500" />
            <span>Excel</span>
          </span>
        );
      case "CSV":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <FileSpreadsheet className="w-3 h-3 text-teal-500" />
            <span>CSV</span>
          </span>
        );
      case "JSON":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FileCode className="w-3 h-3 text-amber-500" />
            <span>JSON</span>
          </span>
        );
      case "HTML":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Globe className="w-3 h-3 text-blue-500" />
            <span>HTML</span>
          </span>
        );
    }
  };

  // شارة الحالة مع نص صريح وأيقونة
  const renderStatusBadge = (status: ReportStatus, statusLabel: string) => {
    switch (status) {
      case "ready":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{statusLabel}</span>
          </span>
        );
      case "generating":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600 dark:text-amber-400" />
            <span>{statusLabel}</span>
          </span>
        );
      case "failed":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>{statusLabel}</span>
          </span>
        );
    }
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-12 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
          لا توجد تقارير تطابق البحث
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          جرّب تغيير كلمات البحث أو إعادة ضبط فلاتر التصنيف والصيغة.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
      {/* 1. جدول الشاشات الكبيرة والحواسيب */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold">
              <th className="p-4 whitespace-nowrap">عنوان التقرير</th>
              <th className="p-4 whitespace-nowrap">التصنيف</th>
              <th className="p-4 whitespace-nowrap">الصيغة والحجم</th>
              <th className="p-4 whitespace-nowrap">تاريخ الإنشاء</th>
              <th className="p-4 whitespace-nowrap">الحالة التشغيلية</th>
              <th className="p-4 whitespace-nowrap text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {reports.map((report) => {
              const isRetrying = retryingReportId === report.id;

              return (
                <tr key={report.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors group">
                  {/* العنوان والوصف */}
                  <td className="p-4 min-w-[260px]">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white text-sm block">
                        {report.title}
                      </span>
                      {report.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                          {report.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* التصنيف */}
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-semibold text-[11px]">
                      {report.categoryLabel}
                    </span>
                  </td>

                  {/* الصيغة والحجم */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {renderFormatBadge(report.format)}
                      <span className="font-mono text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                        {report.size}
                      </span>
                    </div>
                  </td>

                  {/* تاريخ الإنشاء */}
                  <td className="p-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium font-mono text-[11px]">
                    {report.createdAt}
                  </td>

                  {/* الحالة */}
                  <td className="p-4 whitespace-nowrap">
                    {renderStatusBadge(report.status, report.statusLabel)}
                  </td>

                  {/* الإجراءات */}
                  <td className="p-4 whitespace-nowrap text-left">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* زر إعادة المحاولة في حالة الفشل */}
                      {report.status === "failed" && (
                        <button
                          type="button"
                          onClick={() => onRetry(report)}
                          disabled={isRetrying}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 font-semibold transition-all disabled:opacity-60 cursor-pointer text-[11px]"
                          title="إعادة التوليد التجريبي"
                        >
                          {isRetrying ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5" />
                          )}
                          <span>إعادة المحاولة</span>
                        </button>
                      )}

                      {/* زر المعاينة / التصدير */}
                      <button
                        type="button"
                        onClick={() => onPreview(report)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 font-semibold transition-colors cursor-pointer text-[11px]"
                        title="معاينة وتصدير التقرير"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>معاينة وتصدير</span>
                      </button>

                      {/* زر عرض التفاصيل الكاملة */}
                      <button
                        type="button"
                        onClick={() => onViewDetails(report)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="تفاصيل التقرير"
                        aria-label="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. بطاقات مخصصة للهواتف والشاشات الصغيرة */}
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-white/5">
        {reports.map((report) => {
          const isRetrying = retryingReportId === report.id;

          return (
            <div key={report.id} className="p-4 space-y-3 text-right">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">
                    {report.title}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {report.categoryLabel}
                    </span>
                    <span className="text-slate-300 dark:text-white/20">•</span>
                    {renderFormatBadge(report.format)}
                    <span className="text-[11px] text-slate-400 font-mono">
                      {report.size}
                    </span>
                  </div>
                </div>

                {renderStatusBadge(report.status, report.statusLabel)}
              </div>

              {report.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>
              )}

              <div className="text-[11px] text-slate-400 font-mono">
                تاريخ الإنشاء: {report.createdAt}
              </div>

              {/* أزرار الإجراءات في الجوال */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                {report.status === "failed" && (
                  <button
                    type="button"
                    onClick={() => onRetry(report)}
                    disabled={isRetrying}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-semibold"
                  >
                    {isRetrying ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5" />
                    )}
                    <span>إعادة المحاولة</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onPreview(report)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>معاينة وتصدير</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewDetails(report)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
                  aria-label="عرض التفاصيل"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
