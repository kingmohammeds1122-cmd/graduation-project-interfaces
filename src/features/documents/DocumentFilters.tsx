"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { DocumentFilterOptions } from "@/types/documents.types";

interface DocumentFiltersProps {
  filters: DocumentFilterOptions;
  onFilterChange: (filters: DocumentFilterOptions) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export const DOCUMENT_STATUSES = [
  { value: "all", label: "كافة الحالات" },
  { value: "completed", label: "مكتمل الفهرسة (RAG)" },
  { value: "processing", label: "قيد التجزئة والتضمين" },
  { value: "uploaded", label: "مرفوع حديثاً" },
  { value: "failed", label: "فشل المعالجة" },
];

export const DOCUMENT_TYPES = ["all", "PDF", "DOCX", "XLSX", "CSV", "TXT"];

export default function DocumentFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}: DocumentFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.searchQuery.trim()) ||
    filters.statusFilter !== "all" ||
    filters.typeFilter !== "all";

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* حقل البحث */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            placeholder="بحث باسم المستند، المحتوى الدلالي، أو الامتداد..."
            className="w-full bg-slate-50/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pr-9 pl-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
            dir="rtl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* عدد النتائج */}
        <span className="text-xs font-semibold text-slate-400 self-start sm:self-auto font-mono">
          عرض <strong className="text-blue-600 dark:text-blue-400">{filteredCount}</strong> من أصل {totalCount} مستندات
        </span>
      </div>

      {/* الفلاتر */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold pl-1">
            <Filter className="w-3.5 h-3.5 text-blue-500" />
            <span>تصفية الفهرس:</span>
          </div>

          {/* تصفية الحالة */}
          <select
            value={filters.statusFilter}
            onChange={(e) =>
              onFilterChange({ ...filters, statusFilter: e.target.value })
            }
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
            dir="rtl"
          >
            {DOCUMENT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* تصفية النوع */}
          <select
            value={filters.typeFilter}
            onChange={(e) =>
              onFilterChange({ ...filters, typeFilter: e.target.value })
            }
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
            dir="rtl"
          >
            <option value="all">كافة الامتدادات</option>
            {DOCUMENT_TYPES.filter((t) => t !== "all").map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* زر إعادة التعيين */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
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
