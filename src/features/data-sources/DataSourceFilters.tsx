"use client";

import React from "react";
import { Search, Filter, Plus, RotateCcw } from "lucide-react";
import { DataSourceFilterOptions } from "@/types/dataSources.types";

interface DataSourceFiltersProps {
  filters: DataSourceFilterOptions;
  onFilterChange: (filters: DataSourceFilterOptions) => void;
  onAddNewClick: () => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export const DATA_SOURCE_TYPES = [
  "all",
  "PostgreSQL",
  "MySQL",
  "REST API",
  "CSV / Excel",
  "MongoDB",
];

export const DATA_SOURCE_STATUSES = [
  { value: "all", label: "كافة الحالات" },
  { value: "connected", label: "متصل ومعتمد" },
  { value: "syncing", label: "قيد المزامنة" },
  { value: "disconnected", label: "غير متصل" },
  { value: "error", label: "تنبيه / غير متاح" },
];

export default function DataSourceFilters({
  filters,
  onFilterChange,
  onAddNewClick,
  onResetFilters,
  totalCount,
  filteredCount,
}: DataSourceFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.searchQuery.trim()) ||
    filters.typeFilter !== "all" ||
    filters.statusFilter !== "all";

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 shadow-xs space-y-3">
      {/* 1. الصف العلوي: البحث والزر الأساسي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* حقل البحث بالاسم أو النوع */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            placeholder="بحث باسم المصدر، النوع، أو المخطط..."
            className="w-full bg-slate-50/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pr-9 pl-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
            dir="rtl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* زر إضافة مصدر جديد */}
        <button
          type="button"
          onClick={onAddNewClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مصدر بيانات جديد</span>
        </button>
      </div>

      {/* 2. الصف السفلي: فلاتر التصنيف والحالة */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold pl-1">
            <Filter className="w-3.5 h-3.5 text-blue-500" />
            <span>تصفية المخططات:</span>
          </div>

          {/* تصفية النوع */}
          <select
            value={filters.typeFilter}
            onChange={(e) =>
              onFilterChange({ ...filters, typeFilter: e.target.value })
            }
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
            dir="rtl"
          >
            <option value="all">كافة الأنواع</option>
            {DATA_SOURCE_TYPES.filter((t) => t !== "all").map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* تصفية الحالة */}
          <select
            value={filters.statusFilter}
            onChange={(e) =>
              onFilterChange({ ...filters, statusFilter: e.target.value })
            }
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
            dir="rtl"
          >
            {DATA_SOURCE_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* زر إعادة التعيين عند وجود فلاتر نشطة */}
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

        {/* عدد النتائج */}
        <span className="text-[11px] font-medium text-slate-400">
          عرض <strong className="text-blue-600 dark:text-blue-400 font-mono">{filteredCount}</strong> من أصل <span className="font-mono">{totalCount}</span> مصادر معرفة
        </span>
      </div>
    </div>
  );
}
