"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { ReportFilterOptions } from "@/types/reports.types";

interface ReportsFiltersProps {
  filters: ReportFilterOptions;
  onFilterChange: (filters: ReportFilterOptions) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export const REPORT_CATEGORIES = [
  { value: "all", label: "كافة التصنيفات" },
  { value: "financial", label: "تقارير مالية" },
  { value: "operational", label: "تشغيلي وتجاري" },
  { value: "performance", label: "أداء وموثوقية" },
  { value: "audit", label: "تدقيق وأمان" },
  { value: "custom", label: "تحليلات مخصصة" },
];

export const REPORT_FORMATS = ["all", "PDF", "XLSX", "CSV", "JSON", "HTML"];

export const REPORT_STATUSES = [
  { value: "all", label: "كافة الحالات" },
  { value: "ready", label: "جاهز للمعاينة" },
  { value: "generating", label: "قيد التوليد" },
  { value: "failed", label: "فشل التوليد" },
];

export default function ReportsFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}: ReportsFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.searchQuery.trim()) ||
    filters.categoryFilter !== "all" ||
    filters.formatFilter !== "all" ||
    filters.statusFilter !== "all";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* حقل البحث */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            placeholder="بحث بعنوان التقرير أو الوصف أو الامتداد..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-9 pl-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            dir="rtl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* عدد النتائج */}
        <span className="text-xs font-semibold text-slate-400 self-start sm:self-auto">
          عرض {filteredCount} من أصل {totalCount} تقارير
        </span>
      </div>

      {/* شريط الفلاتر المنسدلة */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-600 font-bold pl-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>تصفية حسب:</span>
          </div>

          {/* نوع التقرير / التصنيف */}
          <select
            value={filters.categoryFilter}
            onChange={(e) =>
              onFilterChange({ ...filters, categoryFilter: e.target.value })
            }
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
            dir="rtl"
          >
            {REPORT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* صيغة الملف */}
          <select
            value={filters.formatFilter}
            onChange={(e) =>
              onFilterChange({ ...filters, formatFilter: e.target.value })
            }
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
            dir="rtl"
          >
            <option value="all">كافة الصيغ</option>
            {REPORT_FORMATS.filter((f) => f !== "all").map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>

          {/* حالة التقرير */}
          <select
            value={filters.statusFilter}
            onChange={(e) =>
              onFilterChange({ ...filters, statusFilter: e.target.value })
            }
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
            dir="rtl"
          >
            {REPORT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* زر إعادة التعيين */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
