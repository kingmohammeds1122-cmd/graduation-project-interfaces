import { ReportItem, ReportFilterOptions } from "@/types/reports.types";
import { mockReports } from "@/mocks/reports.mock";

/**
 * خدمة التقارير (Reports Service)
 * معزولة تماماً وتُدار محلياً عبر الوعود (Promises) استناداً إلى بيانات الـ Mock،
 * مهيأة مستقبلاً للربط مع خدمات الـ Backend وتوليد التقارير الفعلية.
 */

let localReports: ReportItem[] = [...mockReports];

export async function getReports(
  filters?: Partial<ReportFilterOptions>,
  options: { delayMs?: number; forceError?: boolean } = {}
): Promise<ReportItem[]> {
  const { delayMs = 200, forceError = false } = options;

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

export async function retryGenerateReportMock(reportId: string): Promise<ReportItem> {
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

export async function deleteReportMock(reportId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  localReports = localReports.filter((r) => r.id !== reportId);
  return true;
}
