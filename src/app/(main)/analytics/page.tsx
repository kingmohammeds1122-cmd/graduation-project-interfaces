"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Loader2,
  AlertCircle,
  Info,
  Layers,
} from "lucide-react";
import {
  AnalyticsDataSet,
  AnalyticsFilterOptions,
} from "@/types/analytics.types";
import { mockAnalyticsDataByRange } from "@/mocks/analytics.mock";
import { getAnalyticsData } from "@/services/analytics.service";
import AnalyticsFilters from "@/features/analytics/AnalyticsFilters";
import AnalyticsKpiGrid from "@/features/analytics/AnalyticsKpiGrid";
import AnalyticsTrendChart from "@/features/analytics/AnalyticsTrendChart";
import AnalyticsCategoryChart from "@/features/analytics/AnalyticsCategoryChart";
import AnalyticsDistributionCard from "@/features/analytics/AnalyticsDistributionCard";

export default function AnalyticsPage() {
  // تهيئة الحالة المباشرة ببيانات Mock لتفادي استدعاءات useEffect المزامنة في React 19
  const [data, setData] = useState<AnalyticsDataSet>(mockAnalyticsDataByRange["30d"]);
  const [filters, setFilters] = useState<AnalyticsFilterOptions>({
    timeRange: "30d",
    metricType: "all",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // تحديث البيانات بناءً على تفاعل الفلاتر
  const handleFilterChange = async (newFilters: AnalyticsFilterOptions) => {
    setFilters(newFilters);
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAnalyticsData(newFilters, { delayMs: 180 });
      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("تعذر تحديث بيانات التحليلات التجريبية.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAnalyticsData(filters, { delayMs: 250 });
      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("تعذر إعادة تحميل التحليلات.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty =
    data.kpis.length === 0 &&
    data.trend.points.length === 0 &&
    data.categories.items.length === 0;

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* 1. الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              التحليلات ومؤشرات الأداء
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              معاينة تجريبية
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            متابعة نمو الاستفسارات، زمن الاستجابة الافتراضي، وتوزيع مصادر المعرفة
          </p>
        </div>

        <button
          type="button"
          onClick={handleReload}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer disabled:opacity-60"
        >
          <RotateCcw
            className={`w-3.5 h-3.5 text-slate-500 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          <span>تحديث التحليلات</span>
        </button>
      </div>

      {/* 2. شريط تنبيه الشفافية والمحاكاة التجريبية الصريح */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-800 leading-relaxed">
          <p className="font-bold">
            تنبيه الشفافية: كافة المؤشرات والرسوم البيانية أدناه هي عينات تجريبية افتراضية (Mock Analytics).
          </p>
          <p className="text-amber-700 text-[11px]">
            لا تعكس هذه الأرقام بيانات استعلام فعلية أو اتصالات بقواعد بيانات إنتاجية حقيقية. تم تصميم الرسوم بمحاور ووحدات صريحة لتوضيح تجربة المستخدم واختبار الواجهة قبل الربط بنقاط الـ Backend.
          </p>
        </div>
      </div>

      {/* 3. أدوات التصفية والفترة الزمنية */}
      <AnalyticsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />

      {/* 4. عرض المحتوى أو حالات التحميل والخطأ والفراغ */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center space-y-3 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-600 font-semibold">
            جاري تحديث الرسوم والمؤشرات التجريبية...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl border border-rose-200 p-10 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">{error}</h4>
          <button
            type="button"
            onClick={handleReload}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : isEmpty ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            لا توجد بيانات تحليلية مطابقة للمرشحات
          </h4>
          <p className="text-xs text-slate-500">
            جرّب تغيير النطاق الزمني أو اختيار «كافة المؤشرات».
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* بطاقات المؤشرات الرئيسية KPIs */}
          <AnalyticsKpiGrid kpis={data.kpis} />

          {/* الرسم البياني للاتجاه الزمني (Trend Area/Line SVG) */}
          <AnalyticsTrendChart
            title={data.trend.title}
            description={data.trend.description}
            unit={data.trend.unit}
            periodLabel={data.trend.periodLabel}
            points={data.trend.points}
          />

          {/* شبكة رسوم المقارنة والتوزيع */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* مخطط مقارنة الفئات (Category Bar Chart) */}
            <AnalyticsCategoryChart
              title={data.categories.title}
              description={data.categories.description}
              unit={data.categories.unit}
              items={data.categories.items}
            />

            {/* بطاقة توزيع أنماط المهام (Distribution Breakdown) */}
            <AnalyticsDistributionCard
              title={data.distribution.title}
              description={data.distribution.description}
              items={data.distribution.items}
            />
          </div>
        </div>
      )}

      {/* 5. أدوات فحص المطور (تظهر في بيئة التطوير فقط) */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 text-[11px] flex flex-wrap items-center justify-between gap-2">
          <span>أدوات فحص واجهة التحليلات (بيئة التطوير فقط):</span>
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
                setData(mockAnalyticsDataByRange["30d"]);
                setFilters({ timeRange: "30d", metricType: "all" });
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
