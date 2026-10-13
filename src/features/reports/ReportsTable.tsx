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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <FileText className="w-3 h-3 text-rose-600" />
            <span>PDF</span>
          </span>
        );
      case "XLSX":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
            <span>Excel</span>
          </span>
        );
      case "CSV":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <FileSpreadsheet className="w-3 h-3 text-teal-600" />
            <span>CSV</span>
          </span>
        );
      case "JSON":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <FileCode className="w-3 h-3 text-amber-600" />
            <span>JSON</span>
          </span>
        );
      case "HTML":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Globe className="w-3 h-3 text-blue-600" />
            <span>HTML</span>
          </span>
        );
    }
  };

  // شارة الحالة مع نص صريح وأيقونة (لا نعتمد على اللون وحده)
  const renderStatusBadge = (status: ReportStatus, statusLabel: string) => {
    switch (status) {
      case "ready":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{statusLabel}</span>
          </span>
        );
      case "generating":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
            <span>{statusLabel}</span>
          </span>
        );
      case "failed":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{statusLabel}</span>
          </span>
        );
    }
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-slate-800">
          لا توجد تقارير تطابق البحث
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          جرّب تغيير كلمات البحث أو إعادة ضبط فلاتر التصنيف والصيغة.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* 1. جدول الشاشات الكبيرة والحواسيب */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
              <th className="p-4 whitespace-nowrap">عنوان التقرير</th>
              <th className="p-4 whitespace-nowrap">التصنيف</th>
              <th className="p-4 whitespace-nowrap">الصيغة والحجم</th>
              <th className="p-4 whitespace-nowrap">تاريخ الإنشاء</th>
              <th className="p-4 whitespace-nowrap">الحالة</th>
              <th className="p-4 whitespace-nowrap text-left">الإجراءات التجريبية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => {
              const isRetrying = retryingReportId === report.id;

              return (
                <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* العنوان والوصف */}
                  <td className="p-4 min-w-[260px]">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 text-sm block">
                        {report.title}
                      </span>
                      {report.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
                          {report.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* التصنيف */}
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-semibold text-[11px]">
                      {report.categoryLabel}
                    </span>
                  </td>

                  {/* الصيغة والحجم */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {renderFormatBadge(report.format)}
                      <span className="font-sans text-slate-500 font-medium">
                        {report.size}
                      </span>
                    </div>
                  </td>

                  {/* تاريخ الإنشاء */}
                  <td className="p-4 whitespace-nowrap text-slate-500 font-medium">
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
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold transition-all disabled:opacity-60 cursor-pointer text-[11px]"
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

                      {/* زر المعاينة / التنزيل التجريبي */}
                      <button
                        type="button"
                        onClick={() => onPreview(report)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors cursor-pointer text-[11px]"
                        title="معاينة أو تنزيل تجريبي"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>معاينة وتصدير</span>
                      </button>

                      {/* زر عرض التفاصيل الكاملة */}
                      <button
                        type="button"
                        onClick={() => onViewDetails(report)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
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
      <div className="lg:hidden divide-y divide-slate-100">
        {reports.map((report) => {
          const isRetrying = retryingReportId === report.id;

          return (
            <div key={report.id} className="p-4 space-y-3 text-right">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <span className="font-bold text-slate-900 text-sm block">
                    {report.title}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-500">
                      {report.categoryLabel}
                    </span>
                    <span className="text-slate-300">•</span>
                    {renderFormatBadge(report.format)}
                    <span className="text-[11px] text-slate-400 font-sans">
                      {report.size}
                    </span>
                  </div>
                </div>

                {renderStatusBadge(report.status, report.statusLabel)}
              </div>

              {report.description && (
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>
              )}

              <div className="text-[11px] text-slate-400">
                تاريخ الإنشاء: {report.createdAt}
              </div>

              {/* أزرار الإجراءات في الجوال */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {report.status === "failed" && (
                  <button
                    type="button"
                    onClick={() => onRetry(report)}
                    disabled={isRetrying}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold"
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
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>معاينة وتصدير</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewDetails(report)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
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
