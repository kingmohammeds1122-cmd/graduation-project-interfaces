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
  { value: "connected", label: "متصل تجريبياً" },
  { value: "syncing", label: "قيد المزامنة" },
  { value: "disconnected", label: "غير متصل" },
  { value: "error", label: "تنبيه / خطأ" },
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
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
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
            placeholder="بحث باسم المصدر، النوع، أو الوصف..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-9 pl-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            dir="rtl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* زر إضافة مصدر تجريبي جديد */}
        <button
          type="button"
          onClick={onAddNewClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-blue-600/30 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مصدر تجريبي</span>
        </button>
      </div>

      {/* 2. الصف السفلي: فلاتر التصنيف والحالة */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold pl-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>التصفية:</span>
          </div>

          {/* تصفية النوع */}
          <select
            value={filters.typeFilter}
            onChange={(e) =>
              onFilterChange({ ...filters, typeFilter: e.target.value })
            }
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
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
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
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
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>

        {/* عدد النتائج */}
        <span className="text-[11px] font-medium text-slate-400">
          عرض {filteredCount} من أصل {totalCount} مصادر محاكاة
        </span>
      </div>
    </div>
  );
}
