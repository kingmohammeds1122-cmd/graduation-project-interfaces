"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Loader2,
  CalendarClock,
  Sparkles,
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
import GlowCard from "@/components/ui/GlowCard";

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
    <div className="space-y-6 pb-12 max-w-7xl mx-auto w-full text-slate-800 dark:text-slate-100" dir="rtl">
      {/* 1. الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              التقارير وسجلات التصدير (Export & Audit Reports)
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Multi-Format Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            استعراض وتصدير التقارير المالية والتشغيلية وسجلات التدقيق المعتمدة بصيغ (PDF, Excel, CSV, JSON)
          </p>
        </div>

        <button
          type="button"
          onClick={reloadData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all self-start sm:self-auto cursor-pointer disabled:opacity-60"
        >
          <RotateCcw
            className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          <span>تحديث القائمة</span>
        </button>
      </div>

      {/* 2. بطاقات المؤشرات الإحصائية السريعة بـ GlowCard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <GlowCard glowColor="blue">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">إجمالي التقارير</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {stats.total}
              </div>
              <span className="text-[11px] text-slate-400">سجلات مصنفة ومؤرشفة</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="emerald">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">جاهز للمعاينة والتصدير</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {stats.ready}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> متاح للتحميل الفوري
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="amber">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">قيد التوليد والتجميع</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {stats.generating}
              </div>
              <span className="text-[11px] text-slate-400">معالجة النماذج التحليلية</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="rose">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">فشل التوليد</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {stats.failed}
              </div>
              <span className="text-[11px] text-rose-500">يتطلب إعادة محاولة</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>
      </div>

      {/* 3. شريط حالة الجدولة والامتثال */}
      <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            جدولة التقارير الآلية (Scheduled Cron): <strong>تقارير يومية وأسبوعية ترسل تلقائياً إلى قنوات Slack والبريد الإلكتروني المعتمدة.</strong>
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
          Auto-Sync: Enabled
        </span>
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
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            جاري تحديث قائمة وسجلات التقارير...
          </p>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-8 text-center space-y-3 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-rose-700 dark:text-rose-300">{error}</h4>
          <button
            type="button"
            onClick={reloadData}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors cursor-pointer"
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
    </div>
  );
}
