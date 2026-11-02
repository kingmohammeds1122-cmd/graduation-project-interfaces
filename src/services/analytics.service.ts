/**
 * خدمة التحليلات ومؤشرات الأداء (Analytics Service)
 * تدعم التبديل السلس بين وضع المحاكاة (Mock) والاتصال الفعلي بخادم FastAPI.
 */

import {
  AnalyticsDataSet,
  AnalyticsFilterOptions,
} from "@/types/analytics.types";
import { mockAnalyticsDataByRange } from "@/mocks/analytics.mock";
import { USE_MOCK_API, API_ENDPOINTS } from "@/lib/api-config";
import { apiRequest } from "@/lib/api-client";

export async function getAnalyticsData(
  filters: AnalyticsFilterOptions = { timeRange: "30d", metricType: "all" },
  options: { delayMs?: number; forceError?: boolean } = {}
): Promise<AnalyticsDataSet> {
  const { delayMs = 250, forceError = false } = options;

  if (USE_MOCK_API) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    if (forceError) {
      throw new Error("تعذر جلب بيانات التحليلات التجريبية، يرجى إعادة المحاولة.");
    }

    const baseData =
      mockAnalyticsDataByRange[filters.timeRange] || mockAnalyticsDataByRange["30d"];

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

  // الاتصال الفعلي بـ FastAPI
  return await apiRequest<AnalyticsDataSet>(API_ENDPOINTS.ANALYTICS.SUMMARY, {
    method: "GET",
    params: {
      time_range: filters.timeRange,
      metric_type: filters.metricType !== "all" ? filters.metricType : undefined,
    },
  });
}

export async function queryAnalytics(queryPayload: Record<string, unknown>): Promise<unknown> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, message: "استعلام تحليلات تجريبي ناجح.", queryPayload };
  }

  return await apiRequest(API_ENDPOINTS.ANALYTICS.QUERY, {
    method: "POST",
    body: JSON.stringify(queryPayload),
  });
}
