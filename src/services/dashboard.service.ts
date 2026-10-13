import { DashboardData } from "@/types/dashboard.types";
import { mockDashboardData } from "@/mocks/dashboard.mock";

export interface FetchDashboardOptions {
  simulateDelayMs?: number;
  forceError?: boolean;
  forceEmpty?: boolean;
}

/**
 * خدمة جلب بيانات لوحة التحكم (Dashboard Service)
 * معزولة تماماً لتقرأ محلياً من ملف الـ Mock وتُرجع وعوداً (Promises)،
 * لتكون جاهزة للربط مع خادم حقيقي (FastAPI/Backend) لاحقاً دون تعديل واجهات العرض.
 */
export async function getDashboardData(
  options: FetchDashboardOptions = {}
): Promise<DashboardData> {
  const { simulateDelayMs = 0, forceError = false, forceEmpty = false } = options;

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
