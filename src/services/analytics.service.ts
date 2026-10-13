import {
  AnalyticsDataSet,
  AnalyticsFilterOptions,
} from "@/types/analytics.types";
import { mockAnalyticsDataByRange } from "@/mocks/analytics.mock";

/**
 * خدمة التحليلات (Analytics Service)
 * معزولة ومبنية عبر الوعود (Promises) لجلب بيانات المؤشرات والرسوم التجريبية محلياً.
 * مهيأة مستقبلاً للربط بنقاط نهاية الـ Backend للتحليلات دون المساس بواجهات العرض.
 */

export async function getAnalyticsData(
  filters: AnalyticsFilterOptions = { timeRange: "30d", metricType: "all" },
  options: { delayMs?: number; forceError?: boolean } = {}
): Promise<AnalyticsDataSet> {
  const { delayMs = 250, forceError = false } = options;

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  if (forceError) {
    throw new Error("تعذر جلب بيانات التحليلات التجريبية، يرجى إعادة المحاولة.");
  }

  const baseData = mockAnalyticsDataByRange[filters.timeRange] || mockAnalyticsDataByRange["30d"];

  // تصفية المؤشرات وفق نوع المؤشر المختار إذا لم يكن 'all'
  let filteredKpis = [...baseData.kpis];
  if (filters.metricType === "queries") {
    filteredKpis = filteredKpis.filter((k) => k.id === "kpi-queries");
  } else if (filters.metricType === "response_time") {
    filteredKpis = filteredKpis.filter((k) => k.id === "kpi-latency");
  } else if (filters.metricType === "sources") {
    filteredKpis = filteredKpis.filter((k) => k.id === "kpi-sources");
  }

  return {
    ...baseData,
    filters,
    kpis: filteredKpis,
  };
}
