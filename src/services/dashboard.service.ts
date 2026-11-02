/**
 * خدمة جلب بيانات لوحة التحكم (Dashboard Service)
 * تدعم التبديل السلس بين وضع المحاكاة (Mock) والاتصال الفعلي بخادم FastAPI.
 */

import { DashboardData } from "@/types/dashboard.types";
import { mockDashboardData } from "@/mocks/dashboard.mock";
import { USE_MOCK_API, API_ENDPOINTS } from "@/lib/api-config";
import { apiRequest } from "@/lib/api-client";

export interface FetchDashboardOptions {
  simulateDelayMs?: number;
  forceError?: boolean;
  forceEmpty?: boolean;
}

export async function getDashboardData(
  options: FetchDashboardOptions = {}
): Promise<DashboardData> {
  const { simulateDelayMs = 0, forceError = false, forceEmpty = false } = options;

  if (USE_MOCK_API) {
    if (simulateDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulateDelayMs));
    }

    if (forceError) {
      throw new Error("تعذر جلب البيانات التجريبية، يرجى إعادة المحاولة.");
    }

    if (forceEmpty) {
      return {
        isMockData: true,
        metrics: [],
        recentActivities: [],
        recentReports: [],
      };
    }

    return mockDashboardData;
  }

  // الاتصال الفعلي بـ FastAPI
  return await apiRequest<DashboardData>(API_ENDPOINTS.DASHBOARD.SUMMARY, {
    method: "GET",
  });
}
