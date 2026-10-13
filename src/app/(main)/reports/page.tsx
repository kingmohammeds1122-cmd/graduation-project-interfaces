"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Loader2,
  Info,
  CalendarClock,
} from "lucide-react";
import {
  ReportItem,
  ReportFilterOptions,
} from "@/types/reports.types";
import { mockReports } from "@/mocks/reports.mock";
import {
  getReports,
  retryGenerateReportMock,
} from "@/services/reports.service";
import ReportsFilters from "@/features/reports/ReportsFilters";
import ReportsTable from "@/features/reports/ReportsTable";
import ReportDetailsModal from "@/features/reports/ReportDetailsModal";
import ReportPreviewModal from "@/features/reports/ReportPreviewModal";

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(mockReports);
  const [totalCount, setTotalCount] = useState<number>(mockReports.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // الفلاتر
  const [filters, setFilters] = useState<ReportFilterOptions>({
    searchQuery: "",
    categoryFilter: "all",
    formatFilter: "all",
    statusFilter: "all",
  });

  // النوافذ المنبثقة
  const [selectedDetailsReport, setSelectedDetailsReport] = useState<ReportItem | null>(null);
  const [selectedPreviewReport, setSelectedPreviewReport] = useState<ReportItem | null>(null);
  const [retryingReportId, setRetryingReportId] = useState<string | null>(null);

  // إحصائيات سريعة
  const stats = {
    total: totalCount,
    ready: reports.filter((r) => r.status === "ready").length,
    generating: reports.filter((r) => r.status === "generating").length,
    failed: reports.filter((r) => r.status === "failed").length,
  };

  // معالجة تغيير الفلاتر
  const handleFilterChange = async (newFilters: ReportFilterOptions) => {
    setFilters(newFilters);
    setIsLoading(true);
    setError(null);
    try {
      const data = await getReports(newFilters, { delayMs: 150 });
      setReports(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("تعذر تصفية التقارير التجريبية.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = async () => {
    const defaultFilters: ReportFilterOptions = {
      searchQuery: "",
      categoryFilter: "all",
      formatFilter: "all",
      statusFilter: "all",
    };
    setFilters(defaultFilters);
    await handleFilterChange(defaultFilters);
  };

  // إعادة تحميل البيانات
  const reloadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getReports(filters, { delayMs: 200 });
      setReports(data);
      const all = await getReports(undefined, { delayMs: 0 });
      setTotalCount(all.length);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("تعذر تحديث التقارير.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة المحاولة التجريبية
  const handleRetry = async (report: ReportItem) => {
    setRetryingReportId(report.id);
    try {
      const updated = await retryGenerateReportMock(report.id);
      setReports((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
    } catch {
      setError(`تعذرت إعادة محاولة توليد تقرير «${report.title}».`);
    } finally {
      setRetryingReportId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* 1. الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              التقارير وسجلات التصدير
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              عرض تجريبي
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            استعراض التقارير المالية والتشغيلية وسجلات التدقيق المجهزة للتصدير والمعاينة
          </p>
        </div>

        <button
          type="button"
          onClick={reloadData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer disabled:opacity-60"
        >
          <RotateCcw
            className={`w-3.5 h-3.5 text-slate-500 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          <span>تحديث القائمة</span>
        </button>
      </div>

      {/* 2. شريط تنبيه الشفافية وجدولة التقارير */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* تنبيه الشفافية والمحاكاة */}
        <div className="md:col-span-2 bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-800 leading-relaxed">
            <p className="font-bold">
              تنبيه الشفافية: كافة التقارير والبيانات المعروضة هي عينات تجريبية (Mock Reports).
            </p>
            <p className="text-amber-700 text-[11px]">
              أزرار التنزيل والمعاينة مخصصة لاختبار الواجهة، ولا يتم إنشاء أو حفظ أي ملفات فعلية. سيتم تفعيل التصدير الحقيقي لاحقاً بعد ربط نقاط نهاية الـ Backend.
            </p>
          </div>
        </div>

        {/* إشعار حالة جدولة التقارير */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <CalendarClock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs text-slate-700">
            <span className="font-bold block">جدولة التقارير (خارج النطاق)</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              خاصية الجدولة التلقائية الدورية معلقة حالياً وغير مفعلة حتى اعتماد السياسات الخلفية.
            </p>
          </div>
        </div>
      </div>

      {/* 3. بطاقات المؤشرات الإحصائية السريعة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">إجمالي التقارير</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            {stats.total}
          </div>
          <span className="text-[10px] text-slate-400">تقارير مسجلة تجريبياً</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">جاهز للمعاينة</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 font-sans">
            {stats.ready}
          </div>
          <span className="text-[10px] text-slate-400">مكتمل التجميع الافتراضي</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">قيد التوليد</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 font-sans">
            {stats.generating}
          </div>
          <span className="text-[10px] text-slate-400">بانتظار اكتمال البيانات</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">فشل التوليد</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 font-sans">
            {stats.failed}
          </div>
          <span className="text-[10px] text-slate-400">يتطلب إعادة محاولة</span>
        </div>
      </div>

      {/* 4. أدوات البحث والتصفية */}
      <ReportsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalCount={totalCount}
        filteredCount={reports.length}
      />

      {/* 5. عرض قائمة التقارير أو حالات التحميل والخطأ */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">
            جاري تحديث قائمة التقارير التجريبية...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">{error}</h4>
          <button
            type="button"
            onClick={reloadData}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <ReportsTable
          reports={reports}
          onViewDetails={(report) => setSelectedDetailsReport(report)}
          onPreview={(report) => setSelectedPreviewReport(report)}
          onRetry={handleRetry}
          retryingReportId={retryingReportId}
        />
      )}

      {/* 6. نافذة التفاصيل المنبثقة */}
      <ReportDetailsModal
        report={selectedDetailsReport}
        onClose={() => setSelectedDetailsReport(null)}
      />

      {/* 7. نافذة المعاينة والتصدير التجريبية */}
      <ReportPreviewModal
        report={selectedPreviewReport}
        onClose={() => setSelectedPreviewReport(null)}
      />

      {/* 8. أدوات فحص المطور (بيئة التطوير فقط) */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 text-[11px] flex flex-wrap items-center justify-between gap-2">
          <span>أدوات فحص واجهة التقارير (تظهر في بيئة التطوير فقط):</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1200);
              }}
              className="px-2 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              محاكاة التحميل
            </button>
            <button
              type="button"
              onClick={() => setError("عينة خطأ افتراضي لمعاينة سلوك الشاشة")}
              className="px-2 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              محاكاة خطأ
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setReports(mockReports);
                setTotalCount(mockReports.length);
              }}
              className="px-2 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              استعادة العينات الأصلية
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
