/**
 * خدمة التقارير وسجلات التصدير (Reports Service)
 * تدعم التبديل السلس بين وضع المحاكاة (Mock) والاتصال الفعلي بخادم FastAPI.
 */

import { ReportItem, ReportFilterOptions } from "@/types/reports.types";
import { mockReports } from "@/mocks/reports.mock";
import { USE_MOCK_API, API_ENDPOINTS } from "@/lib/api-config";
import { apiRequest } from "@/lib/api-client";

let localReports: ReportItem[] = [...mockReports];

export async function getReports(
  filters?: Partial<ReportFilterOptions>,
  options: { delayMs?: number; forceError?: boolean } = {}
): Promise<ReportItem[]> {
  const { delayMs = 200, forceError = false } = options;

  if (USE_MOCK_API) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    if (forceError) {
      throw new Error("تعذر جلب قائمة التقارير التجريبية، يرجى المحاولة مرة أخرى.");
    }

    let filtered = [...localReports];

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.format.toLowerCase().includes(q) ||
          r.categoryLabel.toLowerCase().includes(q)
      );
    }

    if (filters?.categoryFilter && filters.categoryFilter !== "all") {
      filtered = filtered.filter((r) => r.category === filters.categoryFilter);
    }

    if (filters?.formatFilter && filters.formatFilter !== "all") {
      filtered = filtered.filter((r) => r.format === filters.formatFilter);
    }

    if (filters?.statusFilter && filters.statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === filters.statusFilter);
    }

    return filtered;
  }

  // الاتصال الفعلي بـ FastAPI
  return await apiRequest<ReportItem[]>(API_ENDPOINTS.REPORTS.LIST, {
    method: "GET",
    params: {
      search: filters?.searchQuery,
      category: filters?.categoryFilter !== "all" ? filters?.categoryFilter : undefined,
      format: filters?.formatFilter !== "all" ? filters?.formatFilter : undefined,
      status: filters?.statusFilter !== "all" ? filters?.statusFilter : undefined,
    },
  });
}

export async function retryGenerateReportMock(reportId: string): Promise<ReportItem> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = localReports.findIndex((r) => r.id === reportId);
    if (index === -1) {
      throw new Error("التقرير غير موجود.");
    }

    const updated: ReportItem = {
      ...localReports[index],
      status: "ready",
      statusLabel: "جاهز للمعاينة",
      createdAt: "الآن • تم التحديث (محاكاة)",
    };

    localReports = [
      ...localReports.slice(0, index),
      updated,
      ...localReports.slice(index + 1),
    ];

    return updated;
  }

  return await apiRequest<ReportItem>(API_ENDPOINTS.REPORTS.DETAIL(reportId), {
    method: "POST",
  });
}

export const retryGenerateReport = retryGenerateReportMock;

export async function deleteReportMock(reportId: string): Promise<boolean> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localReports = localReports.filter((r) => r.id !== reportId);
    return true;
  }

  await apiRequest(API_ENDPOINTS.REPORTS.DETAIL(reportId), {
    method: "DELETE",
  });
  return true;
}

export const deleteReport = deleteReportMock;

export async function downloadReport(reportId: string): Promise<Blob | unknown> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return new Blob(["Mock report content"], { type: "application/pdf" });
  }

  return await apiRequest(API_ENDPOINTS.REPORTS.DOWNLOAD(reportId), {
    method: "GET",
  });
}
