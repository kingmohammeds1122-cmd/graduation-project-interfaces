"use client";

import React from "react";
import { Filter, Calendar, BarChart3, Info } from "lucide-react";
import {
  AnalyticsFilterOptions,
  AnalyticsTimeRange,
  AnalyticsMetricType,
} from "@/types/analytics.types";

interface AnalyticsFiltersProps {
  filters: AnalyticsFilterOptions;
  onFilterChange: (newFilters: AnalyticsFilterOptions) => void;
  isLoading: boolean;
}

const TIME_RANGES: { value: AnalyticsTimeRange; label: string }[] = [
  { value: "7d", label: "آخر 7 أيام" },
  { value: "30d", label: "آخر 30 يوماً" },
  { value: "90d", label: "آخر 90 يوماً" },
  { value: "12m", label: "آخر 12 شهراً" },
];

const METRIC_TYPES: { value: AnalyticsMetricType; label: string }[] = [
  { value: "all", label: "كافة المؤشرات" },
  { value: "queries", label: "الاستفسارات فقط" },
  { value: "response_time", label: "زمن الاستجابة فقط" },
  { value: "sources", label: "المصادر فقط" },
];

export default function AnalyticsFilters({
  filters,
  onFilterChange,
  isLoading,
}: AnalyticsFiltersProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* أزرار الفترة الزمنية */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 pl-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>النطاق الزمني:</span>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            {TIME_RANGES.map((range) => {
              const isActive = filters.timeRange === range.value;
              return (
                <button
                  key={range.value}
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    onFilterChange({ ...filters, timeRange: range.value })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-blue-700 shadow-xs border border-slate-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* تصفية نوع المؤشر */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 pl-1">
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span>تركيز التحليل:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {METRIC_TYPES.map((type) => {
              const isActive = filters.metricType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    onFilterChange({ ...filters, metricType: type.value })
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-blue-300 shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* شريط الإيضاح المرجعي */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            تغيير الفلاتر يحدّث العينات التجريبية محلياً للمعاينة، ولا يرتبط بأي استعلام خادم حقيقي.
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[10px]">
          <Info className="w-3 h-3 text-slate-400" />
          <span>معاينة تفاعلية (Mock Preview)</span>
        </span>
      </div>
    </div>
  );
}
